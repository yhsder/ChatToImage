# GPT Image 2 在目标部署环境中的可靠执行约束

日期：2026-08-24

## 研究问题

基于 OpenAI、TanStack Start、Nitro、Cloudflare Workers 与 OpenNext 的第一方资料，最长约两分钟的 GPT Image 2 请求，在本仓库支持的 Node.js 与 Cloudflare Workers 部署方式下，怎样才能不依赖浏览器连接，并在刷新、断开或运行时重启后恢复？

本文只锁定运行时事实和由事实直接推出的工程边界，不替后续架构票选择具体实现。

## 结论摘要

1. GPT Image 2 的 Image API 是一次 HTTP 请求返回最终图片的接口。复杂提示词可能处理两分钟；非流式响应直接返回 base64，流式响应通过事件返回局部图和最终 base64。官方公开的 Images 响应没有可供稍后查询的 provider job ID。
2. Cloudflare 的 HTTP Worker 在客户端保持连接时没有硬墙钟上限，但响应完成或客户端断开后，未完成工作可能被取消；`ctx.waitUntil()` 只能再延长最多 30 秒，所以它不能承载最长约两分钟的生成。
3. Cloudflare Queues 和 Workflows 都能脱离浏览器请求执行两分钟任务。Queue consumer 墙钟上限 15 分钟，但至少投递一次；Workflow 单步墙钟不限且会持久化步骤状态，但步骤也可能重试。两者都不能把 OpenAI 调用当成“恰好一次”。
4. Nitro 的 Node server 可以等待普通 HTTP 请求，但默认收到关闭信号后仅给 30 秒优雅退出时间。Nitro Tasks 仍是实验能力，文档没有给出持久投递、重启恢复或自动重试保证。单纯创建一个未等待的 Promise、`waitUntil` 或 Nitro Task，都不能把 Node 部署变成可靠任务系统。
5. 页面刷新恢复必须依赖服务端持久化任务，而不是原始生成请求。统一边界应是“先保存内部任务，快速返回内部 task ID，客户端按 task ID 查询”；真正执行必须由部署平台的独立执行器接手。
6. Cloudflare 与 Node 可以共享任务状态机、API、积分和存储逻辑，但不能假设共享同一种后台执行原语。Cloudflare 有 Queue/Workflow；当前 Node 部署没有等价的持久执行器。
7. 首版参考图上限为 10MB，而 Queue 消息上限 128KB、Workflow 事件上限 1MiB；GPT Image 2 输出又是 base64。调度载荷只能传 task ID 或对象存储 key，不能内嵌输入图或输出图。

## 1. OpenAI Image API 的调用形态

### 已确认事实

- OpenAI 建议单次生成或编辑一张图片时使用 Image API。`POST /v1/images/generations` 返回 `ImagesResponse`；GPT Image 模型默认返回 base64 图片数据。[OpenAI Image generation guide](https://developers.openai.com/api/docs/guides/image-generation)；[Generate an Image API reference](https://developers.openai.com/api/reference/resources/images/methods/generate)
- `gpt-image-2` 支持 `stream: true`，流中可以出现 `image_generation.partial_image` 和 `image_generation.completed`，但最终结果仍在当前 HTTP 流内返回。[Generate an Image API reference](https://developers.openai.com/api/reference/resources/images/methods/generate)
- 复杂提示词可能需要最多约两分钟。官方还明确区分：429、5xx 等瞬时失败适合重试；`image_generation_user_error`（包括 `moderation_blocked`）不能在不修改输入时自动重试。[OpenAI Image generation guide](https://developers.openai.com/api/docs/guides/image-generation)
- GPT Image 2 的公开 Images 响应字段是创建时间、图片数据、格式、质量、尺寸和 usage 等。Image API 参考中没有对应的“查询生成任务”或“取消生成任务”端点。[Generate an Image API reference](https://developers.openai.com/api/reference/resources/images/methods/generate)

### 直接推论

- “开启流式返回”只能改善仍在线用户的等待体验，不能解决刷新、断开或服务重启后的恢复。
- 如果 OpenAI 已完成生成，但执行器在收到完整响应前后发生网络故障，应用无法通过 provider job ID 查询这次生成是否成功。官方 API 面没有给出跨 OpenAI 调用与本地数据库的恰好一次事务。
- 因此 Queue 重投、Workflow 步骤重试或 Node recovery 都存在一个不可消除的模糊区间：再次调用可能产生第二张图片及第二次 provider 成本。后续架构必须明确接受、限制并观测这种风险，不能声称“绝不重复调用”。

## 2. Cloudflare HTTP Worker 与 `waitUntil`

### 已确认事实

- HTTP Worker 在客户端保持连接时没有硬墙钟上限；等待外部 `fetch()` 不计 CPU 时间，单个 subrequest 也没有固定时限。[Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- 响应结束或客户端断开后，请求关联的任务可能被取消。`ctx.waitUntil()` 最多只把执行延长 30 秒，而且同一请求的多个 `waitUntil()` 共享这 30 秒。[Workers limits](https://developers.cloudflare.com/workers/platform/limits/)；[Context API](https://developers.cloudflare.com/workers/runtime-apis/context/)
- Cloudflare 明确要求：后台异步调用必须 `await` 或交给 `waitUntil()`；超过 30 秒的后台工作应发送到 Queue。[Context API](https://developers.cloudflare.com/workers/runtime-apis/context/)
- Workers Free 每次 HTTP 请求只有 10ms CPU；Paid 默认 30 秒、可配到 5 分钟。网络等待不计 CPU，但 JSON 解析、base64 解码、鉴权、数据库访问和序列化会计入 CPU。每个 isolate 内存上限 128MB。[Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- Cloudflare 运行时更新时只给正在执行的请求 30 秒完成；官方认为与长请求碰撞的概率低，但不是零。[Workers limits](https://developers.cloudflare.com/workers/platform/limits/)

### 直接推论

- “API route 内直接等待 OpenAI 两分钟，然后把图片回给页面”只在浏览器持续连接且 Worker 没有遇到运行时更新时成立，不满足刷新/断开恢复要求。
- “先返回 202，再用 `ctx.waitUntil(generate())`”也不成立：OpenAI 官方最长耗时约两分钟，Cloudflare 的断开后宽限只有 30 秒。
- 即使外部 `fetch` 几乎不耗 CPU，Free plan 的 10ms CPU 也不能被视为足以可靠处理鉴权、任务事务、大型 base64 和存储写入。是否能在 Free plan 运行必须用最坏分辨率实测，不能从“网络等待不计 CPU”推出可用。
- API 返回应与生成执行解耦。页面断开只结束状态查询或 UI 流，不应拥有生成任务的生命周期。

## 3. Cloudflare Queues

### 已确认事实

- Queue consumer 单次调用墙钟上限 15 分钟，默认 CPU 30 秒、可配到 5 分钟；等待网络不计 CPU。两分钟 OpenAI 请求在墙钟限制内。[Queues limits](https://developers.cloudflare.com/queues/platform/limits/)
- Queues 默认提供至少一次投递：消息不会被有意丢弃，但极少数情况下可能投递多次。官方要求对有副作用的处理使用唯一 ID、数据库主键或上游幂等键去重。[Queue delivery guarantees](https://developers.cloudflare.com/queues/reference/delivery-guarantees/)
- consumer 失败默认重试三次，可配置重试、延迟和 DLQ；消息也可以逐条 `ack()` 或 `retry()`。[Batching, Retries and Delays](https://developers.cloudflare.com/queues/configuration/batching-retries/)
- 单条 Queue 消息最大 128KB。[Queues limits](https://developers.cloudflare.com/queues/platform/limits/)

### 直接推论

- Queue 的时长足够，但它保证的是“至少投递一次”，不是“OpenAI 恰好调用一次”。内部 task ID 可以去重数据库状态迁移，却无法确认一次丢失响应的 OpenAI 调用是否已经计费和产图。
- 参考图和输出图都不能放入 Queue 消息。消息只应携带内部 task ID、attempt ID 或很小的对象存储引用。
- Queue 自身没有业务级的用户任务状态。刷新恢复仍必须查询 `ai_task`（或等价持久化记录），而不是查询浏览器请求或 Queue batch。
- 数据库提交任务与 `queue.send()` 是两个系统中的操作，不构成一个原子事务。若进程在两者之间停止，会出现“有任务无消息”或客户端重试造成重复任务；需要可重放的 dispatch 记录或 reconciliation 才能闭合该窗口。

## 4. Cloudflare Workflows

### 已确认事实

- Workflows 为步骤提供持久状态、自动重试和错误处理，可持续数分钟到数周。[Cloudflare Workflows](https://developers.cloudflare.com/workflows/)
- Workflow 单步墙钟不限；Paid 默认每步 30 秒 CPU、可配到 5 分钟，Free 每步 10ms CPU。非流式步骤返回值最大 1MiB，事件 payload 最大 1MiB；JavaScript Workflow 允许持久化 `ReadableStream<Uint8Array>`，大对象也可放到 R2 后只返回引用。[Workflow limits](https://developers.cloudflare.com/workflows/reference/limits/)；[Workers API](https://developers.cloudflare.com/workflows/build/workers-api/)
- Workflow instance 有唯一 ID，并提供 `queued`、`running`、`waiting`、`errored`、`complete` 等状态以及 `status()` 查询。实例完成后的状态保留期为 Free 3 天、Paid 最长 30 天。[Workers API](https://developers.cloudflare.com/workflows/build/workers-api/)；[Workflow limits](https://developers.cloudflare.com/workflows/reference/limits/)
- Cloudflare 明确说明步骤可能重试，外部 API/Binding 调用应幂等；运行时可重启，步骤外的副作用可能重复。[Rules of Workflows](https://developers.cloudflare.com/workflows/build/rules-of-workflows/)
- `create()` 使用已存在且仍在保留期内的 ID 会报错；`createBatch()` 对重复 ID 是幂等的，会跳过已存在实例。[Workers API](https://developers.cloudflare.com/workflows/build/workers-api/)

### 直接推论

- 从“脱离浏览器、持久状态、两分钟网络等待”三个维度看，Workflow 是 Cloudflare 原生能力中匹配度最高的执行原语；这不等于 OpenAI 调用本身变成恰好一次。
- 10MB 参考图不能放入 1MiB Workflow payload。GPT Image 的 base64 输出通常也不能作为普通步骤返回值处理。Workflow 只能接收对象存储 key，并把大输出流持久化或直接写入对象存储，步骤之间只传 key、hash 和元数据。
- 业务任务仍应是产品侧的权威记录。Workflow instance 状态保留期有限，并且不包含本仓库积分、用户所有权和软删除语义；可以把内部 task ID 用作关联 ID，但不能让 Workflow 状态替代 `ai_task`。
- 对 `moderation_blocked` 等用户错误应转为不可重试业务失败；对 429/5xx 可按 OpenAI 指引重试；对“请求可能已由 OpenAI 接受但响应未知”的错误必须单独记录为 ambiguous，而不是无条件重试并宣称没有重复成本。

## 5. Node.js + Nitro

### 已确认事实

- 本仓库默认 `pnpm build` 生成 Nitro `node_server` 输出，并用 `node .output/server/index.mjs` 启动。`pnpm cf:build` 才显式设置 `NITRO_PRESET=cloudflare_module`。这些脚本与 TanStack Start 官方的 Nitro/Node 部署形态一致。[package.json](../../package.json)；[TanStack Start Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)；[Nitro Node.js runtime](https://nitro.build/deploy/runtimes/node)
- Nitro Node server 默认监听 `SIGINT SIGTERM`，默认优雅关闭超时为 30,000ms，随后强制退出；超时可由 `NITRO_SHUTDOWN_TIMEOUT` 调整。[Nitro Node.js runtime](https://nitro.build/deploy/runtimes/node)
- Nitro Tasks 目前是实验能力。`runTask()` 在调用方内等待任务，错误向调用方传播；`context.waitUntil` 只是在部分运行时可用。Nitro Tasks 文档没有承诺持久消息、进程重启恢复或自动重试。[Nitro Tasks](https://nitro.build/docs/tasks)

### 直接推论

- 自托管 Node 进程在连接仍在时可以等待 OpenAI，但默认部署关闭窗口只有 30 秒，短于最坏约两分钟。提高优雅关闭超时只能改善正常发布，不能处理进程崩溃、主机丢失或任务无人重新领取。
- 未等待 Promise、进程内队列和实验性的 Nitro Task 都会把任务生命周期绑定到当前 Node 进程。当前仓库没有持久 worker、lease、outbox dispatcher 或 stale-task reconciler，因此不能把现有 Node 构建称为刷新/重启可恢复。
- Node 方案要达到与 Cloudflare Queue/Workflow 相同的保证，必须另有一个持久执行器，并从数据库领取/续租任务。具体使用哪一种执行器取决于最终 Node 托管平台，不应在未确定平台时假设。

## 6. TanStack Start、Nitro 与 OpenNext 的适用边界

### 已确认事实

- TanStack Start 官方把 Cloudflare Vite plugin 作为当前官方 Workers 方案，也把 Nitro 标为可部署到多种运行时的替代层。本仓库选择的是 `nitro/vite`。[TanStack Start Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)；[vite.config.ts](../../vite.config.ts)
- Cloudflare 的 TanStack Start 指南明确允许在自定义 server entrypoint 中增加 Queue handler、Cron handler、Durable Object 和 Workflow export。[Cloudflare TanStack Start guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)
- Nitro 的 `cloudflare_module` preset 支持 `cloudflare:queue` runtime hook；额外的 Workflow export 可放在根目录 `exports.cloudflare.ts`，Nitro 会把它合入 Worker 输出。[Nitro Cloudflare provider](https://nitro.build/deploy/providers/cloudflare)
- OpenNext Cloudflare 适配器面向 Next.js，构建输出为 `.open-next/worker.js`；本仓库没有 Next.js 或 `@opennextjs/cloudflare`，输出是 Nitro `.output`。[OpenNext Cloudflare Get Started](https://opennext.js.org/cloudflare/get-started)；[package.json](../../package.json)

### 直接推论

- 不应把 OpenNext 的 `getCloudflareContext()`、build output 或 adapter hooks 引入本仓库。它们属于 Next.js adapter，不是 TanStack Start/Nitro 的可移植 API。
- Cloudflare 后台执行可以通过 Nitro 的 Queue hook 和 `exports.cloudflare.ts` 接入，无需把首页或 API route 改造成 Next.js。
- 与 Cloudflare 绑定相关的代码必须留在部署适配层；业务模块只处理任务状态、OpenAI 参数、积分和存储引用，才能保持 Node 构建可用。

## 7. 本仓库当前能力与缺口

### 已有基础

- `ai_task` 已有内部 ID、用户、provider、model、prompt、status、provider task ID、task info/result、积分成本和 credit ID 字段。[schema.sqlite.ts](../../src/config/db/schema.sqlite.ts)
- `createTask()` 已把“创建任务 + 扣积分”放在同一个数据库事务里；`updateTask(FAILED)` 会尝试返还积分。[ai-tasks/service.ts](../../src/modules/ai-tasks/service.ts)
- `src/server.ts` 是自定义 fetch entrypoint，Cloudflare env 已通过 `cloudflare:workers` 注入；`wrangler.example.jsonc` 已为 D1/Hyperdrive 预留配置，R2 仍仅是注释示例。[server.ts](../../src/server.ts)；[wrangler.example.jsonc](../../wrangler.example.jsonc)

### 尚不存在

- 首页没有生成 API，`aiManager` 没有注册 OpenAI provider，`ai-tasks` service 没有调用者。
- `src/server.ts` 只导出 fetch handler，没有 Queue consumer；仓库根目录没有 `exports.cloudflare.ts` 或 Workflow binding。
- `createTask()` 接收 `options` 却没有写入 schema 的 `options` 字段；当前任务记录不足以重建宽高比、分辨率、质量和参考图 key。
- 任务没有可查询的 attempt/lease/dispatch 状态、重试次数、stale deadline 或 CAS 状态迁移，也没有扫描 pending/processing 任务的 recovery worker。
- 当前 `updateTask()` 只在显式 `FAILED` 时返还积分；进程中断后永久停留在 pending/processing 的任务没有自动结算路径。
- Cloudflare 示例配置没有 Queue、Workflow 或启用的 R2 binding。Node 配置也没有独立 worker 进程。

## 8. 被运行时事实锁定的统一契约

以下不是具体实现选型，而是任何可恢复方案都必须满足的边界：

1. **任务先于执行存在。** 在调用 OpenAI 前，服务端必须有用户可查询的内部 task ID、完整生成参数、积分状态和输入对象 key。
2. **提交请求快速结束。** 首页提交接口返回内部 task ID；生成完成不依赖这个 HTTP 响应继续存在。
3. **刷新只恢复观察，不重新提交。** 页面通过用户鉴权的 task 查询接口恢复 pending/processing/success/failed；刷新或换设备不会隐式再次调用 OpenAI。
4. **执行载荷只传引用。** 参考图先进入对象存储；Queue/Workflow/Node worker 只领取 task ID。生成结果进入对象存储，`taskResult` 只保存 key、URL、hash、格式、尺寸和 provider request ID。
5. **执行器按平台适配。** Cloudflare 使用 Queue 或 Workflow；Node 必须配置真正持久的 worker/queue 后才能宣称可恢复。两边共享业务 service，不共享运行时 binding。
6. **任务状态迁移必须可重入。** 重复投递只能让一个 attempt 获得 lease；完成、失败和积分返还要条件更新且可重复调用。
7. **必须承认 ambiguous outcome。** OpenAI 没有可查询的 Image job ID。执行器在 provider 已处理但响应丢失时，不能证明成功或安全重试；状态、日志、成本和人工/自动 reconciliation 必须能区分该情况。
8. **dispatch gap 必须可恢复。** 数据库提交与 Queue/Workflow 创建不原子；必须能发现“已扣积分但未成功派发”的任务并再次派发或失败返还。

## 9. 部署方案对照

| 执行方式             | 两分钟墙钟                          | 浏览器断开后        | 运行时重启恢复 | 主要硬约束                                    |
| -------------------- | ----------------------------------- | ------------------- | -------------- | --------------------------------------------- |
| API route 内直接等待 | Node 取决于宿主；Workers 在线时无限 | 不可靠              | 不可靠         | 请求与任务同生命周期                          |
| `ctx.waitUntil()`    | 最多断开后 30 秒                    | 不满足              | 不满足         | 明确短于 OpenAI 最坏耗时                      |
| Nitro Task           | 可等待                              | 依赖当前进程/运行时 | 无文档保证     | 实验能力，无持久投递保证                      |
| Cloudflare Queue     | 15 分钟                             | 满足                | 平台重投       | 至少一次、128KB 消息、15 分钟上限             |
| Cloudflare Workflow  | 单步墙钟不限                        | 满足                | 步骤状态持久化 | 步骤可重试、1MiB 普通结果/事件、Free 10ms CPU |
| Node 持久 worker     | 取决于所选宿主                      | 可满足              | 取决于执行器   | 当前仓库与目标宿主尚未提供                    |

## 10. 后续决策票应锁定的事项

- Cloudflare 首版用 Queue 还是 Workflow；需要的交付保证、成本和运维可见性分别是什么。
- Node 是否是首发必须支持的生产目标；若是，具体宿主及其持久任务执行器是什么。
- OpenAI ambiguous outcome 的重试策略与可接受重复成本。
- 输入/输出对象存储在 Node 与 Cloudflare 下的统一接口，以及 R2/S3 binding 的部署方式。
- 内部任务、attempt、lease、dispatch/outbox、积分结算的最小数据模型。
- Free Workers 10ms CPU 是否直接排除；若不排除，必须用 4K/high + 10MB 参考图做真实 CPU/内存验证。

## 11. 必测故障点

后续实现不能只测成功链路。至少应覆盖：

- 提交后立即刷新或关闭页面，任务仍完成并可重新查询。
- 数据库任务已提交、尚未 dispatch 时终止执行器。
- OpenAI 请求前、等待中、收到完整响应后但写对象存储前终止执行器。
- 对象已写入但任务尚未标记 success 时终止执行器。
- Queue 重复投递或 Workflow step 重试不造成重复积分扣减/返还。
- 429、5xx、moderation blocked、用户输入错误和 ambiguous network failure 走不同路径。
- 部署 SIGTERM/Worker runtime update 时 pending/processing 不会永久卡住。
- 10MB 参考图、4K/high 输出在目标 Workers plan 下不超过 CPU、内存、payload 和对象存储限制。

# Kie GPT Image 2 API 与任务合同调研

> 调研日期：2026-08-24
> 结论范围：Kie 第一方文档、Kie 第一方 Playground/模型页，以及本仓库 `src/core/ai/kie.ts`。未发送真实付费生成请求。

## 结论摘要

1. Kie 没有把 GPT Image 2 暴露成一个自动兼容两种输入的 model 值，而是两个独立值：
   - 无参考图：`gpt-image-2-text-to-image`
   - 有参考图：`gpt-image-2-image-to-image`
2. 有参考图时，请求字段是 `input.input_urls`，类型为 URL 数组，最多 16 张。仓库当前 `KieProvider` 发送的是 `input.image_input`，与该模型合同不匹配。
3. 参考图是通用的 image-to-image 编辑/变换输入。Kie Playground 将其标为 “Image for reference”，模型页列出的用途包括风格变化、背景替换、产品改色、主体增强和构图清理。Kie 合同没有为每张图提供人物、风格、构图等角色字段，也没有说明数组顺序的特殊语义；具体如何使用每张图只能写进 Prompt。
4. Kie 当前公开的 GPT Image 2 输入参数只有 `prompt`、`input_urls`（仅图生图）、`aspect_ratio`、`resolution`。没有 `quality`，也没有该模型的 `output_format`。因此首版不能把 `Standard / Medium / High` 静默映射到 Kie；若保留该 UI，它只能是不可提交的假参数。
5. 生成是异步任务：创建得到 `taskId`，然后用回调或统一查询接口取结果。成功结果位于字符串化 JSON `resultJson` 的 `resultUrls` 数组。
6. 当前 Kie 模型页标价为 1K 6 credits（$0.03）、2K 10 credits（$0.05）、4K 16 credits（$0.08），没有按 quality 区分价格。Kie credits 与本站产品积分不是同一单位。
7. Kie 对结果 URL 有冲突说明：统一任务文档称通常 24 小时失效，入门文档称生成媒体保留 14 天。GPT Image 2 的确切生命周期无法由第一方资料唯一确认，应把 URL 当临时资源并在成功后立即转存。

## 1. 创建任务合同

两个模式共用以下接口和鉴权方式：

```http
POST https://api.kie.ai/api/v1/jobs/createTask
Authorization: Bearer <KIE_API_KEY>
Content-Type: application/json
```

### 1.1 无参考图：文字生图

真实 model 值为 `gpt-image-2-text-to-image`。`model` 与 `input` 必填，`input.prompt` 必填；Prompt 长度为 1～20,000 字符。[Kie GPT Image 2 Text to Image OpenAPI](https://docs.kie.ai/market/gpt/gpt-image-2-text-to-image)

```json
{
  "model": "gpt-image-2-text-to-image",
  "callBackUrl": "https://example.com/api/callback",
  "input": {
    "prompt": "A cinematic night city poster.",
    "aspect_ratio": "1:1",
    "resolution": "1K"
  }
}
```

### 1.2 有参考图：图片编辑/变换

真实 model 值为 `gpt-image-2-image-to-image`。`input.prompt` 与 `input.input_urls` 必填；`input_urls` 是 URI 数组，`maxItems` 为 16。[Kie GPT Image 2 Image to Image OpenAPI](https://docs.kie.ai/market/gpt/gpt-image-2-image-to-image)

```json
{
  "model": "gpt-image-2-image-to-image",
  "callBackUrl": "https://example.com/api/callback",
  "input": {
    "prompt": "Use image 1 as the product and image 2 as the lighting reference.",
    "input_urls": [
      "https://example.com/product.png",
      "https://example.com/lighting.jpg"
    ],
    "aspect_ratio": "1:1",
    "resolution": "1K"
  }
}
```

OpenAPI 对图生图 Prompt 的文字说明是“最多 20,000 字符”，但没有像文字生图一样声明 `maxLength`。产品端可统一使用不超过 20,000 字符的保守上限。[Kie GPT Image 2 Image to Image OpenAPI](https://docs.kie.ai/market/gpt/gpt-image-2-image-to-image)

### 1.3 创建响应与错误

成功创建只表示任务入队，不表示生成完成：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "task_gptimage_1765180586443"
  }
}
```

两个模型页面列出的业务响应码一致：

| code | 含义               |
| ---- | ------------------ |
| 200  | 请求已成功处理     |
| 401  | 鉴权失败           |
| 402  | Kie credits 不足   |
| 404  | 接口或资源不存在   |
| 422  | 参数校验失败       |
| 429  | 频率限制           |
| 433  | 子密钥用量超过上限 |
| 455  | 服务维护中         |
| 500  | 服务端异常         |
| 501  | 生成失败           |
| 505  | 功能已禁用         |

这些 code 定义在响应 envelope 中；实现应同时检查 HTTP 状态和 JSON `code`，不能只把 HTTP 200 当作成功。[文字生图 OpenAPI](https://docs.kie.ai/market/gpt/gpt-image-2-text-to-image)、[图生图 OpenAPI](https://docs.kie.ai/market/gpt/gpt-image-2-image-to-image)

## 2. 参考图的用途与限制

### 已确认

- Kie 把带图工作流称为 image-to-image，并在 Playground 中将 `input_urls` 的单项标为 “Image for reference”，界面明确显示可继续添加到 `16/16`。[Kie GPT Image 2 Playground](https://kie.ai/gpt-image-2?model=gpt-image-2-image-to-image)
- 模型页把输入图用途描述为对既有图片做变换、细化或视觉更新，示例包括风格变化、背景替换、产品改色、主体增强、构图清理以及保留原图重要部分的受控编辑。[Kie GPT Image 2 模型页](https://kie.ai/gpt-image-2?model=gpt-image-2-image-to-image)
- API 只接收 URL，不直接接收 multipart 文件或 base64 图片。上传动作必须先由本站存储或 Kie File Upload API 完成，再把可访问 URL 放入 `input_urls`。[Kie 图生图 OpenAPI](https://docs.kie.ai/market/gpt/gpt-image-2-image-to-image)、[Kie File Upload API](https://docs.kie.ai/file-upload-api/quickstart)

### 未确认

以下信息没有出现在 Kie GPT Image 2 的第一方 API 合同中，必须标为 **unknown**：

- 每张参考图的最大文件大小、像素尺寸和总请求体积；
- GPT Image 2 接受的确切图片 MIME 类型；
- 数组顺序是否带有模型级优先级；
- 每张图能否被固定指定为人物、产品、风格、背景或构图参考；
- 多张图之间是否存在一致性保证；
- 输入图片 URL 必须保持可访问多长时间。

因此，产品可以自行规定 PNG/JPEG/WEBP 与单文件大小限制，但不能声称这些是 Kie GPT Image 2 的官方限制。首版应把参考图按顺序编号，并引导用户在 Prompt 中写清楚“图 1 用作主体、图 2 用作风格”等意图。

## 3. 宽高比、分辨率与质量

### 3.1 宽高比

两个 model 值都列出同一组枚举：

`auto`、`1:1`、`3:2`、`2:3`、`4:3`、`3:4`、`5:4`、`4:5`、`16:9`、`9:16`、`2:1`、`1:2`、`3:1`、`1:3`、`21:9`、`9:21`。[文字生图 OpenAPI](https://docs.kie.ai/market/gpt/gpt-image-2-text-to-image)、[图生图 OpenAPI](https://docs.kie.ai/market/gpt/gpt-image-2-image-to-image)

### 3.2 分辨率

两个 model 值都支持 `1K`、`2K`、`4K`，但存在组合限制：

- `auto` 或省略宽高比时只能使用 1K，否则创建任务失败；
- `1:1` 不能使用 4K；
- 文字生图 OpenAPI 明确称 `5:4`、`4:5`、`3:1`、`1:3`、`9:21` 不支持 2K/4K；
- 图生图 OpenAPI 的字段说明只称 `5:4`、`4:5` 仅支持 1K，但当前图生图 Playground 又显示与文字生图相同的五项限制。[Kie 图生图 OpenAPI](https://docs.kie.ai/market/gpt/gpt-image-2-image-to-image)、[Kie 图生图 Playground](https://kie.ai/gpt-image-2?model=gpt-image-2-image-to-image)

最后一项是第一方资料内部不一致，无法确认图生图的 `3:1`、`1:3`、`9:21` 是否真的支持 2K/4K。为避免可预知的创建失败，产品能力矩阵应采用较严格规则：这五个比例统一只开放 1K。

### 3.3 Quality 与输出格式

Kie GPT Image 2 两个 OpenAPI 都没有 `quality` 字段，也没有 `Standard`、`Medium`、`High` 枚举；模型页 Playground 同样只展示比例与分辨率。[文字生图 OpenAPI](https://docs.kie.ai/market/gpt/gpt-image-2-text-to-image)、[图生图 OpenAPI](https://docs.kie.ai/market/gpt/gpt-image-2-image-to-image)、[Kie GPT Image 2 模型页](https://kie.ai/gpt-image-2)

该模型合同也没有 `output_format`。虽然仓库通用 `KieProvider` 会在 options 存在时发送此字段，但这不能证明 GPT Image 2 支持它。质量和输出格式都应视为 **unsupported/unknown at Kie boundary**，不能静默丢弃，也不能自行映射。

## 4. 查询、回调与任务状态

### 4.1 主动查询

```http
GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId=<TASK_ID>
Authorization: Bearer <KIE_API_KEY>
```

统一查询接口适用于所有 Market 模型，状态枚举为：

| Kie state    | 本站建议状态 |
| ------------ | ------------ |
| `waiting`    | pending      |
| `queuing`    | pending      |
| `generating` | processing   |
| `success`    | success      |
| `fail`       | failed       |

查询结果包括 `taskId`、`model`、原始参数字符串 `param`、`resultJson`、`failCode`、`failMsg`、时间戳和实际 `creditsConsumed`。`resultJson` 只在成功时存在；图片结果形状为字符串化的 `{"resultUrls": [...]}`。[Kie Get Task Details](https://docs.kie.ai/market/common/get-task-detail)

Kie 的建议轮询策略是 2～3 秒起步并逐渐增加间隔，10～15 分钟后停止轮询。该文档没有给出查询接口独立的 QPS 上限。[Kie Get Task Details](https://docs.kie.ai/market/common/get-task-detail)

### 4.2 回调

创建时可选传 `callBackUrl`。任务成功或失败后，Kie 会向它发送 POST。两个 GPT Image 2 OpenAPI 描述的回调 envelope 为：

- 顶层 `code`：`200` 成功、`400` 参数无效或内容违规、`500` 内部错误、`501` 生成失败；
- `msg`；
- `data`：`taskId`、`model`、`state`（`success` 或 `fail`）、`param`、`resultJson`、`creditsConsumed`、创建/完成/更新时间。

回调文档没有声明签名、共享密钥、自定义鉴权 header、来源 IP、重试次数、重试间隔、重复投递语义或事件序号。这些全部是 **unknown**；接收端不能仅凭 payload 信任回调，至少应以 `taskId + 当前用户任务归属` 定位任务，再通过带服务端 Kie API Key 的查询接口复核最终状态。[文字生图回调合同](https://docs.kie.ai/market/gpt/gpt-image-2-text-to-image)、[图生图回调合同](https://docs.kie.ai/market/gpt/gpt-image-2-image-to-image)

还有一个单位不一致：模型回调 schema 把 `costTime` 描述为秒，统一查询 schema 把它描述为毫秒。实现不应在没有区分来源的情况下混用该字段。[Kie Text to Image 回调合同](https://docs.kie.ai/market/gpt/gpt-image-2-text-to-image)、[Kie Get Task Details](https://docs.kie.ai/market/common/get-task-detail)

## 5. 计费、限流与数据生命周期

### 5.1 Kie 计费

Kie 当前 GPT Image 2 模型页显示：

| 分辨率 | Kie credits / 次 | 页面标示美元价 |
| ------ | ---------------: | -------------: |
| 1K     |                6 |          $0.03 |
| 2K     |               10 |          $0.05 |
| 4K     |               16 |          $0.08 |

模型页没有按文字生图/图生图或 quality 再区分价格；高档充值另有页面所述约 10% 的有效折扣。价格会变化，Kie 入门文档要求始终以当前价格页为准；任务查询/回调中的 `creditsConsumed` 是单次任务的实际 Kie 扣费记录。[Kie GPT Image 2 模型页](https://kie.ai/gpt-image-2)、[Kie Getting Started](https://docs.kie.ai/)

本站不能把 “6 Kie credits” 直接显示成 “6 产品积分”。本站需要独立、可配置的售价映射，并保存提交时报价；Kie 的 `creditsConsumed` 用于成本对账，而不是直接决定用户扣分。

### 5.2 创建任务限流

Kie 入门文档给出的默认账户级限制是每 10 秒最多 20 个新生成请求，通常可承载 100+ 个同时运行任务。超过限制返回 HTTP 429，拒绝的请求不会入队。API 子密钥还可以设置小时、每日和总用量上限；超出子密钥限额对应业务码 433。[Kie Getting Started](https://docs.kie.ai/)

以下信息未公开：查询接口独立限流、同一 `taskId` 查询频率、GPT Image 2 专属并发上限、回调投递并发和账户升级后的精确限额。

### 5.3 URL 与记录保留

第一方资料存在冲突：

- 入门文档称生成媒体文件保存 14 天，文本/元数据日志保存 2 个月；[Kie Getting Started](https://docs.kie.ai/)
- 统一查询文档称生成内容 URL “通常” 24 小时后失效；[Kie Get Task Details](https://docs.kie.ai/market/common/get-task-detail)
- File Upload Quickstart 开头称上传文件 24 小时删除，后半部分又称文件 3 天后删除、URL 24 小时有效，并建议依赖响应中的 `expiresAt`。[Kie File Upload API](https://docs.kie.ai/file-upload-api/quickstart)

因此 GPT Image 2 输出 URL 的精确有效期是 **unknown**。生产合同必须要求：任务成功后立即下载并转存到本站对象存储；Kie URL 只作为临时源地址，不能作为用户长期下载地址。

## 6. 与本仓库 `KieProvider` 的适配差距

证据文件：[`src/core/ai/kie.ts`](../../src/core/ai/kie.ts)

| 项目             | 当前实现                                | Kie GPT Image 2 合同            | 结论                                                       |
| ---------------- | --------------------------------------- | ------------------------------- | ---------------------------------------------------------- |
| 创建接口         | `/api/v1/jobs/createTask`               | 相同                            | 已匹配                                                     |
| 查询接口         | `/api/v1/jobs/recordInfo?taskId=`       | 相同                            | 已匹配                                                     |
| 回调字段         | `callBackUrl`                           | 相同                            | 已匹配                                                     |
| 状态映射         | waiting/queuing/generating/success/fail | 相同                            | 已匹配                                                     |
| 模型选择         | 完全依赖调用方传入一个 model            | 有图/无图需要两个不同 model     | 调用层必须切换，或 Provider 内显式路由                     |
| 参考图字段       | `input.image_input`                     | `input.input_urls`              | 不匹配，当前代码无法按官方合同提交参考图                   |
| 参考图数量       | 未校验                                  | 最多 16                         | 缺少服务端校验                                             |
| 比例             | `input.aspect_ratio`                    | 相同                            | 字段匹配，但缺组合校验                                     |
| 分辨率           | `input.resolution`                      | 相同                            | 字段匹配，但缺组合校验                                     |
| 质量             | 不发送                                  | Kie 不暴露                      | 不应在 UI 伪装支持                                         |
| 输出格式         | 可发送 `input.output_format`            | GPT Image 2 合同没有该字段      | 不应为该模型发送                                           |
| 成功结果         | 解析 `resultJson.resultUrls`            | 相同                            | 已匹配                                                     |
| 输出 MIME/扩展名 | 强制按 `image/png`、`.png` 转存         | 文档只给 PNG 示例，没有格式保证 | 假设未被合同保证                                           |
| 结果持久化       | 查询成功且开启 customStorage 时转存     | 临时 URL 应立即转存             | 方向正确，但回调路径也必须触发同一幂等转存流程             |
| 结果 JSON        | 直接 `JSON.parse`                       | `resultJson` 为字符串           | 需要在实施阶段处理格式异常，避免轮询接口直接抛出未分类异常 |

## 7. Kie 与上游 OpenAI 合同差异

在本票允许的证据范围内，可以确定 Kie 自己暴露的是一层异步任务适配合同：

- Kie 将同一个前台产品名拆成 `gpt-image-2-text-to-image` 与 `gpt-image-2-image-to-image` 两个 model 值；
- Kie 用 `POST /jobs/createTask` + `taskId` + callback/query，而不是让本站直接依赖上游响应形状；
- Kie 把多图输入命名为 `input_urls`；
- Kie 只暴露比例和分辨率，没有在该合同中暴露 quality、输出格式、输出张数、mask 或逐图角色等字段；
- Kie 用自身 credits、错误码、状态枚举和临时结果 URL 包装任务。

本票按要求没有读取 OpenAI 第一方合同，因此不能严谨断言这些字段在上游的确切名称、最大数量或能力。所有“OpenAI 支持但 Kie 未暴露”的逐项比较都应由独立的 OpenAI 第一方研究票完成后再合并；本票只能确认：**即便上游存在某能力，只要 Kie 的两个 GPT Image 2 OpenAPI 没有该字段，首版就不能通过 Kie 合同使用它。**

## 8. 对首页首版的可执行合同建议

1. 前台保留一个展示项 “GPT Image 2”，服务端根据 `referenceImages.length` 选择两个真实 Kie model 值。
2. 允许 0～16 张参考图。0 张走文字生图；1～16 张走图生图；超过 16 张在调用 Kie 前拒绝。
3. 将已上传的参考图 URL 按顺序发送为 `input_urls`。UI 显示图 1、图 2……，Prompt 示例教用户写明各图用途。
4. 首版只提交 `prompt`、`input_urls`、`aspect_ratio`、`resolution`、`callBackUrl`；不提交 `quality` 或 `output_format`。
5. 若产品坚持保留 Quality 控件，在进入实施前必须重新决策其真实业务含义；不能把三个档位都发送成同一个 Kie 请求。
6. 比例/分辨率采用本文第 3 节的严格能力矩阵，在客户端提示并在服务端再次校验。
7. 以 `taskId` 为幂等键统一处理轮询和回调；回调只作为唤醒信号，最终状态由服务端查询复核。
8. 成功后立刻将 `resultUrls` 转存到本站存储，再把稳定 URL 暴露给用户。
9. Kie 成本按分辨率配置，不与本站产品积分硬编码等值；保存预计售价、实际 Kie `creditsConsumed` 和最终扣分结果以便对账。

## 9. 仍需产品或实现阶段确认的 unknown

- Kie GPT Image 2 确切支持的输入 MIME、单文件大小、像素尺寸和 URL 可访问窗口；
- 图生图 `3:1`、`1:3`、`9:21` 对 2K/4K 的真实支持情况（OpenAPI 与 Playground 冲突）；
- GPT Image 2 输出 URL 的确切 TTL；
- 回调鉴权、重试和重复投递策略；
- 查询接口限流；
- 失败任务是否以及何时自动退还 Kie credits；
- 内容政策拒绝对应的稳定 `failCode` 集合；
- 输出文件 MIME 类型；
- 多张参考图的顺序权重和一致性保证。

这些 unknown 不应由代码猜测。首版可通过严格校验、回调后复查、立即转存和后台可配置价格规避其中大部分风险；剩余项需要 Kie 支持书面确认或用受控付费请求验证。

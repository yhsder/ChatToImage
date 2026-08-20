# Product Marketing Context

**Document version:** v1  
**Last updated:** 2026-08-20

## Product Overview

**One-liner:** ChatToImage 是一款免费在线 AI 图片生成器，帮助用户用自然语言把想法快速变成可下载的图片。

**What it does:** 用户输入图片描述，选择少量必要的风格或画幅参数，登录领取免费积分后即可生成、预览并下载图片。MVP 是单次文生图工具，不提供聊天记录、上下文记忆或基于上一张图片的连续对话修改。

**Product category:** AI image generator；主要搜索品类为 `chat to image`、`text to image` 和 `AI text-to-image generator`。

**Product type:** 面向个人用户的自助式 SaaS（B2C）。

**Business model:** 积分制 Freemium。新用户注册后领取免费积分；付费方式同时提供订阅套餐和一次性积分包。具体免费额度、积分消耗、套餐价格与权益必须在模型成本和目标毛利验证后确定。

## Target Audience

**Target companies:** 不以公司为首要划分维度。首发用户是通过美国英文 Google 搜索寻找免费在线生图工具的个人创作者。

**Decision-makers:** 使用者本人同时是购买决策者。

**Primary use case:** 用户有一个视觉想法，希望无需学习复杂提示词或专业设计软件，快速生成并下载一张可用图片。

**Jobs to be done:**

- 把脑中的视觉想法直接转换成图片。
- 快速尝试不同描述、风格或画幅，得到可下载结果。
- 在付费前先用免费积分验证图片质量是否满足需求。

**Use cases:**

- 产品概念图或商品视觉。
- 奇幻艺术和场景插画。
- 角色形象。
- 海报及一般创意视觉。
- 用写实、插画、动漫或 3D 等常见风格探索创意。

## Personas

MVP 为使用者自主注册和购买的 B2C 产品，不设 B2B 采购角色。首要用户画像是“即时创作型搜索者”：已有具体或模糊的画面想法，希望立刻生成一张图片，不想研究模型、节点工作流或大量高级参数。

## Problems & Pain Points

**Core problem:** 用户想把文字想法变成图片，但不想先掌握专业设计工具、复杂提示词或模型参数，也不希望在找到生成入口前阅读大量营销内容。

**Why alternatives fall short:**

- 当前市场已有 ChatGPT Images、DeepAI、Pollo AI、Canva 等成熟工具，核心任务并不缺少解决方案。
- MVP 尚未获得证据证明竞品在质量、速度、价格或易用性方面存在普遍缺陷，因此不得使用未经验证的贬低性比较。
- 可验证的机会是提供与 `chat to image` 搜索意图直接匹配、首屏即可开始操作的简洁体验。

**What it costs them:** 复杂工具和冗长流程会增加试错时间、学习成本及放弃生成的概率；具体时间或金钱损失尚无用户研究数据支持。

**Emotional tension:** 用户担心工具太复杂、生成结果不符合描述、免费额度不透明、登录后才发现需要付费，以及图片能否安全或商业使用。

## Competitive Landscape

**Direct:** Pollo AI 的 Chat to Image 页面、DeepAI、ChatGPT Images、NightCafe、ChatOn、Chatly 等在线 AI 生图工具——它们解决相同的文字生成图片任务。当前研究只证明这些替代方案存在，尚未证明其具体弱点。

**Secondary:** Canva、Adobe、PicLumen 等更广泛的创意设计或 AI 图片平台——同样可以完成生图任务，但用户进入的是更大的产品体系，而非只围绕一次快速生成的单一入口。

**Indirect:** 手工使用设计软件、搜索图库素材、委托设计师或放弃制作图片——可能提供更强控制或更确定的结果，但通常需要更多技能、时间、预算或沟通。

## Differentiation

**Key differentiators:**

- 页面与 `chat to image`、`free`、`online` 的搜索意图直接匹配。
- 首屏就是可操作的生成器，输入、生成、预览和下载路径简短。
- 只展示必要参数，不要求普通用户理解模型选择或专业工作流。
- 对产品边界保持诚实：不把普通文生图包装成支持上下文记忆的聊天式生成。
- 失败、超时或内容审核拒绝不形成积分净消耗，并明确区分错误原因。

**How we do it differently:** MVP 不以多模型数量或专业编辑能力竞争，而是把单次文生图任务压缩成 Describe、Generate、Download 三步，并用免费积分降低首次尝试门槛。

**Why that's better:** 对只想尽快得到一张图片的搜索用户而言，入口更直接、认知负担更低，费用和失败处理也更清楚。

**Why customers choose us:** 当前尚无客户选择数据。首期要验证的选择理由是“搜索结果与需求高度匹配，并能直接开始生成”，而不是尚不存在的模型、质量、速度或价格优势。

## Objections

| Objection | Response |
|-----------|----------|
| “为什么不用 ChatGPT、Canva 或其他成熟工具？” | ChatToImage 面向想快速完成一次文生图任务的用户，提供更聚焦的入口和更少的必要步骤；不声称生成质量优于成熟工具。 |
| “它真的免费吗？” | 注册后可以领取免费积分并生成图片；免费额度耗尽后可选择订阅或购买一次性积分包。具体额度与价格在发布前明确展示。 |
| “生成图片可以商业使用吗？” | 只能依据最终选定模型供应商的许可准确说明，不承诺超出供应商条款的权利。 |
| “我的提示词和图片会被保存多久？” | 默认保存 30 天并允许用户主动删除；若供应商要求更短周期，则采用更短周期并同步更新隐私政策。 |

**Anti-persona:** 需要多轮上下文编辑、像素级专业控制、批量工作流、视频生成、背景移除、图片增强、多模型比较或 API 集成的高级用户；不愿注册却要求生成的用户；试图生成禁止内容的用户。

## Switching Dynamics

**Push:** 现有流程太复杂、需要理解太多参数、从想法到图片的路径过长，或用户只是临时需要生成一张图。

**Pull:** 免费积分、在线使用、自然语言输入、少量参数、直接预览和下载，以及失败不扣积分的清晰规则。

**Habit:** 用户已经熟悉并信任 ChatGPT、Canva 等品牌，账户、历史素材和原有工作流也会让他们留在现有工具中。

**Anxiety:** 新工具的生成质量与稳定性未知；注册是否值得；免费额度是否足够；是否会突然收费；提示词和图片如何保存；商业使用权是否明确。

## Customer Language

**How they describe the problem:** 尚无客户访谈原话。以下是已经观察到的英文搜索用语，不应伪装成客户评价：

- “chat to image free”
- “chat to image online”
- “chat to image online free”
- “chat to image app”
- “text to image”

**How they describe us:** 尚无真实客户表述。发布后应从搜索查询、客服对话和用户访谈中持续补充原话。

**Words to use:** `chat to image`、`free online AI image generator`、`text to image`、`AI text-to-image generator`、`turn text into AI images`、`describe`、`generate`、`download`、`free credits`、`plain language`。

**Words to avoid:** `AI chat`、`conversational editing`、`remember context`、`best quality`、`fastest`、`unlimited`、`completely free`、`commercial use guaranteed`，以及任何未通过真实测试或许可确认的绝对化承诺。

**Glossary:**

| Term | Meaning |
|------|---------|
| Chat to image | 首发 SEO 入口词；在本产品中指用自然语言描述生成图片，不代表连续聊天功能。 |
| Text to image | 用户输入文字提示词并由 AI 生成图片的核心任务和通用品类词。 |
| Prompt | 用户对主体、场景、风格、光线或构图的文字描述。 |
| Free credits | 注册后用于尝试真实生成的有限免费额度。 |
| Generation | 一次独立的图片生成任务；修改提示词再次生成会创建新任务。 |
| Content rejection | 提示词或请求因内容安全规则被拒绝，不应产生积分净消耗。 |

## Brand Voice

**Tone:** 直接、友好、可信，不过度兴奋。

**Style:** 使用简短、具体、非技术化的英文；优先说明用户下一步能做什么。用真实功能和可验证事实表达价值，避免关键词堆砌、空泛 AI 术语和竞品贬低。

**Personality:** 简洁、实用、诚实、易接近、专注。

## Proof Points

**Metrics:** 上线前暂无可公开引用的用户、生成或收入指标。模型质量、成功率、延迟和毛利门槛属于发布验收条件，只有实际达到后才能转化为营销证明。

**Customers:** 暂无可公开客户或品牌 Logo。

**Testimonials:** 暂无真实客户评价；禁止编造占位评价。

**Value themes:**

| Theme | Proof |
|-------|-------|
| 简单直接 | 产品信息架构固定为 Describe、Generate、Download；首屏提供生成器。 |
| 低风险尝试 | 用户注册后领取免费积分；具体数量待成本验证。 |
| 公平计费 | 成功生成才形成最终积分消耗；审核拒绝、供应商失败、超时或系统取消自动退回预扣积分。 |
| 真实预期 | 示例区只展示选定模型能够稳定复现的结果。 |
| 数据透明 | 默认保存提示词和图片 30 天并支持主动删除，最终政策受供应商更短周期约束。 |

## Goals

**Business goal:** 用最小可用的单页、单模型产品验证 `chat to image` 能否从美国英文 Google 搜索带来曝光、自然会话、成功生成、注册和付费，再决定是否扩展更多 SEO 页面或产品能力。

**Conversion action:** 首要转化是用户点击 Generate、完成注册并成功生成第一张图片；后续转化是免费积分耗尽后开始结账并完成订阅或一次性积分包购买。

**Current metrics:** 产品尚未上线，没有现有业务基线。首轮观察标准为：

- 发布后 14 天内被 Google 收录。
- 发布后 30 天内相关查询在 Search Console 获得非零曝光。
- 首批 100 个自然搜索会话中，`generate_intent / organic session` 至少 20%。
- 触发生成意图的去重用户中，7 日内注册率至少 25%。
- `generation_success / generate_intent` 至少 60%，`generation_success / organic session` 至少 12%。
- 首批流量只观察付费，不预设缺乏依据的强购买率门槛。
- 上线满 90 天后必须根据曝光、自然会话、成功生成和注册数据执行 continue、adjust 或 stop 复盘。

## Changelog

*Newest first. One line per revision: what changed and why.*

- v1 (2026-08-20) — Initial context drafted from the approved Chat to Image SEO MVP; confirmed subscriptions and one-time credit packs coexist, with no unproven product advantage claimed.

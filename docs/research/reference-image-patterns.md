# 主流 AI 生图产品的多参考图用途与交互模式

调研日期：2026-08-24

## 研究问题

当用户上传一张或多张参考图时，主流 AI 生图产品分别允许这些图片约束什么，以及产品如何表达每张图的角色、强度、顺序、数量上限和冲突？这些行业模式中，哪些可以指导 ChatToImage 的首页设计，哪些不能在尚未核实 Kie GPT Image 2 接口前当作首版事实？

## 结论摘要

“参考图”不是一个单一能力。六个产品的第一方文档共同呈现出四类稳定语义：

1. **通用视觉输入**：让图片共同影响内容、主体、构图、颜色或整体方向，通常由文字说明多张图如何组合。
2. **有角色的参考**：明确分成主体/角色、产品/对象、构图/结构/姿态、风格、颜色等槽位。
3. **编辑底图**：有一张图片是需要被修改的原图，其他图片只是给编辑提供身份、对象或风格依据。
4. **训练资产**：用多张图片训练并保存角色、产品或风格。这是跨任务复用能力，不等同于一次请求中的多参考图。

因此，用户说的“参考图可以上传多张”更接近以下用途：把图 1 的人物、图 2 的产品、图 3 的构图和图 4 的色彩/风格组合到一张新图中，或者用多视角、多样本提高同一人物/产品/风格的识别稳定性。它不应被默认解释成“把第一张图当编辑底图”，也不应被解释成“每张图都只提供风格”。

同时，**行业 UX 模式不能证明 Kie GPT Image 2 的接口能力**。本文没有核实 Kie 的模型标识、字段名、最大图片数、顺序语义、逐图角色、逐图权重、编辑底图语义或冲突处理。Recraft 和 Magnific 展示的 GPT Image 2 能力是它们各自平台的集成事实，不能外推到 Kie。

## 参考图约束维度

| 维度       | 用户意图                                       | 典型产品表达                                |
| ---------- | ---------------------------------------------- | ------------------------------------------- |
| 内容       | 借用画面中的核心元素或概念                     | Image Prompt、Content Reference、通用参考图 |
| 主体身份   | 保持人物、角色、动物、产品或对象可识别         | Character/Omni/Object/Product Reference     |
| 构图与结构 | 保持布局、对象位置、透视、轮廓、深度           | Composition、Structure、Edge、Depth、Sketch |
| 姿态       | 保持人体或角色姿势                             | Pose Reference                              |
| 风格       | 借用媒介、纹理、光线、设计语言和整体观感       | Style Reference、Custom Style               |
| 颜色       | 复用调色板、色调或品牌色                       | Color Reference、Palette、Style Reference   |
| 编辑目标   | 指定哪张图是要被修改且尽量保留未提及部分的底图 | Remix、Edit image、自然语言编辑             |

## 产品逐项调查

### Midjourney

#### 能约束什么

- **Image Prompt** 影响内容、构图和颜色。官方文档把它描述为对参考图“核心元素”的启发，而不是精确复制。[Image Prompts](https://docs.midjourney.com/hc/en-us/articles/32040250122381-Image-Prompts)
- **Style Reference** 只负责整体观感，包括颜色、媒介、纹理和光线，不复制图中的对象或人物。[Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference)
- **Omni Reference** 用于把人物、对象、车辆或非人类生物带入新图，属于主体身份/对象一致性，而不是风格参考。[Omni Reference](https://docs.midjourney.com/hc/en-us/articles/36285124473997-Omni-Reference)
- **Blend** 把多张图的概念和风格融合成一个新作品，不接受文字提示；它是多图混合的快捷入口，不是精确编辑。[Blend Images in Discord](https://docs.midjourney.com/hc/en-us/articles/32635189884557-Blend-Images-in-Discord)

#### 多图角色、强度、顺序、上限和冲突

- Image Prompt 支持单图加文字、多图无文字、多图加文字。多图加文字时，文字用于补足参考图中不可见的重要细节。[Image Prompts](https://docs.midjourney.com/hc/en-us/articles/32040250122381-Image-Prompts)
- Image Prompt 有全局 `--iw` 强度。当前文档所列 V7/V8.1 默认值为 1、范围为 0–3；文档没有为网页端定义逐张 Image Prompt 的不同角色或稳定的先后优先级。[Image Prompts](https://docs.midjourney.com/hc/en-us/articles/32040250122381-Image-Prompts)
- Style Reference 支持多图；有全局 `--sw` 风格强度，范围 0–1000、默认 100。Discord 还允许对单张风格图设置相对权重，例如 `URL1::2 URL2::1`。[Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference)
- Omni Reference 只允许一张图，有 `--ow` 强度，范围 1–1000、默认 100；官方警告过高权重可能产生不可预测结果。[Omni Reference](https://docs.midjourney.com/hc/en-us/articles/36285124473997-Omni-Reference)
- Blend 明确接受 2–5 张图；超过 5 张需要改用常规 Image Prompt。该上限只属于 Blend，不等于 Midjourney 所有多图入口的上限。[Blend Images in Discord](https://docs.midjourney.com/hc/en-us/articles/32635189884557-Blend-Images-in-Discord)
- 官方建议避免在文字提示中加入与 Style Reference 冲突的风格词；参考图和提示词/参数会竞争影响力，需要降低或提高对应权重，而不是假设上传顺序可以解决冲突。[Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference)、[Omni Reference](https://docs.midjourney.com/hc/en-us/articles/36285124473997-Omni-Reference)

#### UX 模式

Midjourney 的核心模式是“同一张上传图可以拖进不同角色槽位”，并用不同图标区分 Image Prompt、Style Reference 和 Omni Reference。图片还能被锁定，以复用于后续提示。这说明角色和生命周期比“统一上传框”更能减少歧义。

### Adobe Firefly

#### 能约束什么

- **Composition Reference** 约束画面结构以及视觉元素和主体在画框中的排列。Firefly 主要从轮廓和深度理解该结构。[Match image composition to reference image](https://helpx.adobe.com/firefly/web/work-with-images/generate-images/match-image-composition-to-reference-image.html)
- **Style Reference** 约束整体 look and feel，可用于风格、主题、情绪、品牌视觉、图案和色彩组合等。[Reference images for styling](https://helpx.adobe.com/firefly/web/work-with-images/generate-images/reference-images-for-styling.html)
- Adobe 的企业能力还将训练资产明确拆成 subject model 和 style model：前者面向人物、产品或对象一致性，后者面向色彩、图案和插画风格。这同样证明“主体”和“风格”是不同语义。[Adobe Firefly API](https://developer.adobe.com/firefly-services/docs/firefly-api/)

#### 多图角色、强度、顺序、上限和冲突

- 当前 Firefly 帮助页展示一个 Composition 参考槽位和一个 Style Reference 参考槽位。Composition 有 Strength 滑杆控制对参考结构的遵循程度。[Match image composition to reference image](https://helpx.adobe.com/firefly/web/work-with-images/generate-images/match-image-composition-to-reference-image.html)
- 这两篇当前帮助页没有公开声明同一槽位可上传多张图，也没有定义逐图权重、顺序优先级或多图冲突规则。因此不能从 Adobe 推导 ChatToImage 应支持某个多图上限。
- Adobe 通过不同槽位消除“这张图到底提供结构还是风格”的冲突，而不是把所有图片放进同一无差别列表。

#### UX 模式

Firefly 的模式最适合解释“正交控制”：构图图负责怎么摆，风格图负责怎么看。它的优势是可预测；代价是需要模型本身支持这些独立控制，不能只靠前端命名模拟。

### Leonardo.Ai

#### 能约束什么

- 新的 Omni Image Guidance 允许上传多张通用参考图，并用自然语言描述它们如何组合。官方示例是“让这个角色拿着这个产品，并使用这张图片的配色”。[Image Guidance](https://intercom.help/leonardo-ai/en/articles/8497988-image-guidance)
- 旧/精细 Image Guidance 把语义拆成 Style、Content、Character、Depth、Edge、Sketch、Pose、Normals、Pattern、QR、Line Art 和 Text Image Input。[Image Guidance](https://intercom.help/leonardo-ai/en/articles/8497988-image-guidance)
- Content Reference 主要传递总体形状和细节，通常不传递颜色、细节纹理；Character Reference 传递主体相貌；Style Reference 传递美学；Edge/Sketch/Pose 分别传递构图轮廓、草图布局和姿态。[Image Guidance](https://intercom.help/leonardo-ai/en/articles/8497988-image-guidance)

#### 多图角色、强度、顺序、上限和冲突

- 当前简化的 Omni 流程最多上传 6 张图，主要通过提示词说明每张图的关系。[Image Guidance](https://intercom.help/leonardo-ai/en/articles/8497988-image-guidance)
- 精细模式允许高级用户同时使用最多 4 张参考图，为每张图选择不同 ControlNet 角色并独立调节权重。[Image Guidance](https://intercom.help/leonardo-ai/en/articles/8497988-image-guidance)
- Style Reference 的数量随模型变化：Phoenix/SDXL 最多 4 张，Flux 只允许 1 张；旧模式曾允许最多 6 张。多张 Style Reference 共用整体 Strength，但每张图另有 Influence 滑杆。[Image Guidance](https://intercom.help/leonardo-ai/en/articles/8497988-image-guidance)
- Character Reference 同时只允许一张。它适合相貌一致性，不适合准确复制非人形主体。[Image Guidance](https://intercom.help/leonardo-ai/en/articles/8497988-image-guidance)
- 风格参考可能意外带入面部特征。官方建议降低风格强度或在提示词中加强想要的特征；不兼容选项会被置灰，并显示激活条件。[Image Guidance](https://intercom.help/leonardo-ai/en/articles/8497988-image-guidance)
- 官方没有把上传顺序定义成稳定优先级。角色、提示词和 Influence/Strength 才是显式控制面。

#### UX 模式

Leonardo 同时展示了两种可行路线：

- 对普通用户：多张图加自然语言关系说明。
- 对高级用户：每张图显式选择角色并调独立权重。

这两种复杂度不应在首版同时完整呈现，否则容易把首页变成专业 ControlNet 面板。

### Ideogram

#### 能约束什么

- **Style Reference** 指导视觉观感、构图、颜色和设计语言。[Reference Features](https://docs.ideogram.ai/using-ideogram/features-and-tools/reference-features)
- **Character Reference** 保持人物或角色的脸部、发型和关键特征。系统默认识别并遮罩脸和头发，用户可编辑遮罩，决定哪些细节要保留或允许替换。[Character Reference](https://docs.ideogram.ai/using-ideogram/generation-settings/character-reference)
- **Remix** 把一张父图作为构图基础，再由编辑指令改变结果。[Remix](https://docs.ideogram.ai/using-ideogram/features-and-tools/remix)

#### 多图角色、强度、顺序、上限和冲突

- 临时 Quick Reference 和可保存的 Custom Style 都允许最多 3 张风格图。[Style Reference](https://docs.ideogram.ai/using-ideogram/features-and-tools/reference-features/style-reference)
- 官方建议：相似参考图形成统一风格；差异较大的参考图会混合出更意外的结果；其中一张梯度图可专门影响整体色调。这是“多图共同定义同一角色”的典型用法。[Style Reference](https://docs.ideogram.ai/using-ideogram/features-and-tools/reference-features/style-reference)
- 文档没有提供逐图强度或顺序优先级。它建议关闭 Magic Prompt 并避免与参考图冲突的风格词。[Style Reference](https://docs.ideogram.ai/using-ideogram/features-and-tools/reference-features/style-reference)
- Character Reference 是单张图，但遮罩提供比单纯强度更精确的“保留哪些身份细节”控制。[Character Reference](https://docs.ideogram.ai/using-ideogram/generation-settings/character-reference)
- Remix 在旧模型中有 1–100 的父图强度，值越高越接近原图；Ideogram 4.0 隐藏了滑杆，由模型根据编辑指令自动决定。[Remix](https://docs.ideogram.ai/using-ideogram/features-and-tools/remix)
- 官方文档明确提醒：启用参考后，Style、Color、Seed、Negative Prompt、模型和编辑工作流等控制可能被禁用或变化。[Reference Features](https://docs.ideogram.ai/using-ideogram/features-and-tools/reference-features)

#### UX 模式

Ideogram 的关键模式是“角色图可编辑遮罩，风格图可多样本混合”。这两个交互依赖后端能力。若 Kie 只接受通用图片数组，ChatToImage 不能伪造遮罩或逐图风格控制。

### Recraft

#### 能约束什么

- Recraft 自定义风格可只学习颜色、纹理和细节，也可切换到 Style and composition，同时学习布局、对象位置和透视。[How to create a custom style](https://www.recraft.ai/docs/recraft-studio/styles/custom-styles/how-to-create-a-custom-style)
- Recraft 没有独立的角色追踪功能；官方建议组合详细提示、固定风格、参考图、局部编辑和外部模型来保持人物、吉祥物、产品或对象一致性。[Character consistency](https://www.recraft.ai/docs/best-practices/character-consistency)
- 自然语言编辑把当前选中图当编辑底图，可修改衣服、背景、表情、对象、灯光和色彩，同时尽量保留未要求变化的结构与风格；额外图片作为身份、对象或风格参考。[Editing images with natural language](https://www.recraft.ai/docs/recraft-studio/image-editing/editing-images-with-natural-language)

#### 多图角色、强度、顺序、上限和冲突

- 自定义风格最多 5 张参考图，可以混合多张图、多个已保存风格，或两者组合；界面用百分比滑杆控制各参考之间的相对影响。[How to create a custom style](https://www.recraft.ai/docs/recraft-studio/styles/custom-styles/how-to-create-a-custom-style)
- Style and composition 对复杂场景更有用，但官方提醒它在极简设计上可能更不可预测。[How to create a custom style](https://www.recraft.ai/docs/recraft-studio/styles/custom-styles/how-to-create-a-custom-style)
- Recraft 的外部模型编辑文档列出 GPT Image 2 Low/Medium/High 均可附加最多 10 张参考图；同一页面说明不同模型数量不同，并在模型选择器中显示实际上限。[Editing images with natural language](https://www.recraft.ai/docs/recraft-studio/image-editing/editing-images-with-natural-language)
- **“10 张”只证明 Recraft 当前集成层支持此数量，不能证明 Kie GPT Image 2 也支持 10 张，也不能证明两者使用相同上游、模型版本或请求协议。**
- 文档没有声明 GPT Image 2 的输入顺序是优先级，也没有暴露逐图角色或逐图权重。多图关系仍靠自然语言表达。

#### UX 模式

Recraft 把“平台级风格训练”和“一次编辑请求的多参考图”分开。对于 ChatToImage，这意味着首页上传的多图不应被宣传为可保存、可训练、跨任务稳定的角色或风格，除非以后真的实现对应资产生命周期。

### Freepik（现 Magnific）

Freepik 官方站在本次调研时已更名为 Magnific，首页明确写明“Freepik is now Magnific”，公司主体页脚仍为 Freepik Company S.L.U.。[Magnific 首页](https://www.magnific.com/)

#### 能约束什么

- Image Generator 支持一张或多张视觉输入，与文字提示共同指导 look、layout 和 theme。[Image Generator](https://www.magnific.com/ai/docs/your-first-ai-image)
- References 面板显式区分 Style、Character、Object、Color、Camera 和 Effects：分别控制视觉风格、角色一致性、特定对象、调色板、构图视角以及灯光/情绪/动作效果。[Image Generator](https://www.magnific.com/ai/docs/your-first-ai-image)
- 多种参考可在一次生成中组合，例如 Style + Character + Color。[Image Generator](https://www.magnific.com/ai/docs/your-first-ai-image)
- Custom Character 和 Custom Object 是 LoRA 训练资产；Custom Style 建议使用 10–50 张参考图训练。它们不是一次请求的普通附件。[Image Generator](https://www.magnific.com/ai/docs/your-first-ai-image)

#### 多图角色、强度、顺序、上限和冲突

- 通用“上传一张或多张 inspiration image”的数量上限没有在当前帮助页中给出；平台集成多个模型，因此实际能力可能随模型变化。[Image Generator](https://www.magnific.com/ai/docs/your-first-ai-image)
- 自定义角色目前可在一张输出中加入最多两个人；这是训练角色的组合上限，不是普通参考图上传上限。[Image Generator](https://www.magnific.com/ai/docs/your-first-ai-image)
- 官方建议在 Character 与 Style 组合时调整二者强度，但没有在该帮助页公开精确范围、逐图权重或顺序优先级。[Image Generator](https://www.magnific.com/ai/docs/your-first-ai-image)
- 文档建议提示词保持单一、明确并描述想要的最终结果。它没有承诺冲突图会按上传顺序覆盖，因此前端也不应做这种承诺。

#### UX 模式

Magnific/Freepik 的强项是一个统一 References 面板下的角色化“积木”：角色、对象、颜色、镜头和效果可以组合，但每种积木背后可能是不同模型能力或训练资产。这个 UI 可以作为长期方向，不能在 Kie 只有通用图片数组时直接照搬。

## 跨产品模式分类

### 模式 A：通用多图 + 自然语言编排

代表：Leonardo Omni、Recraft 外部模型编辑、Magnific 通用参考图、Midjourney 多 Image Prompt。

用户上传多张图，然后在提示词中说明关系，例如：

> 以图 1 的人物为主角，让她手持图 2 的产品；使用图 3 的构图，并沿用图 4 的金色配色与柔光。

优点是前端简单、能适配能理解多图上下文的模型。缺点是角色和冲突解决都依赖模型理解，难以给出强保证。

### 模式 B：每张图选择显式角色

代表：Midjourney 的 Image/Style/Omni 槽位、Adobe 的 Composition/Style、Leonardo 精细 Image Guidance、Magnific References。

优点是用户知道每张图“负责什么”，也便于做模型兼容校验。缺点是后端必须真正支持角色字段、独立处理或可验证的提示词映射。

### 模式 C：强度、逐图权重和遮罩

代表：Midjourney 的全局和单图权重、Leonardo 的 Strength + Influence、Recraft 的参考百分比、Ideogram Character Mask。

这些控制只在模型/平台真的支持时才有意义。把 UI 滑杆存在前端、提交时却静默丢弃，会制造错误预期。

### 模式 D：训练后复用的角色、产品和风格资产

代表：Adobe Custom Models、Magnific Custom Character/Object/Style、Ideogram Custom Models、Recraft Saved Custom Style。

训练资产适合跨多次生成保持一致，不应与首页一次上传的参考图混为一谈。训练需要数据集、异步状态、版本、保存和删除等完整生命周期，超出“首页首版可用生图”的必要范围。

### 模式 E：编辑底图 + 辅助参考图

代表：Ideogram Remix、Recraft 自然语言编辑。

编辑底图是“被改变的对象”，辅助参考图是“变化依据”。如果产品允许用户同时上传多图，应明确哪一张是底图；如果 Kie 的 GPT Image 2 接口没有该区分，则不要自行承诺“只改第一张、其余只参考”。

## 多图冲突的行业处理方式

| 冲突来源              | 行业处理方式                                     | 对 ChatToImage 的启示                                 |
| --------------------- | ------------------------------------------------ | ----------------------------------------------------- |
| 多图承担不同意图      | 显式角色槽位，或在提示词中逐图指代               | 缩略图至少要编号；有能力后再加角色标签                |
| 某张图影响过强        | 全局强度、逐图 Influence/Weight                  | 未核实 Kie 字段前不要显示无效滑杆                     |
| 风格图带入人物/对象   | 降低风格强度、加强文字描述、拆分 Style/Character | 不承诺“风格参考绝不带入内容”                          |
| 结构和风格互相竞争    | 分 Composition/Style 槽位或不同控制网络          | 若 Kie 只有通用多图，则以提示词说明，不能假装是硬约束 |
| 模型不支持某角色/数量 | 置灰不兼容选项、显示原因、按模型展示上限         | 服务端必须拒绝超限，不能截断或静默忽略                |
| 图与提示词冲突        | 简化提示，避免冲突风格词，调节权重               | 给出例句和可理解的错误提示                            |
| 多图互相矛盾          | 混合为意外结果或依赖模型判断                     | 不把上传顺序宣传成覆盖规则，除非 Kie 文档明确保证     |

## 对 ChatToImage 首版的建议

以下建议是**行业 UX 推论**，不是已经确认的 Kie 能力。

### 可先确定的产品语义

1. 首页字段应命名为“参考图（可选）”，并允许多张缩略图、删除和重排。
2. 每张图显示稳定编号，让用户能在提示词中写“图 1 / 图 2 / 图 3”。
3. 帮助文案应解释参考图可以提供人物/产品、构图、风格或颜色，而不是笼统写成“修改这张图片”。
4. 提示词示例应教用户描述多图关系，而不是依赖上传顺序：`使用图 1 的人物、图 2 的产品和图 3 的灯光风格`。
5. 如果以后支持编辑底图，应把“编辑原图”和“辅助参考图”分开表达。

### 必须等待 Kie GPT Image 2 调研后才能确定

- Kie 的确切模型标识和创建任务接口。
- 是否支持多图，以及最大数量、文件格式、单图/总大小限制。
- 图片参数是 URL、文件、Base64 还是已上传资产 ID。
- 图片数组顺序是否保留，是否有稳定语义。
- 是否支持区分编辑底图和辅助参考图。
- 是否支持逐图角色、逐图权重、全局参考强度或遮罩。
- 文字生图和带参考图是否使用同一个 endpoint、价格和任务状态。
- 多图冲突、违规图片、部分下载失败和超限时的错误形态。

### 在 Kie 只支持通用图片数组时

首版应采用模式 A：多图缩略图 + 编号 + 自然语言编排，不展示角色下拉框、逐图权重或遮罩。服务端按 Kie 的真实上限验证并保持用户顺序；任何超限或不支持都应明确报错，不得静默截断。

### 在 Kie 提供明确角色或权重时

可以逐步加入模式 B/C，但只暴露经过端到端验证的字段。推荐优先级是：

1. 主体/角色或产品参考。
2. 构图/结构参考。
3. 风格/颜色参考。
4. 逐图强度和高级冲突控制。

## 最终判断

用户纠正“参考图可以上传多张”是合理的。行业中，多参考图主要用于**组合不同视觉来源**和**提高同一主体/风格的稳定性**；成熟产品会通过角色槽位、编号提示、权重、遮罩或模型兼容提示减少歧义。

但首版使用 Kie 中转的 GPT Image 2 时，产品契约必须以 Kie 官方文档和实测为准。当前最安全的 Wayfinder 决策是：将首页从单图假设改成“多参考图需求”，同时把具体上限、角色、强度、编辑语义和顺序规则保持为待 Kie 调研解决的决策，不能用 Midjourney、Recraft 或 Magnific 的能力代填。

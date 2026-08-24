# Hero and Generator Component Spec

- Section uses a radial amber wash near the top over the navy base.
- Centered copy: `Chat to Image: Turn Text Into AI Images` and the approved CRO subheadline.
- Generator card is `grid-cols-[minmax(300px,0.92fr)_minmax(0,1.08fr)]` above 768px and one column below it.
- Left side has compact labeled controls and no model selector.
- Prompt textarea is at least 116px tall on desktop, 104px on mobile.
- Aspect ratio choices: 1:1, 9:16, 16:9, 3:2, 2:3.
- Initial result shows a generated moon garden image and the label `Example output`.
- Primary action label: `Generate My Image`. Show `20 free credits` and failure credit reassurance beside it.
- Generate flow: unauthenticated click opens an inline auth notice, preserves values, and offers sign-up/sign-in links. Authenticated click enters loading, then success with download and generate-again.

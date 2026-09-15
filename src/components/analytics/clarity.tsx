// Microsoft Clarity — session recordings & heatmaps. Rendered as a single
// inline <script> (no src) whose IIFE injects the real async loader into
// <head>, so the tag lands in SSR HTML directly — same rationale as
// analytics/google-analytics.tsx. `projectId` is the 10-char Clarity id from
// Settings → Setup (e.g. "vdh7g6e1p1").
export function Clarity({ projectId }: { projectId: string }) {
  if (!projectId) return null;
  return (
    <script
      id="clarity-init"
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`,
      }}
    />
  );
}

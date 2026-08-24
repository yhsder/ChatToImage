/**
 * Shared section heading (index eyebrow + title + lead) used by the homepage
 * marketing sections. All content arrives via props; no i18n reads here.
 */
export function HomeSectionHeading({
  eyebrow,
  heading,
  lead,
  headingId,
}: {
  eyebrow: string;
  heading: string;
  lead: string;
  headingId?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="section-index">{eyebrow}</span>
        <h2 id={headingId}>{heading}</h2>
      </div>
      <p className="section-lead">{lead}</p>
    </div>
  );
}

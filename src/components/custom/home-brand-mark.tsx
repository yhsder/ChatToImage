/**
 * The small square logo mark used in the homepage header and footer.
 * Purely decorative — the offset orange square is drawn in CSS (`.brand-mark`).
 */
export function HomeBrandMark({ className }: { className?: string }) {
  return (
    <span
      className={className ? `brand-mark ${className}` : 'brand-mark'}
      aria-hidden="true"
    />
  );
}

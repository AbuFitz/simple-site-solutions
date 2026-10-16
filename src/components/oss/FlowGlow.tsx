/**
 * Drifting green/grey light behind a form. `level` is how far the visitor has got
 * (steps, options chosen, fields filled): each change glides the glow somewhere new
 * and makes it a little stronger. Decorative only; held still under reduced motion.
 */
export function FlowGlow({ level }: { level: number }) {
  const l = Math.max(0, level);
  const a = l * 1.9;
  const pos = (phase: number, rx: number, ry: number) => `translate3d(${Math.round(Math.sin(a + phase) * rx)}vw, ${Math.round(Math.cos(a * 0.8 + phase) * ry)}vh, 0)`;
  const strength = Math.min(1, 0.45 + l * 0.07);
  return (
    <div className="fg" aria-hidden="true" style={{ ["--fg-s" as string]: strength }}>
      <span className="fg-o fg-o1" style={{ transform: pos(0, 28, 20) }}><i /></span>
      <span className="fg-o fg-o2" style={{ transform: pos(2.1, 30, 22) }}><i /></span>
      <span className="fg-o fg-o3" style={{ transform: pos(4.2, 24, 26) }}><i /></span>
    </div>
  );
}

/** Zero-WebGL backdrop: perspective grid + glow. Used on mobile, while 3D loads, or if WebGL fails. */
export default function LiteBackground() {
  return (
    <div className="lite-bg" aria-hidden="true">
      <div className="lite-glow" />
      <div className="lite-grid" />
    </div>
  )
}

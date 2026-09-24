/** Server-side loading state; visually continuous with IntroOverlay. */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-ground" aria-busy>
      <span className="block h-[56px] w-[56px] animate-pulse rounded-[14px] bg-teal" />
      <p className="text-[13px] font-extrabold tracking-[-0.01em] text-ink">Kota Mizuno</p>
    </div>
  )
}

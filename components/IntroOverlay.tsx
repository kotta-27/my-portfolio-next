import { IntroSeen } from '@/components/IntroSeen'

/**
 * 初回訪問のスプラッシュ。CSS アニメーションだけで動くので、JS の読み込みを待たずに抜ける。
 * 2 回目以降（Cookie あり）はページ側で描画しない。
 */
export function IntroOverlay() {
  return (
    <div aria-hidden className="intro-overlay pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-ground">
      <span className="intro-mark block h-[56px] w-[56px] rounded-[14px] bg-teal" />
      <p className="intro-name text-[13px] font-extrabold tracking-[-0.01em] text-ink">Kota Mizuno</p>
      <IntroSeen />
    </div>
  )
}

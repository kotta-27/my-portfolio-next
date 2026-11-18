/** 外部OG画像取得などで遅れるタイルの Suspense フォールバック。レイアウト崩れを防ぐためのプレースホルダー。 */
export function TileSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative min-h-[120px] w-full animate-pulse rounded-[18px] bg-tile ${className}`}>
      <div className="absolute inset-4 flex flex-col gap-2">
        <div className="h-[10px] w-[40%] rounded-full bg-soft" />
        <div className="h-[10px] w-[70%] rounded-full bg-soft" />
        <div className="h-[10px] w-[55%] rounded-full bg-soft" />
      </div>
    </div>
  )
}

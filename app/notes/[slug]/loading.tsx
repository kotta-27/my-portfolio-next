/** ノートを開くまでの仮の表示（本文と同じ枠に、見出しと段落の形だけ） */
export default function NoteLoading() {
  const bar = 'animate-pulse rounded-[6px] bg-soft'
  return (
    <div className="baseplate min-h-screen">
      <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-14 sm:px-6">
        <div className="rounded-[18px] bg-tile px-5 pb-12 pt-8 sm:px-10 sm:pt-12">
          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4">
            <div className={`${bar} h-[14px] w-[120px]`} />
            <div className={`${bar} h-[38px] w-[85%]`} />
            <div className={`${bar} h-[16px] w-full`} />
            <div className={`${bar} h-[16px] w-[70%]`} />
            <div className="mt-8 flex flex-col gap-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={`${bar} h-[14px] ${i % 3 === 2 ? 'w-[60%]' : 'w-full'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

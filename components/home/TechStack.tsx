/*
 * 技術スタックを「React · Quantum Computing」のように並べる。
 * 項目ごとに whitespace-nowrap の span にして、折り返すのは項目と項目の間だけにする（「Quantum / Computing」のように項目の途中で割れない）。
 * 区切りの「·」は前の項目と同じ span に入れ、行末に残るようにする。
 */
export function TechStack({ items, className }: { items: string[]; className?: string }) {
  return (
    <span className={className}>
      {items.map((item, i) => (
        <span key={item}>
          <span className="whitespace-nowrap">
            {item}
            {i < items.length - 1 && ' ·'}
          </span>
          {i < items.length - 1 && ' '}
        </span>
      ))}
    </span>
  )
}

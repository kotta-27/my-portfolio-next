import type { ReactNode } from 'react'
import { PiLightbulbFilament, PiWarning } from 'react-icons/pi'
import { SectionLink } from '@/components/notes/SectionLink'
import { CopyButton } from '@/components/notes/CopyButton'

/*
 * 学習ノートの本文用の部品。本文は 720px の読みやすい幅、図は少し広く取る。
 * 見出しには番号を振り、上から順に読むと理解が積み上がる構成にする。
 */

const COLUMN = 'mx-auto w-full max-w-[720px]'

export function NoteSection({ step, id, title, children }: { step: number; id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-6 flex-col gap-8">
      <h2 className={`${COLUMN} group flex items-center gap-3 pt-14 text-[22px] font-extrabold leading-[1.35] tracking-[-0.02em] sm:text-[26px]`}>
        <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[8px] border-2 border-current font-mono text-[15px] font-bold tabular-nums">
          {step}
        </span>
        {title}
        <SectionLink id={id} title={title} />
      </h2>
      {children}
    </section>
  )
}

export function P({ children }: { children: ReactNode }) {
  return <p className={`${COLUMN} text-[15px] leading-[2] text-ink/85 sm:text-[16px]`}>{children}</p>
}

export function Ul({ children }: { children: ReactNode }) {
  return <ul className={`${COLUMN} flex flex-col gap-2 text-[15px] leading-[1.85] text-ink/85 sm:text-[16px]`}>{children}</ul>
}

export function Li({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden className="mt-[12px] h-[6px] w-[6px] shrink-0 rounded-full bg-teal" />
      <span>{children}</span>
    </li>
  )
}

/** 文中のコード */
export function C({ children }: { children: ReactNode }) {
  return <code className="rounded-[4px] bg-ink/[0.07] px-[6px] py-[2px] font-mono text-[0.86em] font-semibold text-ink">{children}</code>
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-extrabold text-ink">{children}</strong>
}

/** 静的なターミナル。cmd は $ 付きで、out はそのまま出す。コマンドは 1 行ずつ、またはまとめてコピーできる（出力は含めない） */
export function Terminal({ lines, title = 'zsh' }: { lines: { cmd?: string; out?: string }[]; title?: string }) {
  const cmds = lines.flatMap((l) => (l.cmd ? [l.cmd] : []))
  return (
    <div className="w-full overflow-hidden rounded-[10px] bg-night">
      <div className="flex items-center gap-[6px] border-b border-white/10 py-[6px] pl-4 pr-2">
        <span className="h-[9px] w-[9px] rounded-full bg-white/20" />
        <span className="h-[9px] w-[9px] rounded-full bg-white/20" />
        <span className="h-[9px] w-[9px] rounded-full bg-white/20" />
        <span className="ml-2 font-mono text-[11px] text-white/45">{title}</span>
        {cmds.length > 1 && <CopyButton text={cmds.join('\n')} label="コマンドをまとめてコピー" showText className="ml-auto" />}
      </div>
      <div className="overflow-x-auto py-3 font-mono text-[12.5px] leading-[1.75] text-white/80">
        {lines.map((l, i) => (
          <div key={i}>
            {l.cmd && (
              <div className="group flex items-center gap-2 pl-4 pr-2 hover:bg-white/[0.04]">
                <code className="min-w-0 flex-1 whitespace-pre">
                  <span className="select-none text-teal">$ </span>
                  <span className="text-white">{l.cmd}</span>
                </code>
                <CopyButton text={l.cmd} label={`コピー: ${l.cmd}`} className="opacity-100 sm:opacity-0 sm:focus-visible:opacity-100 sm:group-hover:opacity-100" />
              </div>
            )}
            {l.out && <pre className="whitespace-pre px-4 text-white/60">{l.out}</pre>}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Callout({ tone = 'tip', title, children }: { tone?: 'tip' | 'warn'; title: string; children: ReactNode }) {
  const Icon = tone === 'tip' ? PiLightbulbFilament : PiWarning
  return (
    <aside className={`${COLUMN} flex gap-4 rounded-[10px] bg-soft px-5 py-4`}>
      <Icon className={`mt-[3px] shrink-0 text-[20px] ${tone === 'tip' ? 'text-teal' : 'text-coral'}`} />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-[14px] font-extrabold">{title}</p>
        <div className="text-[14px] leading-[1.85] text-ink/80">{children}</div>
      </div>
    </aside>
  )
}

const LABELS = { animation: 'Animation', image: 'Fig.', code: 'Code', table: 'Table' } as const

/**
 * 番号付きの枠。下にキャプションを付ける。種類ごとに別々に番号を振る
 * （動く図 = Animation n、静止画 = Fig. n、コード = Code n、表 = Table n）。
 * 図は本文より少し広く、コードと表は本文と同じ幅。
 */
export function Figure({ kind, n, caption, children }: { kind: keyof typeof LABELS; n: number; caption: string; children: ReactNode }) {
  const wide = kind === 'animation' || kind === 'image'
  return (
    <figure className={`mx-auto my-4 flex w-full flex-col gap-3 ${wide ? 'max-w-[920px]' : 'max-w-[720px]'}`}>
      {children}
      <figcaption className="flex items-baseline gap-2 px-1 text-[12px] leading-[1.6] text-mute">
        <span className="shrink-0 font-mono font-bold text-ink">
          {LABELS[kind]} {n}
        </span>
        {caption}
      </figcaption>
    </figure>
  )
}

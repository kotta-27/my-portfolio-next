'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FigureFrame, StepNav } from '@/components/notes/FigureFrame'

/*
 * 2 つの Issue の出来事。時刻は GitHub のタイムライン（UTC）を日本時間に直したもの。
 * 「今」はこの記事を書いた 2026-10-28 時点。
 */
type Lane = 'bug' | 'feature'
type Ev = { at: string; lane: Lane; who: 'me' | 'bot' | 'maintainer' | 'other'; title: string; text: string }

const EVENTS: Ev[] = [
  { at: '2026-10-11T12:47:58Z', lane: 'bug', who: 'me', title: 'バグ報告 #23303 を出す', text: 'テンプレートに沿って、再現・バージョン表・原因・修正案まで書いて出した。' },
  {
    at: '2026-10-11T12:48:08Z',
    lane: 'bug',
    who: 'bot',
    title: 'ラベルとボードが自動で付く',
    text: '10 秒ほどの間に bug・untriaged・lucene・Search:Performance のラベルが付き、プロジェクトのボードに載った。untriaged は「まだ誰も仕分けていない」の印。',
  },
  {
    at: '2026-10-11T18:05:09Z',
    lane: 'bug',
    who: 'other',
    title: '別の人が修正 PR #23304 を出す',
    text: '約 5 時間後。中身は Issue に書いた修正案と同じ 1 行の条件と、そのテスト。PR の本文に「Fixes #23303」とあり、Issue と結びついた。',
  },
  {
    at: '2026-10-11T18:41:20Z',
    lane: 'bug',
    who: 'other',
    title: 'PR の CI が承認待ちに',
    text: 'CI（Gradle check）が失敗し、その後の実行はメンテナーの承認待ちになった。PR の作者が承認と再実行をお願いしている。',
  },
  {
    at: '2026-10-14T16:12:01Z',
    lane: 'bug',
    who: 'maintainer',
    title: 'トリアージされる',
    text: '約 3 日後。メンテナーが「[Search Triage]」としてお礼を書き、レビュー担当を 2 人指名した。untriaged と lucene のラベルが外れた。',
  },
  {
    at: '2026-10-24T18:13:07Z',
    lane: 'feature',
    who: 'me',
    title: '機能要望 #23429 を出す',
    text: '数秒で untriaged・Search・lucene のラベルが付き、ボードに載った。',
  },
  {
    at: '2026-10-28T00:00:00Z',
    lane: 'bug',
    who: 'other',
    title: '今: どちらもオープン',
    text: 'バグ報告は PR のレビュー待ち。機能要望はまだトリアージ待ちで、コメントは付いていない。',
  },
]

const WHO: Record<Ev['who'], { label: string; dot: string }> = {
  me: { label: '自分', dot: 'bg-teal' },
  bot: { label: '自動', dot: 'bg-mute' },
  other: { label: 'ほかの人', dot: 'bg-ink' },
  maintainer: { label: 'メンテナー', dot: 'bg-coral' },
}

function jst(iso: string) {
  const d = new Date(Date.parse(iso) + 9 * 3600 * 1000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`
}

function since(iso: string, base: string) {
  const h = (Date.parse(iso) - Date.parse(base)) / 3600000
  if (h < 1 / 60) return `${Math.round(h * 3600)} 秒後`
  if (h < 1) return `${Math.round(h * 60)} 分後`
  if (h < 48) return `約 ${Math.round(h)} 時間後`
  return `約 ${Math.round(h / 24)} 日後`
}

export function IssueTimeline() {
  const [i, setI] = useState(0)
  const ev = EVENTS[i]
  const base = EVENTS.find((e) => e.lane === ev.lane && e.who === 'me')?.at ?? EVENTS[0].at

  return (
    <FigureFrame className="flex flex-col gap-5 p-4 sm:p-6">
      {/* 2 本の時間軸。最初の数時間に出来事が集まるので、時間の比率ではなく順番に等間隔で並べ、経過時間を添える */}
      <div className="flex flex-col gap-5 rounded-[10px] border border-ink/10 bg-tile px-4 pb-4 pt-5">
        {(['bug', 'feature'] as const).map((lane) => {
          const items = EVENTS.map((e, k) => ({ e, k })).filter(({ e }) => e.lane === lane && !e.title.startsWith('今'))
          const laneBase = items[0].e.at
          return (
            <div key={lane} className="grid grid-cols-[64px_minmax(0,1fr)] items-start gap-3">
              <span className="pt-[2px] text-[11.5px] font-extrabold">{lane === 'bug' ? 'バグ報告' : '機能要望'}</span>
              <ol className="relative grid grid-cols-5 gap-1">
                <span className="absolute left-[10%] right-[10%] top-[9px] h-[2px] rounded-full bg-ink/10" aria-hidden />
                {items.map(({ e, k }) => (
                  <li key={e.at} className="relative flex flex-col items-center gap-[6px]">
                    <button
                      type="button"
                      onClick={() => setI(k)}
                      aria-label={e.title}
                      className={`h-[18px] w-[18px] rounded-full border-[3px] border-tile transition-transform duration-150 ${WHO[e.who].dot} ${
                        k === i ? 'scale-125 ring-2 ring-teal ring-offset-1 ring-offset-tile' : 'hover:scale-110'
                      }`}
                    />
                    <span className={`text-center font-mono text-[10px] leading-[1.3] ${k === i ? 'font-bold text-ink' : 'text-mute'}`}>
                      {e.who === 'me' ? jst(e.at) : `+${since(e.at, laneBase).replace('約 ', '').replace('後', '')}`}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )
        })}
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-ink/10 pt-3">
          {Object.values(WHO).map((w) => (
            <span key={w.label} className="flex items-center gap-[6px] text-[11px] font-semibold text-mute">
              <span className={`h-[9px] w-[9px] rounded-full ${w.dot}`} />
              {w.label}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-2 rounded-[10px] border border-ink/10 bg-tile p-4 sm:p-5"
          aria-live="polite"
        >
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[12px] font-bold text-mute">{ev.title.startsWith('今') ? '10/28' : `${jst(ev.at)} JST`}</span>
            {ev.who !== 'me' && !ev.title.startsWith('今') && <span className="text-[11.5px] font-bold text-teal">出してから{since(ev.at, base)}</span>}
            <span className="flex items-center gap-[5px] text-[11px] font-bold text-mute">
              <span className={`h-[8px] w-[8px] rounded-full ${WHO[ev.who].dot}`} />
              {ev.title.startsWith('今') ? '現在' : WHO[ev.who].label}
            </span>
          </span>
          <span className="text-[16px] font-extrabold">{ev.title}</span>
          <p className="text-[13.5px] leading-[1.75] text-ink/85">{ev.text}</p>
        </motion.div>
      </AnimatePresence>

      <StepNav step={i} count={EVENTS.length} onPrev={() => setI((v) => Math.max(0, v - 1))} onNext={() => setI((v) => Math.min(EVENTS.length - 1, v + 1))} onSelect={setI} />
    </FigureFrame>
  )
}

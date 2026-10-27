'use client'

import { useTr } from '@/components/notes/i18n'

/*
 * 2 つの Issue の出来事。時刻は GitHub のタイムライン（UTC）を日本時間に直したもの。
 * 「今」はこの記事を書いた 2026-10-28 時点。
 */
type Lane = 'bug' | 'feature'
type Ev = { at: string; lane: Lane; who: 'me' | 'bot' | 'maintainer' | 'other'; now?: boolean; title: [string, string]; text: [string, string] }

const EVENTS: Ev[] = [
  {
    at: '2026-10-11T12:47:58Z',
    lane: 'bug',
    who: 'me',
    title: ['バグ報告 #23303 を出す', 'File bug report #23303'],
    text: ['テンプレートに沿って、再現・バージョン表・原因・修正案まで書いて出した。', 'Filed following the template, with a reproduction, a table of versions, the cause and a possible fix.'],
  },
  {
    at: '2026-10-11T12:48:08Z',
    lane: 'bug',
    who: 'bot',
    title: ['ラベルとボードが自動で付く', 'Labels and a board are added automatically'],
    text: [
      '10 秒ほどの間に bug・untriaged・lucene・Search:Performance のラベルが付き、プロジェクトのボードに載った。untriaged は「まだ誰も仕分けていない」の印。',
      'Within about 10 seconds, the labels bug, untriaged, lucene and Search:Performance were added, and the issue went onto a project board. untriaged means no one has sorted it yet.',
    ],
  },
  {
    at: '2026-10-11T18:05:09Z',
    lane: 'bug',
    who: 'other',
    title: ['別の人が修正 PR #23304 を出す', 'Someone else opens fix PR #23304'],
    text: [
      '約 5 時間後。中身は Issue に書いた修正案と同じ 1 行の条件と、そのテスト。PR の本文に「Fixes #23303」とあり、Issue と結びついた。',
      'About five hours later. It contains the same one-line condition as the fix in the issue, plus a test. Its description says “Fixes #23303”, which links it to the issue.',
    ],
  },
  {
    at: '2026-10-11T18:41:20Z',
    lane: 'bug',
    who: 'other',
    title: ['PR の CI が承認待ちに', 'The PR’s CI waits for approval'],
    text: [
      'CI（Gradle check）が失敗し、その後の実行はメンテナーの承認待ちになった。PR の作者が承認と再実行をお願いしている。',
      'CI (Gradle check) failed, and further runs now need maintainer approval. The PR author asked for approval and a re-run.',
    ],
  },
  {
    at: '2026-10-14T16:12:01Z',
    lane: 'bug',
    who: 'maintainer',
    title: ['トリアージされる', 'Triaged'],
    text: [
      '約 3 日後。メンテナーが「[Search Triage]」としてお礼を書き、レビュー担当を 2 人指名した。untriaged と lucene のラベルが外れた。',
      'About three days later. A maintainer thanked us under “[Search Triage]” and named two reviewers. The untriaged and lucene labels were removed.',
    ],
  },
  {
    at: '2026-10-24T18:13:07Z',
    lane: 'feature',
    who: 'me',
    title: ['機能要望 #23429 を出す', 'File feature request #23429'],
    text: ['数秒で untriaged・Search・lucene のラベルが付き、ボードに載った。', 'Within seconds, the labels untriaged, Search and lucene were added, and it went onto the board.'],
  },
  {
    at: '2026-10-28T00:00:00Z',
    lane: 'bug',
    who: 'other',
    now: true,
    title: ['今: どちらもオープン', 'Now: both still open'],
    text: [
      'バグ報告は PR のレビュー待ち。機能要望はまだトリアージ待ちで、コメントは付いていない。',
      'The bug report is waiting on the PR review. The feature request is still waiting for triage, with no comments yet.',
    ],
  },
]

const WHO: Record<Ev['who'], { label: [string, string]; dot: string }> = {
  me: { label: ['自分', 'me'], dot: 'bg-teal' },
  bot: { label: ['自動', 'automation'], dot: 'bg-mute' },
  other: { label: ['ほかの人', 'someone else'], dot: 'bg-ink' },
  maintainer: { label: ['メンテナー', 'maintainer'], dot: 'bg-coral' },
}

function jst(iso: string) {
  const d = new Date(Date.parse(iso) + 9 * 3600 * 1000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`
}

/** 経過時間。[日本語, 英語] で返す */
function since(iso: string, base: string): [string, string] {
  const h = (Date.parse(iso) - Date.parse(base)) / 3600000
  if (h < 1 / 60) return [`${Math.round(h * 3600)} 秒`, `${Math.round(h * 3600)} s`]
  if (h < 1) return [`${Math.round(h * 60)} 分`, `${Math.round(h * 60)} min`]
  if (h < 48) return [`${Math.round(h)} 時間`, `${Math.round(h)} h`]
  return [`${Math.round(h / 24)} 日`, `${Math.round(h / 24)} days`]
}

/** 出したあとの出来事を、日時と経過時間つきで上から順に並べる。操作はいらない */
export function IssueTimeline() {
  const tr = useTr()
  return (
    <ol className="mx-auto flex w-full max-w-[720px] flex-col">
      {EVENTS.map((ev, i) => {
        const base = EVENTS.find((e) => e.lane === ev.lane && e.who === 'me')?.at ?? EVENTS[0].at
        const last = i === EVENTS.length - 1
        return (
          <li key={ev.at} className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-4">
            <div className="flex flex-col items-center">
              <span className={`mt-[5px] h-[14px] w-[14px] shrink-0 rounded-full ${WHO[ev.who].dot} ${ev.now ? 'opacity-40' : ''}`} />
              {!last && <span aria-hidden className="w-[2px] flex-1 bg-ink/10" />}
            </div>
            <div className={`flex min-w-0 flex-col gap-1 ${last ? '' : 'pb-6'}`}>
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[12px]">
                <span className="font-mono font-bold text-mute">{ev.now ? '10/28' : `${jst(ev.at)} JST`}</span>
                {ev.who !== 'me' && !ev.now && (
                  <span className="font-bold text-teal">{tr(`出してから約 ${since(ev.at, base)[0]}後`, `about ${since(ev.at, base)[1]} after filing`)}</span>
                )}
                <span className="font-bold text-mute">
                  {ev.lane === 'bug' ? tr('バグ報告', 'bug report') : tr('機能要望', 'feature request')} · {ev.now ? tr('現在', 'now') : tr(...WHO[ev.who].label)}
                </span>
              </span>
              <span className="text-[15px] font-extrabold">{tr(...ev.title)}</span>
              <p className="text-[14px] leading-[1.8] text-ink/85">{tr(...ev.text)}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

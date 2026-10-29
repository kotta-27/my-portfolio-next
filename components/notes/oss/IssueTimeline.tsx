'use client'

import { Fragment } from 'react'
import { PiArrowDownBold } from 'react-icons/pi'
import { Rich, useTr } from '@/components/notes/i18n'

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
    title: ['バグ報告 #23303 を出す', 'File `bug` report #23303'],
    text: ['テンプレートに沿って、再現・バージョン表・原因・修正案まで書いて出した。', 'Filed following the template, with a reproduction, a table of versions, the cause and a possible fix.'],
  },
  {
    at: '2026-10-11T12:48:08Z',
    lane: 'bug',
    who: 'bot',
    title: ['ラベルとボードが自動で付く', 'Labels and a board are added automatically'],
    text: [
      '10 秒ほどの間に `bug`・`untriaged`・`lucene`・`Search:Performance` のラベルが付き、プロジェクトのボードに載った。`untriaged` は「まだ誰も仕分けていない」の印。',
      'Within about 10 seconds, the labels `bug`, `untriaged`, `lucene` and `Search:Performance` were added, and the issue went onto a project board. `untriaged` means no one has sorted it yet.',
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
      '約 3 日後。メンテナーが「[Search Triage]」としてお礼を書き、レビュー担当を 2 人指名した。`untriaged` と `lucene` のラベルが外れた。',
      'About three days later. A maintainer thanked us under “[Search Triage]” and named two reviewers. The `untriaged` and `lucene` labels were removed.',
    ],
  },
  {
    at: '2026-10-24T18:13:07Z',
    lane: 'feature',
    who: 'me',
    title: ['機能要望 #23429 を出す', 'File feature request #23429'],
    text: ['数秒で `untriaged`・`Search`・`lucene` のラベルが付き、ボードに載った。', 'Within seconds, the labels `untriaged`, `Search` and `lucene` were added, and it went onto the board.'],
  },
  {
    at: '2026-10-28T00:00:00Z',
    lane: 'bug',
    who: 'other',
    now: true,
    title: ['今: どちらもオープン', 'Now: both still open'],
    text: [
      'バグ報告は PR のレビュー待ち。機能要望はまだトリアージ待ちで、コメントは付いていない。',
      'The `bug` report is waiting on the PR review. The feature request is still waiting for triage, with no comments yet.',
    ],
  },
]

const WHO: Record<Ev['who'], { label: [string, string] }> = {
  me: { label: ['自分', 'me'] },
  bot: { label: ['自動', 'automation'] },
  other: { label: ['ほかの人', 'someone else'] },
  maintainer: { label: ['メンテナー', 'maintainer'] },
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

/** 出したあとの出来事を、普通のブログと同じく小見出しと段落で上から順に並べる */
export function IssueTimeline() {
  const tr = useTr()
  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4">
      {EVENTS.map((ev, i) => {
        const base = EVENTS.find((e) => e.lane === ev.lane && e.who === 'me')?.at ?? EVENTS[0].at
        const meta = [
          ev.now ? '10/28' : `${jst(ev.at)} JST`,
          ev.who !== 'me' && !ev.now ? tr(`出してから約 ${since(ev.at, base)[0]}後`, `about ${since(ev.at, base)[1]} after filing`) : null,
          ev.lane === 'bug' ? tr('バグ報告', 'bug report') : tr('機能要望', 'feature request'),
          ev.now ? tr('現在', 'now') : tr(...WHO[ev.who].label),
        ].filter(Boolean)
        return (
          <Fragment key={ev.at}>
            {/* 前の出来事から続いていることを矢印で示す */}
            {i > 0 && <PiArrowDownBold aria-hidden className="mx-auto text-[22px] text-mute/60" />}
            <section className="flex flex-col gap-2">
              <h3 className="text-[17px] font-extrabold leading-[1.5] sm:text-[19px]">{tr(...ev.title)}</h3>
              <p className="text-[13px] text-mute">{meta.join(' · ')}</p>
              <p className="text-[15px] leading-[2] text-ink/85 sm:text-[16px]">
                <Rich text={tr(...ev.text)} />
              </p>
            </section>
          </Fragment>
        )
      })}
    </div>
  )
}

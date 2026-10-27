'use client'

import {
  PiBinocularsBold,
  PiBugBeetleBold,
  PiClockCounterClockwiseBold,
  PiCodeBold,
  PiFlaskBold,
  PiMagnifyingGlassBold,
  PiPaperPlaneTiltBold,
  PiScissorsBold,
} from 'react-icons/pi'
import type { IconType } from 'react-icons'
import { useTr } from '@/components/notes/i18n'

/** #23303 を出すまでにやったこと。中身は Issue 本文に書いた内容から起こしている */
const STEPS: { icon: IconType; title: [string, string]; did: [string, string]; why: [string, string] }[] = [
  {
    icon: PiBugBeetleBold,
    title: ['おかしいと気づく', 'Notice something is off'],
    did: ['post_filter に range を置くと、当てはまるはずの件数より少ない。エラーは出ず、件数は「ちょうど」と報告される。', 'With a range in post_filter, fewer documents match than should. No error is returned, and the count is reported as exact.'],
    why: ['エラーにならない間違いは気づきにくく、気づいた人が報告しないと残り続ける。', 'Mistakes that raise no error are easy to miss, and they stay unless whoever notices reports them.'],
  },
  {
    icon: PiScissorsBold,
    title: ['再現を小さくする', 'Shrink the reproduction'],
    did: ['単一ノード・1 シャード・curl だけのスクリプトに削った。データは value = (i × 7919) % N で、件数 N を変えるだけで規模を変えられる。', 'Cut it down to a script with one node, one shard and only curl. The data is value = (i × 7919) % N, so changing N changes the scale.'],
    why: ['メンテナーが手元でそのまま動かせる形にする。前提が少ないほど、別の原因を疑われにくい。', 'Make it something a maintainer can run as is. The fewer assumptions, the less likely another cause gets suspected.'],
  },
  {
    icon: PiClockCounterClockwiseBold,
    title: ['いつから壊れたか調べる', 'Find when it broke'],
    did: ['公式 Docker イメージで 2.19.5 / 3.0.0 / 3.1.0 / 3.9.0 を並べ、同じスクリプトの結果を表にした。2.19.5 は正しく、3.x で壊れている。', 'Ran the same script on the official Docker images for 2.19.5 / 3.0.0 / 3.1.0 / 3.9.0 and tabulated the results. 2.19.5 is correct; 3.x is broken.'],
    why: ['「いつから」が分かると、原因の変更をかなり絞り込める。', 'Knowing when it broke narrows down the change that caused it a lot.'],
  },
  {
    icon: PiBinocularsBold,
    title: ['同じ報告がないか探す', 'Look for existing reports'],
    did: ['既存の Issue と PR を探して、見つからなかったことを本文に書いた。', 'Searched existing issues and PRs, and noted in the issue that none were found.'],
    why: ['重複はメンテナーの手間になる。探した、と書いておけば読む側も安心できる。', 'Duplicates cost maintainers time. Saying you searched reassures the reader.'],
  },
  {
    icon: PiMagnifyingGlassBold,
    title: ['原因をコードで追う', 'Trace the cause in the code'],
    did: ['近似を有効にする処理が、本命のクエリ以外（post_filter など）にもかかっていた。該当箇所はバージョンのタグに固定したリンクで示した。', 'The code that enables approximation was also applied to queries other than the main one (post_filter and others). Linked the relevant lines, pinned to a version tag.'],
    why: ['main ブランチへのリンクは、コードが変わると行がずれる。タグに固定すれば、後から読んでも同じ行を指す。', 'Links to the main branch drift as the code changes. Pinned to a tag, they point to the same lines later.'],
  },
  {
    icon: PiCodeBold,
    title: ['直し方を考える', 'Work out a fix'],
    did: ['「本命のクエリのときだけ近似する」という 1 行の条件を diff で載せた。参照の同一性に頼る弱点と、別の直し方の案も添えた。', 'Included a diff with a one-line condition: approximate only the main query. Also noted its weakness (it relies on reference equality) and an alternative.'],
    why: ['直し方は相手が決めるもの。案として出し、懸念も先に書いておくと議論が早い。', 'The maintainers decide the fix. Offering it as a proposal, with concerns up front, speeds up the discussion.'],
  },
  {
    icon: PiFlaskBold,
    title: ['手元で確かめる', 'Verify locally'],
    did: ['3.9.0 をローカルでビルドし、新しいテストが修正前に落ちて修正後に通ること、既存のテストが通ることを確かめた。', 'Built 3.9.0 locally and confirmed a new test fails before the fix and passes after, and that existing tests still pass.'],
    why: ['「たぶん直る」ではなく「こう確かめた」と書けると、修正案の信頼度が上がる。', 'Being able to say "here is how I checked" rather than "this probably works" makes the fix more trustworthy.'],
  },
  {
    icon: PiPaperPlaneTiltBold,
    title: ['テンプレートに沿って出す', 'File it following the template'],
    did: ['バグ報告のテンプレート（症状・コンポーネント・再現・期待する動作・環境）に沿って書き、最後に「よければ PR を出す」と添えた。', 'Wrote it following the bug template (what happens, component, reproduction, expected behavior, environment) and added at the end that I was happy to open a PR.'],
    why: ['テンプレートの順はメンテナーが読みたい順。自分で直す気があることも伝わる。', 'The template order is the order maintainers want to read in. It also shows you are willing to fix it yourself.'],
  },
]

/** 出すまでにやったことを、上から順に読めるリストで並べる（操作はいらない） */
export function IssueFlow() {
  const tr = useTr()
  return (
    <ol className="mx-auto flex w-full max-w-[720px] flex-col" aria-label={tr('出すまでの流れ', 'Steps before filing')}>
      {STEPS.map((st, i) => {
        const Icon = st.icon
        const last = i === STEPS.length - 1
        return (
          <li key={st.title[1]} className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-4">
            {/* 左の縦線で、上から順に進むことを示す */}
            <div className="flex flex-col items-center">
              <span className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-full bg-teal/10 text-teal">
                <Icon className="text-[19px]" />
              </span>
              {!last && <span aria-hidden className="w-[2px] flex-1 bg-ink/10" />}
            </div>
            <div className={`flex min-w-0 flex-col gap-2 pt-[7px] ${last ? '' : 'pb-7'}`}>
              <span className="flex items-baseline gap-2">
                <span className="font-mono text-[12px] font-bold text-mute">{i + 1}</span>
                <span className="text-[16px] font-extrabold">{tr(...st.title)}</span>
              </span>
              <p className="text-[14.5px] leading-[1.85] text-ink/85">{tr(...st.did)}</p>
              <p className="flex gap-2 text-[13.5px] leading-[1.8] text-mute">
                <span className="shrink-0 font-bold text-teal">{tr('なぜ', 'Why')}</span>
                <span>{tr(...st.why)}</span>
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

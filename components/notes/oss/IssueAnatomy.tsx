'use client'

import { Rich, useTr } from '@/components/notes/i18n'

type Part = { id: string; head: string; lines: number; template?: boolean; what: [string, string]; role: [string, string] }

/** バグ報告 #23303 の本文を、上から順に節に分けたもの。節ごとに書いた中身と役割 */
const ISSUES: Record<'bug', { number: number; title: string; parts: Part[] }> = {
  bug: {
    number: 23303,
    title: '[BUG] Range query approximation…',
    parts: [
      {
        id: 'title',
        head: 'Title',
        lines: 1,
        what: ['[BUG] Range query approximation is applied to `post_filter`, rescore_query, named queries and inner_hits, silently dropping matches', '[BUG] Range query approximation is applied to `post_filter`, rescore_query, named queries and inner_hits, silently dropping matches'],
        role: ['何が・どこで・どうなるかを 1 行に入れる。一覧で見たメンテナーが、自分の担当か、どれくらい深刻かを開かずに判断できる。', 'Fit what, where and how into one line. Scanning the list, a maintainer can tell whether it is theirs and how serious it is without opening it.'],
      },
      {
        id: 'bug',
        head: 'Describe the bug',
        lines: 5,
        template: true,
        what: ['症状（エラーなしで一致が落ちる、件数が `eq` のまま減る）、影響する 6 か所、影響するバージョン（3.0.0〜3.9.0 と `main`、2.19.5 は影響なし）。', 'The symptom (matches silently drop with no error; the count shrinks but is still reported as `eq`), the 6 affected places, and the affected versions (3.0.0–3.9.0 and `main`; 2.19.5 is not affected).'],
        role: ['最初の数行で「誰に関係あるか」が分かるようにする。影響範囲が広いことも、ここで伝わる。', 'Make the first few lines tell who it affects. They also convey how wide the impact is.'],
      },
      {
        id: 'component',
        head: 'Related component',
        lines: 1,
        template: true,
        what: ['Search:Performance', 'Search:Performance'],
        role: ['テンプレートの選択肢から選ぶ。ラベルになり、その領域の担当者に届く。', 'Picked from the template’s options. It becomes a label and reaches the owners of that area.'],
      },
      {
        id: 'repro',
        head: 'To Reproduce',
        lines: 6,
        template: true,
        what: ['curl だけで動く再現スクリプトと、4 つのバージョンでの結果の表。ほかの影響箇所の再現は折りたたみに入れた。', 'A reproduction script that runs with curl alone, plus a table of results across four versions. Reproductions for the other affected places went into a collapsible section.'],
        role: ['コピーして貼れば再現できる、が一番強い。表があると「いつから」が一目で分かる。長い補足は折りたたんで、本筋を読みやすく保つ。', 'Copy, paste, reproduce is the strongest form. The table shows at a glance when it broke. Folding away long extras keeps the main line easy to read.'],
      },
      {
        id: 'expected',
        head: 'Expected behavior',
        lines: 1,
        template: true,
        what: ['`post_filter` などでは `range` を正確に評価してほしい（2.19 と同じ）。近似してよいのは本命のクエリだけ。', '`post_filter` and the others should evaluate the `range` exactly (as on 2.19). Only the main query should be approximated.'],
        role: ['「何が正しいか」を一文で。ここが曖昧だと、仕様なのかバグなのかの議論から始まってしまう。', 'State what is correct in one sentence. If this is vague, the discussion starts with whether it is a bug or by design.'],
      },
      {
        id: 'env',
        head: 'Additional Details',
        lines: 2,
        template: true,
        what: ['公式 Docker イメージ、単一ノード、セキュリティプラグインなし、macOS（arm64）。プラグインに依存しないこと。', 'Official Docker images, single node, no security plugin, macOS (arm64). Not dependent on any plugin.'],
        role: ['環境の違いで再現しない、を防ぐ。', 'Prevents “cannot reproduce” caused by a different environment.'],
      },
      {
        id: 'cause',
        head: 'Cause',
        lines: 4,
        what: ['近似を有効にする処理が、本命のクエリ以外にもかかっている。該当コードへのリンク（3.9.0 のタグに固定）と、3.0.0 では大きなセグメントでしか起きなかった理由。', 'The code that enables approximation also applies to queries other than the main one. Links to the code (pinned to the 3.9.0 tag), and why 3.0.0 only showed it on large segments.'],
        role: ['テンプレートにはない節。調べたことを残しておくと、直す人が同じ調査をやり直さずに済む。', 'A section the template does not have. Recording what you found saves whoever fixes it from redoing the investigation.'],
      },
      {
        id: 'fix',
        head: 'Possible fix',
        lines: 4,
        what: ['1 行の条件を足す diff、ローカルで足したテストと通した既存テスト、この直し方の弱点と別案、「よければ PR を出す」。', 'A diff adding a one-line condition, the tests added and run locally, the weakness of this fix and an alternative, and an offer to open a PR.'],
        role: ['案として出す。弱点も自分から書く。決めるのはメンテナー。', 'Present it as a proposal. Point out the weakness yourself. The maintainers decide.'],
      },
    ],
  },
}

/** Issue の節ごとに「書いたこと」と「その節の役割」を並べる。操作はいらない */
export function IssueAnatomy() {
  const tr = useTr()
  const issue = ISSUES.bug
  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8">
      {issue.parts.map((p) => (
        <section key={p.id} className="flex flex-col gap-3">
          <h3 className="text-[17px] font-extrabold leading-[1.5] sm:text-[19px]">
            {p.id === 'title' ? tr('タイトル', 'Title') : p.id === 'cause' ? tr('原因', 'Cause') : p.id === 'fix' ? tr('修正案', 'Possible fix') : p.head}
          </h3>
          {/* 実際に Issue に書いた中身は、引用として地の文と分ける */}
          <blockquote className="border-l-4 border-ink/15 py-1 pl-4 text-[14.5px] leading-[1.9] text-ink/70 sm:text-[15px]">
            <Rich text={tr(...p.what)} />
          </blockquote>
          <p className="text-[15px] leading-[2] text-ink/85 sm:text-[16px]">
            <Rich text={tr(...p.role)} />
          </p>
        </section>
      ))}
    </div>
  )
}

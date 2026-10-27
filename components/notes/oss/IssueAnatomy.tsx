'use client'

import { useTr } from '@/components/notes/i18n'

type Part = { id: string; head: string; lines: number; template?: boolean; what: [string, string]; role: [string, string] }

/** 2 つの Issue の本文を、上から順に節に分けたもの。左が Issue の形、右がその節の中身と役割 */
const ISSUES: Record<'bug' | 'feature', { number: number; title: string; parts: Part[] }> = {
  bug: {
    number: 23303,
    title: '[BUG] Range query approximation…',
    parts: [
      {
        id: 'title',
        head: 'Title',
        lines: 1,
        what: ['[BUG] Range query approximation is applied to post_filter, rescore_query, named queries and inner_hits, silently dropping matches', '[BUG] Range query approximation is applied to post_filter, rescore_query, named queries and inner_hits, silently dropping matches'],
        role: ['何が・どこで・どうなるかを 1 行に入れる。一覧で見たメンテナーが、自分の担当か、どれくらい深刻かを開かずに判断できる。', 'Fit what, where and how into one line. Scanning the list, a maintainer can tell whether it is theirs and how serious it is without opening it.'],
      },
      {
        id: 'bug',
        head: 'Describe the bug',
        lines: 5,
        template: true,
        what: ['症状（エラーなしで一致が落ちる、件数が eq のまま減る）、影響する 6 か所、影響するバージョン（3.0.0〜3.9.0 と main、2.19.5 は影響なし）。', 'The symptom (matches silently drop with no error; the count shrinks but is still reported as eq), the 6 affected places, and the affected versions (3.0.0–3.9.0 and main; 2.19.5 is not affected).'],
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
        what: ['post_filter などでは range を正確に評価してほしい（2.19 と同じ）。近似してよいのは本命のクエリだけ。', 'post_filter and the others should evaluate the range exactly (as on 2.19). Only the main query should be approximated.'],
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
  feature: {
    number: 23429,
    title: '[Feature Request] Expose which Lucene segment…',
    parts: [
      {
        id: 'title',
        head: 'Title',
        lines: 1,
        what: ['[Feature Request] Expose which Lucene segment each search hit came from (opt-in, for debugging)', '[Feature Request] Expose which Lucene segment each search hit came from (opt-in, for debugging)'],
        role: ['何がほしいかに加えて、「opt-in」「for debugging」で影響の小ささと用途を先に伝える。', 'Besides what is wanted, “opt-in” and “for debugging” signal up front that the impact is small and what it is for.'],
      },
      {
        id: 'problem',
        head: 'Is your feature request related to a problem? Please describe',
        lines: 6,
        template: true,
        what: ['k-NN と post_filter を組み合わせると、ドキュメントがどのセグメントにいるかで結果が変わる現象。curl の再現と、今の回避策（_doc ソート + _cat/segments）が壊れやすい理由。', 'Combining k-NN with post_filter makes results depend on which segment a document is in. A curl reproduction, and why the current workaround (_doc sort + _cat/segments) is fragile.'],
        role: ['機能要望でも、まず「困っていること」を再現できる形で示す。ほしい機能の必要性は、問題の具体さで決まる。', 'Even for a feature request, first show the problem in a reproducible form. How much the feature is needed depends on how concrete the problem is.'],
      },
      {
        id: 'solution',
        head: 'Describe the solution you\'d like',
        lines: 5,
        template: true,
        what: ['version や seq_no_primary_term と同じ形の opt-in フラグ。返す JSON の例と、fetch の段階で読めるので小さく作れそうだという見立て。', 'An opt-in flag shaped like version or seq_no_primary_term, an example of the returned JSON, and a guess that it can be small because the segment is readable in the fetch phase.'],
        role: ['既存の API に似た形にすると、受け入れる側の想像がしやすい。完成形の例を見せると話が早い。', 'A shape similar to existing APIs is easier for them to picture. Showing the finished result speeds things up.'],
      },
      {
        id: 'component',
        head: 'Related component',
        lines: 1,
        template: true,
        what: ['Search', 'Search'],
        role: ['ラベルになり、担当の領域に届く。', 'It becomes a label and reaches the owners of that area.'],
      },
      {
        id: 'alternatives',
        head: 'Describe alternatives you\'ve considered',
        lines: 5,
        template: true,
        what: ['_cat/segments、_shard_doc、k-NN の explain、Profile API、efficient filtering。それぞれで何が分かって何が分からないか。', '_cat/segments, _shard_doc, k-NN explain, the Profile API and efficient filtering: what each one tells you and what it does not.'],
        role: ['「それなら〇〇で足りるのでは」を先回りして潰す。既存の機能をよく調べたことも伝わる。', 'Heads off “can’t you just use X?” in advance. It also shows you have studied the existing features.'],
      },
      {
        id: 'context',
        head: 'Additional context',
        lines: 2,
        template: true,
        what: ['2.19.5 と 3.9.0 で同じ結果になること、関連するドキュメントへのリンク。', 'That 2.19.5 and 3.9.0 give the same results, and a link to the related docs.'],
        role: ['前提をそろえる。', 'Gets everyone on the same page.'],
      },
    ],
  },
}

/** Issue の節ごとに「書いたこと」と「その節の役割」を並べる。操作はいらない */
export function IssueAnatomy({ which }: { which: 'bug' | 'feature' }) {
  const tr = useTr()
  const issue = ISSUES[which]
  return (
    <ol className="mx-auto flex w-full max-w-[720px] flex-col divide-y divide-ink/10 overflow-hidden rounded-[10px] border border-ink/10">
      {issue.parts.map((p) => (
        <li key={p.id} className="flex flex-col gap-2 px-5 py-4">
          <span className="flex flex-wrap items-center gap-2">
            <span className={`text-[14px] font-extrabold ${p.template ? 'font-mono' : ''}`}>
              {p.id === 'title' ? tr('タイトル', 'Title') : p.id === 'cause' ? tr('原因', 'Cause') : p.id === 'fix' ? tr('修正案', 'Possible fix') : `### ${p.head}`}
            </span>
            {p.template ? (
              <span className="rounded-[4px] bg-ink/[0.07] px-[6px] py-[1px] text-[10.5px] font-bold text-mute">{tr('テンプレート', 'template')}</span>
            ) : (
              p.id !== 'title' && <span className="rounded-[4px] bg-teal/10 px-[6px] py-[1px] text-[10.5px] font-bold text-teal">{tr('追加した節', 'added section')}</span>
            )}
          </span>
          <p className="text-[14px] leading-[1.8] text-ink/85">{tr(...p.what)}</p>
          <p className="flex gap-2 text-[13.5px] leading-[1.8] text-mute">
            <span className="shrink-0 font-bold text-teal">{tr('役割', 'Role')}</span>
            <span>{tr(...p.role)}</span>
          </p>
        </li>
      ))}
    </ol>
  )
}

'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FigButton, FigureFrame } from '@/components/notes/FigureFrame'

type Part = { id: string; head: string; lines: number; template?: boolean; what: string; role: string }

/** 2 つの Issue の本文を、上から順に節に分けたもの。左が Issue の形、右がその節の中身と役割 */
const ISSUES: Record<'bug' | 'feature', { number: number; title: string; parts: Part[] }> = {
  bug: {
    number: 23303,
    title: '[BUG] Range query approximation…',
    parts: [
      {
        id: 'title',
        head: 'タイトル',
        lines: 1,
        what: '[BUG] Range query approximation is applied to post_filter, rescore_query, named queries and inner_hits, silently dropping matches',
        role: '何が・どこで・どうなるかを 1 行に入れる。一覧で見たメンテナーが、自分の担当か、どれくらい深刻かを開かずに判断できる。',
      },
      {
        id: 'bug',
        head: 'Describe the bug',
        lines: 5,
        template: true,
        what: '症状（エラーなしで一致が落ちる、件数が eq のまま減る）、影響する 6 か所、影響するバージョン（3.0.0〜3.9.0 と main、2.19.5 は影響なし）。',
        role: '最初の数行で「誰に関係あるか」が分かるようにする。影響範囲が広いことも、ここで伝わる。',
      },
      {
        id: 'component',
        head: 'Related component',
        lines: 1,
        template: true,
        what: 'Search:Performance',
        role: 'テンプレートの選択肢から選ぶ。ラベルになり、その領域の担当者に届く。',
      },
      {
        id: 'repro',
        head: 'To Reproduce',
        lines: 6,
        template: true,
        what: 'curl だけで動く再現スクリプトと、4 つのバージョンでの結果の表。ほかの影響箇所の再現は折りたたみに入れた。',
        role: 'コピーして貼れば再現できる、が一番強い。表があると「いつから」が一目で分かる。長い補足は折りたたんで、本筋を読みやすく保つ。',
      },
      {
        id: 'expected',
        head: 'Expected behavior',
        lines: 1,
        template: true,
        what: 'post_filter などでは range を正確に評価してほしい（2.19 と同じ）。近似してよいのは本命のクエリだけ。',
        role: '「何が正しいか」を一文で。ここが曖昧だと、仕様なのかバグなのかの議論から始まってしまう。',
      },
      {
        id: 'env',
        head: 'Additional Details',
        lines: 2,
        template: true,
        what: '公式 Docker イメージ、単一ノード、セキュリティプラグインなし、macOS（arm64）。プラグインに依存しないこと。',
        role: '環境の違いで再現しない、を防ぐ。',
      },
      {
        id: 'cause',
        head: '原因（追加）',
        lines: 4,
        what: '近似を有効にする処理が、本命のクエリ以外にもかかっている。該当コードへのリンク（3.9.0 のタグに固定）と、3.0.0 では大きなセグメントでしか起きなかった理由。',
        role: 'テンプレートにはない節。調べたことを残しておくと、直す人が同じ調査をやり直さずに済む。',
      },
      {
        id: 'fix',
        head: '修正案（追加）',
        lines: 4,
        what: '1 行の条件を足す diff、ローカルで足したテストと通した既存テスト、この直し方の弱点と別案、「よければ PR を出す」。',
        role: '案として出す。弱点も自分から書く。決めるのはメンテナー。',
      },
    ],
  },
  feature: {
    number: 23429,
    title: '[Feature Request] Expose which Lucene segment…',
    parts: [
      {
        id: 'title',
        head: 'タイトル',
        lines: 1,
        what: '[Feature Request] Expose which Lucene segment each search hit came from (opt-in, for debugging)',
        role: '何がほしいかに加えて、「opt-in」「for debugging」で影響の小ささと用途を先に伝える。',
      },
      {
        id: 'problem',
        head: 'Is your feature request related to a problem? Please describe',
        lines: 6,
        template: true,
        what: 'k-NN と post_filter を組み合わせると、ドキュメントがどのセグメントにいるかで結果が変わる現象。curl の再現と、今の回避策（_doc ソート + _cat/segments）が壊れやすい理由。',
        role: '機能要望でも、まず「困っていること」を再現できる形で示す。ほしい機能の必要性は、問題の具体さで決まる。',
      },
      {
        id: 'solution',
        head: 'Describe the solution you\'d like',
        lines: 5,
        template: true,
        what: 'version や seq_no_primary_term と同じ形の opt-in フラグ。返す JSON の例と、fetch の段階で読めるので小さく作れそうだという見立て。',
        role: '既存の API に似た形にすると、受け入れる側の想像がしやすい。完成形の例を見せると話が早い。',
      },
      {
        id: 'component',
        head: 'Related component',
        lines: 1,
        template: true,
        what: 'Search',
        role: 'ラベルになり、担当の領域に届く。',
      },
      {
        id: 'alternatives',
        head: 'Describe alternatives you\'ve considered',
        lines: 5,
        template: true,
        what: '_cat/segments、_shard_doc、k-NN の explain、Profile API、efficient filtering。それぞれで何が分かって何が分からないか。',
        role: '「それなら〇〇で足りるのでは」を先回りして潰す。既存の機能をよく調べたことも伝わる。',
      },
      {
        id: 'context',
        head: 'Additional context',
        lines: 2,
        template: true,
        what: '2.19.5 と 3.9.0 で同じ結果になること、関連するドキュメントへのリンク。',
        role: '前提をそろえる。',
      },
    ],
  },
}

export function IssueAnatomy() {
  const [which, setWhich] = useState<'bug' | 'feature'>('bug')
  const issue = ISSUES[which]
  const [id, setId] = useState('repro')
  const cur = issue.parts.find((p) => p.id === id) ?? issue.parts[0]

  function choose(w: 'bug' | 'feature') {
    setWhich(w)
    setId(w === 'bug' ? 'repro' : 'problem')
  }

  return (
    <FigureFrame className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Issue の種類">
        <FigButton active={which === 'bug'} onClick={() => choose('bug')}>
          バグ報告 #23303
        </FigButton>
        <FigButton active={which === 'feature'} onClick={() => choose('feature')}>
          機能要望 #23429
        </FigButton>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Issue の紙面 */}
        <div className="flex flex-col gap-[6px] rounded-[10px] border border-ink/10 bg-tile p-3" role="tablist" aria-label="Issue の節">
          <span className="mb-1 flex items-center gap-2 px-1 font-mono text-[11px] text-mute">
            <span className="rounded-full bg-teal px-[7px] py-[1px] font-sans text-[10px] font-bold text-paper">Open</span>
            opensearch-project/OpenSearch #{issue.number}
          </span>
          {issue.parts.map((p) => {
            const on = p.id === cur.id
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setId(p.id)}
                className={`flex flex-col gap-[5px] rounded-[7px] border-2 px-3 py-[8px] text-left transition-colors duration-150 ${
                  on ? 'border-teal bg-teal/[0.06]' : 'border-transparent hover:bg-ink/[0.04]'
                }`}
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className={`min-w-0 break-words text-[12.5px] font-extrabold ${p.id === 'title' ? '' : 'font-mono'}`}>{p.id === 'title' ? issue.title : `### ${p.head}`}</span>
                  {p.template && <span className="rounded-[4px] bg-ink/[0.07] px-[5px] text-[9.5px] font-bold text-mute">テンプレート</span>}
                </span>
                {/* 本文の量を灰色の線で */}
                <span className="flex flex-col gap-[4px]">
                  {Array.from({ length: Math.min(p.lines, 3) }, (_, i) => (
                    <span key={i} className={`h-[5px] rounded-full ${on ? 'bg-teal/40' : 'bg-ink/10'} ${i === Math.min(p.lines, 3) - 1 ? 'w-2/3' : 'w-full'}`} />
                  ))}
                </span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${which}-${cur.id}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 self-start rounded-[10px] border border-ink/10 bg-tile p-4 sm:p-5"
            role="tabpanel"
            aria-live="polite"
          >
            <span className="break-words text-[16px] font-extrabold">{cur.head}</span>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-[.06em] text-mute">書いたこと</span>
              <p className="text-[13.5px] leading-[1.75]">{cur.what}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-[.06em] text-teal">この節の役割</span>
              <p className="text-[13.5px] leading-[1.75] text-ink/80">{cur.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </FigureFrame>
  )
}

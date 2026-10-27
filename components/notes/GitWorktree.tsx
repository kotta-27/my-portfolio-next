import { PiArrowsSplitBold, PiBugBeetleBold, PiEyeBold, PiRobotBold } from 'react-icons/pi'
import { C, Callout, Figure, Li, NoteSection, P, Strong, Terminal } from '@/components/notes/Prose'
import { RepoModel } from '@/components/notes/worktree/RepoModel'
import { SwitchVsWorktree } from '@/components/notes/worktree/SwitchVsWorktree'
import { SharedVsOwn } from '@/components/notes/worktree/SharedVsOwn'
import { SameBranch } from '@/components/notes/worktree/SameBranch'

export const toc = [
  { id: 'why', title: 'なぜ調べたか' },
  { id: 'model', title: 'リポジトリと作業ツリーは別のもの' },
  { id: 'compare', title: '入れ替えるか、増やすか' },
  { id: 'shared', title: '共有されるもの、worktree ごとのもの' },
  { id: 'one-branch', title: '同じブランチは 1 か所だけ' },
  { id: 'pitfalls', title: 'つまずきやすいところ' },
  { id: 'when', title: 'どんなときに使うか' },
  { id: 'cheatsheet', title: 'コマンド早見表' },
]

const USES = [
  { icon: PiEyeBold, title: 'PR のレビュー', text: '自分の作業を止めずに、レビューするブランチを隣のフォルダで開いて動かす。' },
  { icon: PiBugBeetleBold, title: '急ぎの修正', text: 'feature の途中でも、main から hotfix を別フォルダに切って直す。stash は要らない。' },
  { icon: PiArrowsSplitBold, title: '重い処理の裏で', text: '片方のフォルダでテストやビルドを回したまま、もう片方で次の作業を進める。' },
  { icon: PiRobotBold, title: 'AI エージェントを並列に', text: 'エージェントごとにフォルダを渡せば、同じファイルを取り合わずに並行して書ける。' },
]

const COMMANDS = [
  { cmd: 'git worktree add <path> <branch>', text: '既にあるブランチを <path> に取り出す' },
  { cmd: 'git worktree add -b <new> <path> <start>', text: '<start> から新しいブランチを作って取り出す' },
  { cmd: 'git worktree add --detach <path> <commit>', text: 'ブランチなしで取り出す（見るだけのとき）' },
  { cmd: 'git worktree list', text: 'フォルダとブランチの一覧' },
  { cmd: 'git worktree remove <path>', text: 'フォルダと管理情報を消す。変更があると止まる（--force で強制）' },
  { cmd: 'git worktree prune', text: '手で消したフォルダの管理情報を片付ける' },
  { cmd: 'git worktree move <path> <new-path>', text: 'フォルダを移す（mv だと繋がりが切れる）' },
  { cmd: 'git worktree lock <path>', text: '外付けディスクなど、一時的に見えなくても prune させない' },
]

export function GitWorktree() {
  return (
    <>
      <P>
        <Strong>git worktree は、1 つのリポジトリから作業フォルダをいくつも取り出す機能</Strong>
        です。ブランチを切り替える代わりに、ブランチごとにフォルダを並べて、同時に開いておけます。コマンドの使い方より先に「何が起きているのか」を、図で整理しました。
      </P>

      <NoteSection step={1} id="why" title="なぜ調べたか">
        <P>
          AI のコーディングエージェントを複数並べて動かす話になると、決まって worktree が出てきます。名前は知っていても、
          <C>git stash</C> で行き来するのと何が違うのか、フォルダを増やしてディスクは大丈夫なのか、説明できませんでした。
        </P>
      </NoteSection>

      <NoteSection step={2} id="model" title="リポジトリと作業ツリーは別のもの">
        <P>
          まず、git には 2 つの層があります。<Strong>リポジトリ（.git）</Strong>は、全部のコミットとブランチを持つ「倉庫」。
          <Strong>作業ツリー</Strong>は、そこから 1 本のブランチを取り出してファイルとして並べた「作業台」です。どのブランチを取り出しているかは <C>HEAD</C> が指しています。
        </P>
        <Figure kind="animation" n={1} caption="上が作業ツリー、下がリポジトリ。色はブランチ。ボタンで状態を切り替えると、どのフォルダがどのブランチを取り出しているかが変わる。">
          <RepoModel />
        </Figure>
        <P>
          ふつうは倉庫 1 つに作業台 1 つ。だから別のブランチを触るには、作業台の上を片付けて並べ直す（switch）しかありません。
          <Strong>worktree は、倉庫はそのままに作業台だけを増やす</Strong>仕組みです。
        </P>
      </NoteSection>

      <NoteSection step={3} id="compare" title="入れ替えるか、増やすか">
        <P>この違いは、作業の途中に別のブランチを触りたくなったときにはっきり出ます。feature の途中で、急ぎの修正が入った場面です。</P>
        <Figure kind="animation" n={2} caption="同じ場面を 2 通りで。「再生」で 1 コマずつ進む。入れ替えるやり方は 5 手、増やすやり方は 3 手で、変更を逃がす必要もない。">
          <SwitchVsWorktree />
        </Figure>
        <Callout title="もう 1 回 clone するのと何が違う？">
          clone すると倉庫ごと 2 つになり、ブランチやコミットも別々です。片方で作ったブランチをもう片方で使うには push と fetch が要ります。worktree は倉庫を共有するので、増えるのは作業台のファイルだけ。片方でしたコミットは、もう片方からすぐ見えます。
        </Callout>
      </NoteSection>

      <NoteSection step={4} id="shared" title="共有されるもの、worktree ごとのもの">
        <P>
          では、作業台を増やしたとき何が 1 つで、何が別々なのか。ポイントは、<Strong>HEAD（今いるブランチ）と index（ステージ）と手元のファイルだけが worktree ごと</Strong>
          で、コミット・ブランチ・設定は全員で 1 つを使っていることです。
        </P>
        <Figure kind="animation" n={3} caption="「次へ」で進む。片方の worktree でコミットすると、それは共有の倉庫に入り、もう片方からもすぐ見える。">
          <SharedVsOwn />
        </Figure>
        <P>
          倉庫を共有できるのは、増やしたフォルダの <C>.git</C> がフォルダではなく、本体の倉庫の場所を書いた 1 行のファイルだからです。
        </P>
        <Figure kind="code" n={1} caption="追加した worktree の .git の中身。本体の .git の中にある、このフォルダ用の管理場所を指している。">
          <Terminal title="~/dev/app-hotfix" lines={[{ cmd: 'cat .git', out: 'gitdir: /Users/you/dev/app/.git/worktrees/app-hotfix' }]} />
        </Figure>
      </NoteSection>

      <NoteSection step={5} id="one-branch" title="同じブランチは 1 か所だけ">
        <P>
          worktree には 1 つ制約があります。<Strong>同じブランチを 2 つのフォルダで同時に開くことはできません</Strong>。HEAD はフォルダごとにあっても、ブランチ自体は共有なので、
          片方で進めるともう片方の作業台が置いていかれるからです。
        </P>
        <Figure kind="animation" n={4} caption="「もし開けたら」を順に。コミットでブランチが進むと、もう片方のフォルダのファイルとずれる。">
          <SameBranch />
        </Figure>
        <P>
          同じ内容を別のフォルダで見たいだけなら、ブランチではなくコミットを直接取り出します（<C>git worktree add --detach ../app-peek main</C>）。
        </P>
      </NoteSection>

      <NoteSection step={6} id="pitfalls" title="つまずきやすいところ">
        <Callout tone="warn" title="git の管理外のファイルは付いてこない">
          新しい作業台に並ぶのはコミットされたファイルだけです。<C>node_modules</C> や <C>.env</C>、ビルド結果は無いので、<C>npm install</C> し直したり、
          <C>.env</C> をコピーしたりが要ります。
        </Callout>
        <Callout tone="warn" title="フォルダは rm -rf ではなく remove で消す">
          手で消すと倉庫の中に管理情報が残り、ブランチも「使用中」のままになります。消してしまったら <C>git worktree prune</C> で片付けます。また remove してもブランチは消えないので、要らなければ{' '}
          <C>git branch -d</C> も。
        </Callout>
        <Callout title="フォルダはリポジトリの隣に置く">
          リポジトリの中に作ると、本体の <C>git status</C> に未追跡のフォルダとして出てきます。<C>../app-hotfix</C> のように隣に置くと扱いやすいです。
        </Callout>
      </NoteSection>

      <NoteSection step={7} id="when" title="どんなときに使うか">
        <div className="mx-auto grid w-full max-w-[720px] gap-3 sm:grid-cols-2">
          {USES.map((u) => (
            <div key={u.title} className="flex flex-col gap-2 rounded-[10px] bg-soft p-4">
              <span className="flex items-center gap-2 text-[14px] font-extrabold">
                <u.icon className="text-[17px] text-teal" />
                {u.title}
              </span>
              <span className="text-[13.5px] leading-[1.8] text-ink/80">{u.text}</span>
            </div>
          ))}
        </div>
        <P>逆に、ブランチを 1 日に 1〜2 回切り替えるくらいなら switch で十分です。「行き来が多い」「止めたくない処理がある」ときに効きます。</P>
      </NoteSection>

      <NoteSection step={8} id="cheatsheet" title="コマンド早見表">
        <Figure kind="table" n={1} caption="git worktree のサブコマンド。<path> は作業フォルダの場所。">
          <div className="flex w-full flex-col divide-y divide-ink/10 overflow-hidden rounded-[10px] border border-ink/10">
            {COMMANDS.map((c) => (
              <div key={c.cmd} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] sm:gap-4">
                <code className="break-all font-mono text-[12.5px] font-bold text-ink">{c.cmd}</code>
                <span className="text-[13px] leading-[1.7] text-mute">{c.text}</span>
              </div>
            ))}
          </div>
        </Figure>
      </NoteSection>

      <section className="mx-auto mt-6 w-full max-w-[720px] rounded-[10px] bg-slab p-6 text-slab-fg sm:p-8">
        <span className="text-[10.5px] font-bold uppercase tracking-[.08em] text-slab-fg/55">まとめ</span>
        <ul className="mt-3 flex flex-col gap-3 text-[15px] font-semibold leading-[1.8]">
          <Li>git には、全部を持つリポジトリ（倉庫）と、1 本を取り出した作業ツリー（作業台）がある。</Li>
          <Li>switch は作業台の中身を入れ替える。worktree は作業台を増やす。</Li>
          <Li>増やした作業台ごとに別なのは HEAD・index・ファイルだけ。コミットとブランチは共有。</Li>
          <Li>だから同じブランチは 1 か所でしか開けない。</Li>
        </ul>
      </section>
    </>
  )
}

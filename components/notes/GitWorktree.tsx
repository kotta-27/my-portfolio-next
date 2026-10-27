import { PiArrowsSplitBold, PiBugBeetleBold, PiEyeBold, PiRobotBold } from 'react-icons/pi'
import type { IconType } from 'react-icons'
import { C, Callout, Figure, Li, NoteSection, P, Strong, Terminal } from '@/components/notes/Prose'
import { RepoModel } from '@/components/notes/worktree/RepoModel'
import { SwitchVsWorktree } from '@/components/notes/worktree/SwitchVsWorktree'
import { SharedVsOwn } from '@/components/notes/worktree/SharedVsOwn'
import { SameBranch } from '@/components/notes/worktree/SameBranch'

export const toc = [
  { id: 'why', title: { ja: 'なぜ調べたか', en: 'Why I looked into it' } },
  { id: 'model', title: { ja: 'リポジトリと作業ツリーは別のもの', en: 'The repository and the working tree are different things' } },
  { id: 'compare', title: { ja: '入れ替えるか、増やすか', en: 'Swap the contents, or add a folder' } },
  { id: 'shared', title: { ja: '共有されるもの、worktree ごとのもの', en: 'What is shared, and what each worktree owns' } },
  { id: 'one-branch', title: { ja: '同じブランチは 1 か所だけ', en: 'One branch, one place' } },
  { id: 'pitfalls', title: { ja: 'つまずきやすいところ', en: 'Pitfalls' } },
  { id: 'when', title: { ja: 'どんなときに使うか', en: 'When to use it' } },
  { id: 'cheatsheet', title: { ja: 'コマンド早見表', en: 'Command cheat sheet' } },
]

type Use = { icon: IconType; title: string; text: string }

const USES: Use[] = [
  { icon: PiEyeBold, title: 'PR のレビュー', text: '自分の作業を止めずに、レビューするブランチを隣のフォルダで開いて動かす。' },
  { icon: PiBugBeetleBold, title: '急ぎの修正', text: 'feature の途中でも、main から hotfix を別フォルダに切って直す。stash は要らない。' },
  { icon: PiArrowsSplitBold, title: '重い処理の裏で', text: '片方のフォルダでテストやビルドを回したまま、もう片方で次の作業を進める。' },
  { icon: PiRobotBold, title: 'AI エージェントを並列に', text: 'エージェントごとにフォルダを渡せば、同じファイルを取り合わずに並行して書ける。' },
]

const USES_EN: Use[] = [
  { icon: PiEyeBold, title: 'Reviewing PRs', text: 'Open the branch under review in a folder next to yours and run it, without stopping your own work.' },
  { icon: PiBugBeetleBold, title: 'Urgent fixes', text: 'Even in the middle of a feature, cut a hotfix from main in a separate folder and fix it there. No stash needed.' },
  { icon: PiArrowsSplitBold, title: 'Behind long-running jobs', text: 'Keep tests or a build running in one folder while you move on in another.' },
  { icon: PiRobotBold, title: 'Running AI agents in parallel', text: 'Give each agent its own folder, and they can write in parallel without fighting over the same files.' },
]

type Command = { cmd: string; text: string }

const COMMANDS: Command[] = [
  { cmd: 'git worktree add <path> <branch>', text: '既にあるブランチを <path> に取り出す' },
  { cmd: 'git worktree add -b <new> <path> <start>', text: '<start> から新しいブランチを作って取り出す' },
  { cmd: 'git worktree add --detach <path> <commit>', text: 'ブランチなしで取り出す（見るだけのとき）' },
  { cmd: 'git worktree list', text: 'フォルダとブランチの一覧' },
  { cmd: 'git worktree remove <path>', text: 'フォルダと管理情報を消す。変更があると止まる（--force で強制）' },
  { cmd: 'git worktree prune', text: '手で消したフォルダの管理情報を片付ける' },
  { cmd: 'git worktree move <path> <new-path>', text: 'フォルダを移す（mv だと繋がりが切れる）' },
  { cmd: 'git worktree lock <path>', text: '外付けディスクなど、一時的に見えなくても prune させない' },
]

const COMMANDS_EN: Command[] = [
  { cmd: 'git worktree add <path> <branch>', text: 'Check out an existing branch at <path>' },
  { cmd: 'git worktree add -b <new> <path> <start>', text: 'Create a new branch from <start> and check it out' },
  { cmd: 'git worktree add --detach <path> <commit>', text: 'Check out without a branch (just to look)' },
  { cmd: 'git worktree list', text: 'List folders and their branches' },
  { cmd: 'git worktree remove <path>', text: 'Delete the folder and its admin data. Refuses if there are changes (--force to override)' },
  { cmd: 'git worktree prune', text: 'Clean up admin data for folders you deleted by hand' },
  { cmd: 'git worktree move <path> <new-path>', text: 'Move a folder (a plain mv breaks the link)' },
  { cmd: 'git worktree lock <path>', text: 'Keep prune away even if it is temporarily missing, e.g. on an external disk' },
]

function UsesGrid({ items }: { items: Use[] }) {
  return (
    <div className="mx-auto grid w-full max-w-[720px] gap-3 sm:grid-cols-2">
      {items.map((u) => (
        <div key={u.title} className="flex flex-col gap-2 rounded-[10px] bg-soft p-4">
          <span className="flex items-center gap-2 text-[14px] font-extrabold">
            <u.icon className="text-[17px] text-teal" />
            {u.title}
          </span>
          <span className="text-[13.5px] leading-[1.8] text-ink/80">{u.text}</span>
        </div>
      ))}
    </div>
  )
}

function CommandTable({ items }: { items: Command[] }) {
  return (
    <div className="flex w-full flex-col divide-y divide-ink/10 overflow-hidden rounded-[10px] border border-ink/10">
      {items.map((c) => (
        <div key={c.cmd} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] sm:gap-4">
          <code className="break-all font-mono text-[12.5px] font-bold text-ink">{c.cmd}</code>
          <span className="text-[13px] leading-[1.7] text-mute">{c.text}</span>
        </div>
      ))}
    </div>
  )
}

function Summary({ label, items }: { label: string; items: string[] }) {
  return (
    <section className="mx-auto mt-6 w-full max-w-[720px] rounded-[10px] bg-slab p-6 text-slab-fg sm:p-8">
      <span className="text-[10.5px] font-bold uppercase tracking-[.08em] text-slab-fg/55">{label}</span>
      <ul className="mt-3 flex flex-col gap-3 text-[15px] font-semibold leading-[1.8]">
        {items.map((t) => (
          <Li key={t}>{t}</Li>
        ))}
      </ul>
    </section>
  )
}

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
        <UsesGrid items={USES} />
        <P>逆に、ブランチを 1 日に 1〜2 回切り替えるくらいなら switch で十分です。「行き来が多い」「止めたくない処理がある」ときに効きます。</P>
      </NoteSection>

      <NoteSection step={8} id="cheatsheet" title="コマンド早見表">
        <Figure kind="table" n={1} caption="git worktree のサブコマンド。<path> は作業フォルダの場所。">
          <CommandTable items={COMMANDS} />
        </Figure>
      </NoteSection>

      <Summary
        label="まとめ"
        items={[
          'git には、全部を持つリポジトリ（倉庫）と、1 本を取り出した作業ツリー（作業台）がある。',
          'switch は作業台の中身を入れ替える。worktree は作業台を増やす。',
          '増やした作業台ごとに別なのは HEAD・index・ファイルだけ。コミットとブランチは共有。',
          'だから同じブランチは 1 か所でしか開けない。',
        ]}
      />
    </>
  )
}

export function GitWorktreeEn() {
  return (
    <>
      <P>
        <Strong>git worktree lets you check out several working folders from a single repository.</Strong> Instead of switching branches, you lay out one folder per branch and keep
        them all open at once. Before getting into the commands, this note uses diagrams to sort out what is actually going on.
      </P>

      <NoteSection step={1} id="why" title="Why I looked into it">
        <P>
          Whenever people talk about running several AI coding agents side by side, worktrees come up. I knew the name, but I could not explain how it differs from moving back and
          forth with <C>git stash</C>, or whether adding folders is a problem for disk space.
        </P>
      </NoteSection>

      <NoteSection step={2} id="model" title="The repository and the working tree are different things">
        <P>
          First, git has two layers. The <Strong>repository (.git)</Strong> is the warehouse that holds every commit and branch. The <Strong>working tree</Strong> is the workbench:
          one branch taken out of the warehouse and laid out as files. Which branch is out on the bench is pointed to by <C>HEAD</C>.
        </P>
        <Figure kind="animation" n={1} caption="Working trees on top, the repository below. Colors are branches. Switch the state with the buttons to see which folder has which branch checked out.">
          <RepoModel />
        </Figure>
        <P>
          Normally there is one warehouse and one workbench. So to touch another branch, the only option is to clear the bench and lay it out again (switch).{' '}
          <Strong>A worktree keeps the warehouse as it is and just adds workbenches.</Strong>
        </P>
      </NoteSection>

      <NoteSection step={3} id="compare" title="Swap the contents, or add a folder">
        <P>The difference shows up clearly when you want to touch another branch in the middle of your work. Here, an urgent fix comes in while you are halfway through a feature.</P>
        <Figure kind="animation" n={2} caption="The same situation, two ways. Press Play to advance one frame at a time. Swapping takes 5 steps, adding a folder takes 3, and nothing has to be stashed.">
          <SwitchVsWorktree />
        </Figure>
        <Callout title="How is this different from cloning again?">
          A second clone gives you a second warehouse, with its own branches and commits. To use a branch made in one clone from the other, you need to push and fetch. A worktree
          shares the warehouse, so the only thing that grows is the files on the bench. A commit made in one worktree is visible from the other right away.
        </Callout>
      </NoteSection>

      <NoteSection step={4} id="shared" title="What is shared, and what each worktree owns">
        <P>
          So when you add a workbench, what stays single and what is separate? The key point:{' '}
          <Strong>only HEAD (the current branch), the index (the staging area) and the local files belong to each worktree</Strong>. Commits, branches and config are one set shared by all.
        </P>
        <Figure kind="animation" n={3} caption="Press Next to advance. A commit made in one worktree goes into the shared warehouse and is immediately visible from the other.">
          <SharedVsOwn />
        </Figure>
        <P>
          The warehouse can be shared because the <C>.git</C> in an added folder is not a directory but a one-line file that says where the main warehouse is.
        </P>
        <Figure kind="code" n={1} caption="The .git of an added worktree. It points to this folder's admin area inside the main .git.">
          <Terminal title="~/dev/app-hotfix" lines={[{ cmd: 'cat .git', out: 'gitdir: /Users/you/dev/app/.git/worktrees/app-hotfix' }]} />
        </Figure>
      </NoteSection>

      <NoteSection step={5} id="one-branch" title="One branch, one place">
        <P>
          Worktrees come with one restriction: <Strong>you cannot open the same branch in two folders at the same time</Strong>. Each folder has its own HEAD, but the branch itself
          is shared, so moving it forward in one folder would leave the other workbench behind.
        </P>
        <Figure kind="animation" n={4} caption="What would happen if you could, step by step. Once a commit moves the branch, the other folder's files no longer match it.">
          <SameBranch />
        </Figure>
        <P>
          If you only want to look at the same content in another folder, check out the commit instead of the branch (<C>git worktree add --detach ../app-peek main</C>).
        </P>
      </NoteSection>

      <NoteSection step={6} id="pitfalls" title="Pitfalls">
        <Callout tone="warn" title="Files outside git do not come along">
          Only committed files show up on the new workbench. <C>node_modules</C>, <C>.env</C> and build output are missing, so you need to run <C>npm install</C> again or copy{' '}
          <C>.env</C> over.
        </Callout>
        <Callout tone="warn" title="Delete folders with remove, not rm -rf">
          Deleting by hand leaves the admin data in the warehouse, and the branch stays marked as in use. If you already deleted it, clean up with <C>git worktree prune</C>. Also,
          remove does not delete the branch, so run <C>git branch -d</C> too if you no longer need it.
        </Callout>
        <Callout title="Put the folders next to the repository">
          If you create them inside the repository, they show up in the main <C>git status</C> as untracked folders. Placing them next to it, like <C>../app-hotfix</C>, is easier.
        </Callout>
      </NoteSection>

      <NoteSection step={7} id="when" title="When to use it">
        <UsesGrid items={USES_EN} />
        <P>
          On the other hand, if you only switch branches once or twice a day, switch is enough. Worktrees pay off when you go back and forth a lot, or when something is running that
          you do not want to stop.
        </P>
      </NoteSection>

      <NoteSection step={8} id="cheatsheet" title="Command cheat sheet">
        <Figure kind="table" n={1} caption="git worktree subcommands. <path> is the location of the working folder.">
          <CommandTable items={COMMANDS_EN} />
        </Figure>
      </NoteSection>

      <Summary
        label="Summary"
        items={[
          'Git has a repository (the warehouse) that holds everything, and working trees (workbenches) that each have one branch out.',
          'switch swaps what is on the workbench. A worktree adds another workbench.',
          'Each added workbench owns only HEAD, the index and the files. Commits and branches are shared.',
          'That is why a branch can be open in only one place.',
        ]}
      />
    </>
  )
}

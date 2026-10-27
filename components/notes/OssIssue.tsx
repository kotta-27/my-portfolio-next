import { A, C, Callout, Cite, CodeBlock, Figure, Li, NoteSection, P, References, Shot, Strong, type Reference } from '@/components/notes/Prose'
import { LinkPreview } from '@/components/notes/LinkPreview'
import { IssueFlow } from '@/components/notes/oss/IssueFlow'
import { IssueAnatomy } from '@/components/notes/oss/IssueAnatomy'
import { IssueTimeline } from '@/components/notes/oss/IssueTimeline'

export const toc = [
  { id: 'why', title: { ja: 'なぜ出したか', en: 'Why I filed them' } },
  { id: 'bug', title: { ja: '出した Issue', en: 'The issue I filed' } },
  { id: 'flow', title: { ja: '出すまでの流れ', en: 'Before filing' } },
  { id: 'anatomy', title: { ja: 'Issue の組み立て', en: 'How the issue is structured' } },
  { id: 'after', title: { ja: '出したあと', en: 'After filing' } },
  { id: 'feature', title: { ja: '機能要望も出してみた', en: 'A feature request, too' } },
  { id: 'mindset', title: { ja: '心構え', en: 'Mindset' } },
  { id: 'references', title: { ja: 'リンク', en: 'Links' } },
]

const REFS: Reference[] = [
  {
    authors: 'kotta-27',
    title: '[BUG] Range query approximation is applied to post_filter, rescore_query, named queries and inner_hits, silently dropping matches',
    source: 'opensearch-project/OpenSearch #23303',
    url: 'https://github.com/opensearch-project/OpenSearch/issues/23303',
  },
  { authors: 'Shivampal157', title: 'Fix approximation on non-main queries', source: 'opensearch-project/OpenSearch #23304', url: 'https://github.com/opensearch-project/OpenSearch/pull/23304' },
  {
    authors: 'kotta-27',
    title: '[Feature Request] Expose which Lucene segment each search hit came from (opt-in, for debugging)',
    source: 'opensearch-project/OpenSearch #23429',
    url: 'https://github.com/opensearch-project/OpenSearch/issues/23429',
  },
  { authors: 'OpenSearch', title: 'CONTRIBUTING.md', source: 'opensearch-project/OpenSearch', url: 'https://github.com/opensearch-project/OpenSearch/blob/main/CONTRIBUTING.md' },
  {
    authors: 'OpenSearch',
    title: 'バグ報告のテンプレート（bug_template.yml）',
    source: 'opensearch-project/OpenSearch',
    url: 'https://github.com/opensearch-project/OpenSearch/blob/main/.github/ISSUE_TEMPLATE/bug_template.yml',
  },
  {
    authors: 'OpenSearch',
    title: 'Approximate k-NN search',
    source: 'OpenSearch Documentation 2.17',
    url: 'https://docs.opensearch.org/2.17/search-plugins/knn/approximate-knn/',
  },
]

const REFS_EN: Reference[] = REFS.map((ref) =>
  ref.title.startsWith('バグ報告のテンプレート') ? { ...ref, title: 'Bug report template (bug_template.yml)' } : ref,
)

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

const REPRO = `OS=http://localhost:9200
N=20000   # must not be a multiple of 7919
IDX=postfilter-range-repro

curl -s -XDELETE "$OS/$IDX"
curl -s -XPUT "$OS/$IDX" -H 'Content-Type: application/json' -d '{
  "settings": { "number_of_shards": 1, "number_of_replicas": 0 },
  "mappings": { "properties": { "value": { "type": "long" }, "grp": { "type": "keyword" } } }
}'

# value = (i * 7919) % N is a permutation of 0..N-1 that is unrelated to doc order.
# Every 10th doc has grp=a, so N/10 docs match the main query.
seq 0 $((N - 1)) | awk -v n="$N" '{
  printf "{\\"index\\":{\\"_id\\":\\"%d\\"}}\\n", $1
  if ($1 % 10 == 0) printf "{\\"value\\":%d,\\"grp\\":\\"a\\"}\\n", ($1 * 7919) % n
  else              printf "{\\"value\\":%d}\\n", ($1 * 7919) % n
}' | curl -s -XPOST "$OS/$IDX/_bulk?refresh=true" -H 'Content-Type: application/x-ndjson' --data-binary @- > /dev/null
curl -s -XPOST "$OS/$IDX/_forcemerge?max_num_segments=1"
curl -s -XPOST "$OS/$IDX/_refresh"

# Every document satisfies value >= 0, so hits.total should be N/10
curl -s -XPOST "$OS/$IDX/_search?filter_path=hits.total" -H 'Content-Type: application/json' -d '{
  "query": { "term": { "grp": "a" } },
  "post_filter": { "range": { "value": { "gte": 0 } } }
}'`

const DIFF = `     @Override
     public Query rewrite(Query original) throws IOException {
-        if (original instanceof ApproximateScoreQuery approximateScoreQuery) {
+        // Only the main query may be approximated: ...
+        if (original instanceof ApproximateScoreQuery approximateScoreQuery && searchContext != null && original == searchContext.query()) {
             approximateScoreQuery.setContext(searchContext);
         }`

export function OssIssue() {
  return (
    <>
      <P>
        2026 年 10 月、検索エンジンの{' '}
        <Strong>
          <A href="https://opensearch.org/">OpenSearch</A>
        </Strong>{' '}
        に Issue を 2 件出しました。1 件はバグ報告、1 件は機能要望です。OpenSearch は GitHub のスターが 1 万を超える大きめの OSS で、Issue
        の書き方にもテンプレートや仕分けの決まりがあります。この記事では主にバグ報告の 1 件について、何をどんな順番で調べ、どう書き、出したあと何が起きたかを、心構えと一緒にまとめます。
      </P>

      <NoteSection step={1} id="why" title="なぜ出したか">
        <P>
          仕事で検索まわりを触っていると、OpenSearch の挙動をコードまで追う場面がよくあります。追った結果「これは自分の使い方の問題ではなく、OpenSearch 側の問題だ」と言えるところまで来たら、Issue
          にして共有した方が、同じところで困る人が減ります。
        </P>
        <P>
          とはいえ、知らない人たちが毎日たくさんの Issue をさばいている場所に書き込むのは、少し身構えます。なので「相手の時間をできるだけ使わせない Issue」を目標に、調べたことを全部まとめてから出しました。
        </P>
      </NoteSection>

      <NoteSection step={2} id="bug" title="出した Issue">
        <P>
          バグ報告は、OpenSearch 3.x の検索の最適化（range クエリの近似）が、本来かかってはいけない場所にもかかってしまい、条件に合うドキュメントがエラーもなく黙って結果から落ちる、というものです<Cite n={1} />
          。この記事では中身より「どう出したか」に絞るので、詳しくは Issue の本文を見てください。
        </P>
        <LinkPreview
          url="https://github.com/opensearch-project/OpenSearch/issues/23303"
          source="GitHub · opensearch-project/OpenSearch #23303"
          title="[BUG] Range query approximation is applied to post_filter, rescore_query, named queries and inner_hits, silently dropping matches"
        />
      </NoteSection>

      <NoteSection step={3} id="flow" title="出すまでの流れ">
        <P>
          気づいてから出すまでに、8 つのことをしました。順番は前後しますが、どれも「メンテナーが読んで、すぐ動ける」ためのものです。
        </P>
        <IssueFlow />
        <P>
          中でも時間をかけたのが<Strong>再現を小さくする</Strong>ことです。最初に気づいたときの状況には、関係のない設定やデータがたくさん混ざっています。それを 1 つずつ外し、curl だけで動く、1
          ノード・1 シャードのスクリプトにしました。件数 <C>N</C> を変えるだけで規模を変えられるので、「ドキュメントが多いときだけ起きる」といった条件も確かめられます。
        </P>
        <Figure kind="code" n={1} caption="Issue に載せた再現スクリプト。正しければ hits.total は 2,000 だが、3.1.0 以降では 1,024 になる。">
          <CodeBlock title="bash" code={REPRO} />
        </Figure>
        <P>
          もう 1 つは<Strong>いつから壊れたか</Strong>です。公式の Docker イメージならバージョンを指定してすぐ起動できるので、同じスクリプトを 2.19.5・3.0.0・3.1.0・3.9.0 で流し、結果を表にしました。2.19.5
          は正しく、3.0.0 は大きなセグメントでだけ、3.1.0 以降は常に壊れている、という段差が見えたことで、原因になった変更をかなり絞り込めました。
        </P>
      </NoteSection>

      <NoteSection step={4} id="anatomy" title="Issue の組み立て">
        <P>
          OpenSearch には Issue のテンプレートがあり、バグ報告なら「症状・関係するコンポーネント・再現手順・期待する動作・環境」の順に書く欄が用意されています<Cite n={5} />
          。この順番は、メンテナーが知りたい順番そのものです。バグ報告では、そのあとにテンプレートにない「原因」と「修正案」を足しました。
        </P>
        <Figure kind="image" n={1} caption="OpenSearch のバグ報告のテンプレート。タイトルは「[BUG] <title>」から始まり、必須の欄（*）が順に並ぶ。bug と untriaged のラベルは最初から付いている。">
          <Shot src="/notes/oss-issue/bug-template.png" alt="GitHub の New issue 画面に表示された OpenSearch のバグ報告テンプレート" width={2702} height={1740} />
        </Figure>
        <IssueAnatomy which="bug" />
        <P>
          修正案は、近似を有効にする処理を「本命のクエリのときだけ」に絞る 1 行の条件です。ただし、これは参照が同じかどうかで本命のクエリを見分けるので、誰かが本命のクエリを包み直すと近似が効かなくなる、という弱点があります。結果が間違うことはなく遅くなるだけ、という点も含めて本文に書き、別の直し方の案も添えました。
        </P>
        <Figure kind="code" n={2} caption="Issue に載せた修正案の差分（コメントは省略）。">
          <CodeBlock title="ContextIndexSearcher.java" code={DIFF} />
        </Figure>
        <P>
          テストも手元で回しました。修正前に落ちて修正後に通る新しいテストを足し、関係する既存のテストが通ることを確かめて、その一覧を書いています。修正案が「たぶん直る」ではなく「こう確かめた」になると、受け取る側の安心感がまったく違うはずです。
        </P>
      </NoteSection>

      <NoteSection step={5} id="after" title="出したあと">
        <P>出したあとの流れは、思っていたよりずっと機械的で、そして速いものでした。</P>
        <IssueTimeline />
        <P>
          出した直後に、テンプレートと自動処理でラベルが付き、プロジェクトのボードに載りました。<C>untriaged</C> は「まだ誰も仕分けていない」の印で、メンテナーが中身を見て担当の領域を決めると外れます。バグ報告では、約 3
          日後に検索まわりのトリアージで外れ、レビュー担当が指名されました。
        </P>
        <Figure kind="image" n={2} caption="出した Issue #23303。右側にラベル（Search:Performance・bug）とプロジェクトのボード（Search Project Board）、タイトルの下に結びついた PR #23304 が出ている。">
          <Shot src="/notes/oss-issue/issue-23303.png" alt="GitHub 上の Issue #23303 の画面" width={2560} height={1800} />
        </Figure>
        <P>
          意外だったのは、<Strong>約 5 時間後に別の人が修正 PR を出した</Strong>ことです<Cite n={2} />。中身は Issue に書いた修正案と同じ条件でした。本文の最後に「よければ自分で PR を出す」と書いていましたが、修正案を具体的に書いておけば、ほかの人がそのまま
          PR にできます。Issue は「報告」であると同時に、誰かが直すための材料でもあるのだと実感しました。
        </P>
        <Figure kind="image" n={3} caption="別の人が出した修正 PR #23304。本文の「Fixes #23303」で Issue と結びつき、右側にはレビュー候補が自動で並んでいる。">
          <Shot src="/notes/oss-issue/pr-23304.png" alt="GitHub 上の PR #23304 の画面" width={2560} height={1800} />
        </Figure>
      </NoteSection>

      <NoteSection step={6} id="feature" title="機能要望も出してみた">
        <P>
          2 件目は機能要望です<Cite n={3} />。近似 k-NN 検索（Faiss エンジン）と <C>post_filter</C> を組み合わせると、同じクエリなのに、無関係なフィールドを更新しただけで結果が変わる、という現象を追っていました。原因は、k
          件を選ぶ処理がセグメントごとに行われることです<Cite n={6} />。
        </P>
        <LinkPreview
          url="https://github.com/opensearch-project/OpenSearch/issues/23429"
          source="GitHub · opensearch-project/OpenSearch #23429"
          title="[Feature Request] Expose which Lucene segment each search hit came from (opt-in, for debugging)"
        />
        <P>
          これを確かめるには「どのヒットがどのセグメントから来たか」が分かればよいのですが、それを返す API はありません。ソートの値とセグメント一覧を突き合わせる回避策は使えたものの、前提が多く壊れやすい。そこで、
          <C>version</C> などと同じ形のオプトインのフラグで、ヒットごとのセグメントを返せるようにしてほしい、という提案にしました。
        </P>
        <P>
          バグ報告との違いは、<Strong>「正しい動作」が決まっていない</Strong>ことです。なので、困っている問題を再現できる形で示し、ほしい形を具体的な JSON で見せ、すでにある機能（<C>_cat/segments</C>
          や Profile API など）ではなぜ足りないかを 1 つずつ書きました。機能要望は「それなら〇〇で足りるのでは」と返されやすいので、代わりの案を先に調べて潰しておくのが大事だと考えました。こちらはまだトリアージ待ちです。
        </P>
        <IssueAnatomy which="feature" />
      </NoteSection>

      <NoteSection step={7} id="mindset" title="心構え">
        <P>2 件出してみて、大きめの OSS に Issue を出すときに大事だと思ったことをまとめます。</P>
        <Callout title="相手は忙しい他人。読む時間を最小にする">
          タイトルで「何が・どこで・どうなるか」、最初の数行で「誰に関係があるか」が分かるように書く。再現はコピーして貼れば動く形にする。長い補足は折りたたむ。
        </Callout>
        <Callout title="バグかどうかを決めるのは相手">
          「これはバグです」と言い切るより、「期待する動作」と、その根拠（以前のバージョンではこう動いていた、など）を示す。仕様かバグかの判断材料を渡すのが報告する側の役目。
        </Callout>
        <Callout title="主張より証拠">
          バージョンごとの結果の表、コードへのリンク、テストの結果。「たぶん」を減らすほど、相手が確かめ直す手間が減る。コードへのリンクは、あとで行がずれないようにバージョンのタグで固定する。
        </Callout>
        <Callout title="案は出す。押し付けない">
          修正案や提案は「案」として出し、弱点や別案も自分から書く。決めるのはメンテナー。自分で PR を出す気があるなら、そう書いておく。
        </Callout>
        <Callout title="作法に乗る">
          テンプレートの順に書く。同じ Issue がないか探し、探したことを書く。ラベルや担当の割り当ては相手に任せる。CONTRIBUTING.md には一度目を通しておく<Cite n={4} />。
        </Callout>
        <Callout title="出したら待つ">
          仕分け（トリアージ）には日にちがかかる。今回は 3 日ほどだった。返事がなくても催促はせず、新しく分かったことがあればコメントで足す。
        </Callout>
      </NoteSection>

      <Summary
        label="まとめ"
        items={[
          '再現を小さくし、いつから壊れたかを調べると、Issue の説得力が一気に上がる。',
          'テンプレートの順はメンテナーが読みたい順。原因や修正案は、その後ろに足す。',
          '修正案を具体的に書くと、自分以外の人もすぐ直しに動ける。',
          '機能要望は、困っていることの再現と、既存の機能では足りない理由が要る。',
        ]}
      />

      <NoteSection step={8} id="references" title="リンク">
        <P>
          出した Issue と関連する PR、OpenSearch の資料です。Issue の本文は <A href="https://github.com/opensearch-project/OpenSearch/issues/23303">#23303</A> で全文を読めます。
        </P>
        <References items={REFS} />
      </NoteSection>
    </>
  )
}

export function OssIssueEn() {
  return (
    <>
      <P>
        In October 2026 I filed two issues to the search engine{' '}
        <Strong>
          <A href="https://opensearch.org/">OpenSearch</A>
        </Strong>
        : one bug report and one feature request. OpenSearch is a fairly large OSS project with
        more than 10,000 stars on GitHub, and it has templates and triage rules for how issues are written. This note focuses on the bug report: what I investigated and in what
        order, how I wrote it, and what happened after I filed it, along with the mindset behind it.
      </P>

      <NoteSection step={1} id="why" title="Why I filed them">
        <P>
          Working on search at my job, I often end up tracing OpenSearch&rsquo;s behavior down into its code. Once I can say &ldquo;this is not how I&rsquo;m using it, this is a
          problem in OpenSearch,&rdquo; turning it into an issue means fewer people get stuck in the same place.
        </P>
        <P>
          Still, writing into a place where strangers handle lots of issues every day makes me a little tense. So I aimed for &ldquo;an issue that takes as little of their time as
          possible,&rdquo; and put together everything I had found before filing.
        </P>
      </NoteSection>

      <NoteSection step={2} id="bug" title="The issue I filed">
        <P>
          The bug report is about a search optimization in OpenSearch 3.x (approximation of range queries) that was also being applied where it should not be, so matching documents
          silently dropped out of the results with no error <Cite n={1} />. This note is about how I filed it rather than the bug itself, so see the issue for the details.
        </P>
        <LinkPreview
          url="https://github.com/opensearch-project/OpenSearch/issues/23303"
          source="GitHub · opensearch-project/OpenSearch #23303"
          title="[BUG] Range query approximation is applied to post_filter, rescore_query, named queries and inner_hits, silently dropping matches"
        />
      </NoteSection>

      <NoteSection step={3} id="flow" title="Before filing">
        <P>
          Between noticing the problem and filing it, I did eight things. The order shifted a bit, but each one was meant to let a maintainer read it and act right away.
        </P>
        <IssueFlow />
        <P>
          The part that took the most time was <Strong>shrinking the reproduction</Strong>. The situation where I first noticed it had lots of unrelated settings and data mixed in. I
          removed them one by one until it was a script that runs with curl alone, on one node and one shard. Changing the document count <C>N</C> changes the scale, so I could also
          check conditions like &ldquo;it only happens with many documents.&rdquo;
        </P>
        <Figure kind="code" n={1} caption="The reproduction script from the issue. hits.total should be 2,000, but it is 1,024 on 3.1.0 and later.">
          <CodeBlock title="bash" code={REPRO} />
        </Figure>
        <P>
          The other was <Strong>finding when it broke</Strong>. The official Docker images start any version you ask for, so I ran the same script on 2.19.5, 3.0.0, 3.1.0 and 3.9.0
          and put the results in a table. 2.19.5 was correct, 3.0.0 broke only on large segments, and 3.1.0 and later always broke. That step pattern narrowed down the change that
          caused it a lot.
        </P>
      </NoteSection>

      <NoteSection step={4} id="anatomy" title="How the issue is structured">
        <P>
          OpenSearch has issue templates. For a bug report, the fields are laid out in this order: what happens, the related component, how to reproduce, expected behavior, and
          environment <Cite n={5} />. That order is exactly the order in which a maintainer wants to know things. In the bug report, I added two sections the template does not have:
          the cause and a possible fix.
        </P>
        <Figure kind="image" n={1} caption="OpenSearch&rsquo;s bug report template. The title starts with &ldquo;[BUG] <title>&rdquo;, required fields (*) come in order, and the bug and untriaged labels are already attached.">
          <Shot src="/notes/oss-issue/bug-template.png" alt="OpenSearch bug report template on GitHub's New issue page" width={2702} height={1740} />
        </Figure>
        <IssueAnatomy which="bug" />
        <P>
          The fix is a one-line condition that limits approximation to the main query. It has a weak spot, though: it recognizes the main query by reference equality, so if something
          wraps the main query, approximation silently stops applying. I wrote that down, including that results stay correct and only performance suffers, and added an alternative
          approach.
        </P>
        <Figure kind="code" n={2} caption="The diff proposed in the issue (comment omitted).">
          <CodeBlock title="ContextIndexSearcher.java" code={DIFF} />
        </Figure>
        <P>
          I also ran the tests locally: I added a new test that fails before the fix and passes after it, confirmed the related existing tests still pass, and listed them. A fix that
          says &ldquo;here is how I checked it&rdquo; instead of &ldquo;this probably works&rdquo; should make a big difference to the person receiving it.
        </P>
      </NoteSection>

      <NoteSection step={5} id="after" title="After filing">
        <P>What happened after filing was far more mechanical, and faster, than I expected.</P>
        <IssueTimeline />
        <P>
          Right after filing, the template and automation added labels and put the issue on a project board. <C>untriaged</C> means no one has sorted it yet; it comes off once a
          maintainer reads it and assigns an area. For the bug report, it came off about three days later in search triage, and reviewers were named.
        </P>
        <Figure kind="image" n={2} caption="Issue #23303 as filed. On the right are the labels (Search:Performance, bug) and the project board (Search Project Board); under the title is the linked PR #23304.">
          <Shot src="/notes/oss-issue/issue-23303.png" alt="Issue #23303 on GitHub" width={2560} height={1800} />
        </Figure>
        <P>
          The surprise was that <Strong>someone else opened a fix PR about five hours later</Strong> <Cite n={2} />. It used the same condition as the fix in the issue. I had written
          at the end that I was happy to open a PR myself, but when the fix is written out concretely, anyone can turn it into a PR. It made me realize that an issue is not only a
          report but also material for whoever fixes it.
        </P>
        <Figure kind="image" n={3} caption="The fix PR #23304 opened by someone else. &ldquo;Fixes #23303&rdquo; in its description links it to the issue, and suggested reviewers are listed automatically on the right.">
          <Shot src="/notes/oss-issue/pr-23304.png" alt="PR #23304 on GitHub" width={2560} height={1800} />
        </Figure>
      </NoteSection>

      <NoteSection step={6} id="feature" title="A feature request, too">
        <P>
          The second issue is a feature request <Cite n={3} />. I was chasing a behavior where combining approximate k-NN search (Faiss engine) with <C>post_filter</C> gives different
          results for the same query just because an unrelated field was updated. The cause is that the step that picks k results runs per segment <Cite n={6} />.
        </P>
        <LinkPreview
          url="https://github.com/opensearch-project/OpenSearch/issues/23429"
          source="GitHub · opensearch-project/OpenSearch #23429"
          title="[Feature Request] Expose which Lucene segment each search hit came from (opt-in, for debugging)"
        />
        <P>
          To confirm it, you need to know which segment each hit came from, but no API returns that. A workaround that matches sort values against the segment list worked, but it
          relies on many assumptions and breaks easily. So I proposed an opt-in flag, shaped like <C>version</C> and similar options, that returns the segment of each hit.
        </P>
        <P>
          The difference from a bug report is that <Strong>there is no agreed &ldquo;correct behavior.&rdquo;</Strong> So I showed the problem in a reproducible form, showed the
          shape I wanted as concrete JSON, and went through why existing features (<C>_cat/segments</C>, the Profile API and so on) are not enough. Feature requests tend to get
          &ldquo;can&rsquo;t you just use X?&rdquo; as a reply, so I thought it was important to check the alternatives first. This one is still waiting for triage.
        </P>
        <IssueAnatomy which="feature" />
      </NoteSection>

      <NoteSection step={7} id="mindset" title="Mindset">
        <P>After filing two issues, here is what I think matters when filing an issue to a large OSS project.</P>
        <Callout title="They are busy strangers. Minimize the time it takes to read">
          Make the title say what happens, where, and how, and make the first few lines say who it affects. Make the reproduction copy-and-paste runnable. Fold long details away.
        </Callout>
        <Callout title="Whether it is a bug is their call">
          Rather than declaring &ldquo;this is a bug,&rdquo; show the expected behavior and the basis for it (for example, how an earlier version behaved). The reporter&rsquo;s job is
          to hand over what they need to decide whether it is a bug or by design.
        </Callout>
        <Callout title="Evidence over claims">
          Tables of results per version, links to the code, test results. The fewer &ldquo;probably&rdquo;s, the less they have to re-check. Pin code links to a version tag so the
          lines do not shift later.
        </Callout>
        <Callout title="Offer ideas. Don&rsquo;t push them">
          Present fixes and proposals as proposals, and mention their weak spots and alternatives yourself. The maintainers decide. If you are willing to open a PR, say so.
        </Callout>
        <Callout title="Follow the conventions">
          Write in the template&rsquo;s order. Search for existing issues, and say that you did. Leave labels and assignment to them. Read CONTRIBUTING.md once <Cite n={4} />.
        </Callout>
        <Callout title="Then wait">
          Triage takes days; this time it took about three. Don&rsquo;t chase them if there is no reply; if you learn something new, add it as a comment.
        </Callout>
      </NoteSection>

      <Summary
        label="Summary"
        items={[
          'Shrinking the reproduction and finding when it broke make an issue far more convincing.',
          'The template order is the order maintainers want to read in. Add the cause and fix after it.',
          'A concrete fix lets people other than you start fixing right away.',
          'A feature request needs a reproduction of the problem and the reason existing features are not enough.',
        ]}
      />

      <NoteSection step={8} id="references" title="Links">
        <P>
          The issues I filed, the related PR, and OpenSearch documents. The full text of the bug report is at <A href="https://github.com/opensearch-project/OpenSearch/issues/23303">#23303</A>.
        </P>
        <References items={REFS_EN} />
      </NoteSection>
    </>
  )
}

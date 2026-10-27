import { A, C, Callout, Cite, CodeBlock, Figure, Li, NoteSection, P, References, Shot, Strong, type Reference } from '@/components/notes/Prose'
import { IssueFlow } from '@/components/notes/oss/IssueFlow'
import { IssueAnatomy } from '@/components/notes/oss/IssueAnatomy'
import { IssueTimeline } from '@/components/notes/oss/IssueTimeline'

export const toc = [
  { id: 'why', title: 'なぜ出したか' },
  { id: 'bug', title: '出した Issue' },
  { id: 'flow', title: '出すまでの流れ' },
  { id: 'anatomy', title: 'Issue の組み立て' },
  { id: 'after', title: '出したあと' },
  { id: 'feature', title: '機能要望も出してみた' },
  { id: 'mindset', title: '心構え' },
  { id: 'references', title: 'リンク' },
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
        2026 年 10 月、検索エンジンの <Strong>OpenSearch</Strong> に Issue を 2 件出しました。1 件はバグ報告、1 件は機能要望です。OpenSearch は GitHub のスターが 1 万を超える大きめの OSS で、Issue
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
      </NoteSection>

      <NoteSection step={3} id="flow" title="出すまでの流れ">
        <P>
          気づいてから出すまでに、8 つのことをしました。順番は前後しますが、どれも「メンテナーが読んで、すぐ動ける」ためのものです。
        </P>
        <Figure kind="animation" n={1} caption="出すまでにやったこと。アイコンを押すとその段階に飛ぶ。「なぜ」はそれをやった理由。">
          <IssueFlow />
        </Figure>
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
        <Figure kind="animation" n={2} caption="実際に出した 2 つの Issue の節ごとの中身と役割。左の節を押すと右に出る。">
          <IssueAnatomy />
        </Figure>
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
        <Figure kind="animation" n={3} caption="2 つの Issue に起きたこと（日本時間）。点を押すとその出来事に飛ぶ。">
          <IssueTimeline />
        </Figure>
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
        <P>
          これを確かめるには「どのヒットがどのセグメントから来たか」が分かればよいのですが、それを返す API はありません。ソートの値とセグメント一覧を突き合わせる回避策は使えたものの、前提が多く壊れやすい。そこで、
          <C>version</C> などと同じ形のオプトインのフラグで、ヒットごとのセグメントを返せるようにしてほしい、という提案にしました。
        </P>
        <P>
          バグ報告との違いは、<Strong>「正しい動作」が決まっていない</Strong>ことです。なので、困っている問題を再現できる形で示し、ほしい形を具体的な JSON で見せ、すでにある機能（<C>_cat/segments</C>
          や Profile API など）ではなぜ足りないかを 1 つずつ書きました。機能要望は「それなら〇〇で足りるのでは」と返されやすいので、代わりの案を先に調べて潰しておくのが大事だと考えました。こちらはまだトリアージ待ちです。
        </P>
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

      <section className="mx-auto mt-6 w-full max-w-[720px] rounded-[10px] bg-slab p-6 text-slab-fg sm:p-8">
        <span className="text-[10.5px] font-bold uppercase tracking-[.08em] text-slab-fg/55">まとめ</span>
        <ul className="mt-3 flex flex-col gap-3 text-[15px] font-semibold leading-[1.8]">
          <Li>再現を小さくし、いつから壊れたかを調べると、Issue の説得力が一気に上がる。</Li>
          <Li>テンプレートの順はメンテナーが読みたい順。原因や修正案は、その後ろに足す。</Li>
          <Li>修正案を具体的に書くと、自分以外の人もすぐ直しに動ける。</Li>
          <Li>機能要望は、困っていることの再現と、既存の機能では足りない理由が要る。</Li>
        </ul>
      </section>

      <NoteSection step={8} id="references" title="リンク">
        <P>
          出した Issue と関連する PR、OpenSearch の資料です。Issue の本文は <A href="https://github.com/opensearch-project/OpenSearch/issues/23303">#23303</A> で全文を読めます。
        </P>
        <References items={REFS} />
      </NoteSection>
    </>
  )
}

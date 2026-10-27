import { A, C, Callout, Cite, CodeBlock, Figure, Li, NoteSection, P, References, Strong, type Reference } from '@/components/notes/Prose'
import { BruteVsHnsw } from '@/components/notes/hnsw/BruteVsHnsw'
import { GreedyWalk } from '@/components/notes/hnsw/GreedyWalk'
import { LayerSearch } from '@/components/notes/hnsw/LayerSearch'
import { LevelDice } from '@/components/notes/hnsw/LevelDice'
import { InsertNode } from '@/components/notes/hnsw/InsertNode'
import { EfTradeoff } from '@/components/notes/hnsw/EfTradeoff'

export const toc = [
  { id: 'why', title: 'なぜ調べたか' },
  { id: 'problem', title: '近いベクトルを探すのは重い' },
  { id: 'greedy', title: 'グラフをたどって近づく' },
  { id: 'layers', title: '層を重ねて、遠くから一気に近づく' },
  { id: 'levels', title: 'どの層まで載るかは確率で決まる' },
  { id: 'insert', title: '点の入れ方' },
  { id: 'params', title: '3 つのパラメータ' },
  { id: 'use', title: '実際に使うとき' },
  { id: 'caveats', title: '弱いところ' },
  { id: 'references', title: '参考文献' },
]

const PARAMS = [
  { name: 'M', when: '作るとき', what: '1 つの点が持つつながりの数（最下層は 2M）', up: '精度が上がる。メモリと作る時間が増える' },
  { name: 'efConstruction', when: '作るとき', what: '点を入れるときに集める候補の数', up: 'グラフの質が上がる。作る時間が増える' },
  { name: 'efSearch', when: '探すとき', what: '最下層で持っておく候補の数（k 以上）', up: '精度が上がる。探す時間が増える' },
]

const REFS: Reference[] = [
  {
    authors: 'Yu. A. Malkov, D. A. Yashunin',
    title: 'Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs',
    source: 'IEEE Transactions on Pattern Analysis and Machine Intelligence, 42(4), 2020（arXiv 2016）',
    url: 'https://arxiv.org/abs/1603.09320',
    extra: { label: 'doi:10.1109/TPAMI.2018.2889473', url: 'https://doi.org/10.1109/TPAMI.2018.2889473' },
  },
  {
    authors: 'Y. Malkov, A. Ponomarenko, A. Logvinov, V. Krylov',
    title: 'Approximate nearest neighbor algorithm based on navigable small world graphs',
    source: 'Information Systems, 45, 2014',
    url: 'https://doi.org/10.1016/j.is.2013.10.006',
  },
  { authors: 'Meta', title: 'Faiss indexes', source: 'Faiss Wiki（GitHub）', url: 'https://github.com/facebookresearch/faiss/wiki/Faiss-indexes' },
  { authors: 'nmslib', title: 'HNSW algorithm parameters', source: 'hnswlib（GitHub）', url: 'https://github.com/nmslib/hnswlib/blob/master/ALGO_PARAMS.md' },
  {
    authors: 'Apache Lucene',
    title: 'Lucene99HnswVectorsFormat',
    source: 'Lucene 9.12 API ドキュメント',
    url: 'https://lucene.apache.org/core/9_12_0/core/org/apache/lucene/codecs/lucene99/Lucene99HnswVectorsFormat.html',
  },
  { authors: 'OpenSearch', title: 'Methods and engines', source: 'OpenSearch Documentation', url: 'https://docs.opensearch.org/latest/mappings/supported-field-types/knn-methods-engines/' },
  { authors: '水野航太', title: 'GIF で見る、Faiss と Lucene のベクトル検索', source: 'Zenn, 2026', url: 'https://zenn.dev/kotap/articles/faiss-lucene-ann-gif' },
  { authors: 'W. Pugh', title: 'Skip lists: a probabilistic alternative to balanced trees', source: 'Communications of the ACM, 33(6), 1990', url: 'https://doi.org/10.1145/78973.78977' },
]

const FAISS = `import faiss

d = 768                                  # ベクトルの次元
index = faiss.IndexHNSWFlat(d, 32)       # M = 32
index.hnsw.efConstruction = 200          # add の前に決める
index.add(xb)                            # xb: (n, d) の float32

index.hnsw.efSearch = 64                 # 探すときに変えられる
D, I = index.search(xq, 10)              # 近い 10 件の距離と番号`

const OPENSEARCH = `PUT my-index
{
  "settings": { "index.knn": true },
  "mappings": {
    "properties": {
      "embedding": {
        "type": "knn_vector",
        "dimension": 768,
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "space_type": "l2",
          "parameters": { "m": 16, "ef_construction": 100 }
        }
      }
    }
  }
}`

export function Hnsw() {
  return (
    <>
      <P>
        <Strong>HNSW（Hierarchical Navigable Small World）は、「近いベクトル」を速く探すためのグラフの作り方と探し方</Strong>
        です。Faiss・Lucene（OpenSearch / Elasticsearch）・pgvector など、多くのベクトル検索の中で使われています。ここでは仕組みを、実際に動かした小さな HNSW の図で追います。
      </P>

      <NoteSection step={1} id="why" title="なぜ調べたか">
        <P>
          <A href="https://zenn.dev/kotap/articles/faiss-lucene-ann-gif">Faiss と Lucene のベクトル検索を比べた記事</A>
          <Cite n={7} />
          を書いたとき、どちらも中身は HNSW でした。M や ef といったパラメータを「上げると精度が上がるらしい」ではなく、仕組みから説明できるようにしたくて整理しました。
        </P>
        <P>
          この記事で扱うのは、グラフの形・探し方・作り方・パラメータまでです。ベクトルを圧縮して軽くする量子化（PQ など）や、クラスタに分けてから探す IVF といった別の方式には触れません。
        </P>
        <Callout title="この記事の図について">
          図はすべて、論文（Malkov & Yashunin）<Cite n={1} /> の手順どおりに書いた小さな HNSW を、このページの中で実際に動かしたものです。見やすさのため点は 2 次元・140 個、M = 4 にしています。実際の埋め込みは数百次元ですが、やっていることは同じです。
        </Callout>
      </NoteSection>

      <NoteSection step={2} id="problem" title="近いベクトルを探すのは重い">
        <P>
          文章や画像を埋め込みモデルに通すと、数百〜数千次元のベクトルになります。意味が近いものほどベクトルどうしの距離が近くなるように学習されているので、「似ているもの」を探すことは、このベクトル空間で
          <Strong>一番近い点を探す</Strong>ことになります。
        </P>
        <P>
          確実なのは全部の点と距離を測ること（総当たり）です。ただ、距離を 1 回測るだけで次元の数だけ掛け算が要ります。100 万個の 768 次元ベクトルなら、1 回の検索でおよそ 7.7 億回の掛け算です。検索のたびにこれを払うのは重すぎます。
        </P>
        <Figure kind="animation" n={1} caption="同じ問題を、総当たりと HNSW で解く。HNSW は一部の点だけを測って、同じ答えにたどり着く。">
          <BruteVsHnsw />
        </Figure>
        <P>
          2 次元や 3 次元なら、空間を箱に区切る木構造（k-d 木など）で速く探せます。しかし次元が高くなると、どの箱にも近い点がありうるので区切りが効かなくなり、結局ほとんど全部を見ることになります（次元の呪い）。
        </P>
        <P>
          そこで「必ず正解する」ことを少しだけ諦めて、測る点を大きく減らすのが<Strong>近似最近傍探索（ANN）</Strong>です。どれだけ正解できたかは、本当の上位 k 件のうち何件を取れたかの割合（
          <Strong>recall@k</Strong>）で測ります。HNSW は、この ANN の中でも速さと recall のバランスが良い方式として広く使われています。
        </P>
      </NoteSection>

      <NoteSection step={3} id="greedy" title="グラフをたどって近づく">
        <P>
          土台になるのは、<Strong>近い点どうしを線でつないだグラフ</Strong>です（NSW と呼ばれる、HNSW の前身）<Cite n={2} />。探すときは、どこかの点から始めて「つながっている点の中で、目的地に一番近い点へ移る」を繰り返します。どの隣に移っても近づかなくなったら終わりです。これを
          <Strong>貪欲探索</Strong>と呼びます。
        </P>
        <P>
          うまくいくかどうかは、グラフの形しだいです。名前の「Small World」は、知り合いを数人たどれば世界の誰にでも届く、という「世間は狭い」性質のこと。近い点とのつながりに加えて、ところどころ遠くへのつながりがあれば、どこからでも少ない手数で目的地の近くまで行けます。NSW では、点が少ないうちに入れた初期の点どうしのつながりが、結果としてこの「遠くへのつながり」になります
          <Cite n={2} />。
        </P>
        <Figure kind="animation" n={2} caption="層を使わず、全部の点が入ったグラフだけを貪欲にたどる。「次へ」で 1 手ずつ進む。">
          <GreedyWalk />
        </Figure>
        <P>
          ただ、この方法には 2 つの弱点があります。1 つは、ほとんどのつながりが近い点どうしなので、<Strong>遠い目的地まで小さな歩幅で何度も移動する</Strong>こと。もう 1 つは、途中で
          <Strong>それ以上近づけない場所（局所解）に止まる</Strong>ことがあることです。Animation 2 でも、本当に一番近い点のすぐそばまで来ているのに、そこへつながる隣を持っていないせいで止まっています。NSW では、入口を変えて何度か探し直すことでこれを和らげていました
          <Cite n={2} />。
        </P>
      </NoteSection>

      <NoteSection step={4} id="layers" title="層を重ねて、遠くから一気に近づく">
        <P>
          HNSW は、このグラフを<Strong>何層も重ねます</Strong>。一番下の層 0 には全部の点。上の層にはその一部だけが載っていて、点が少ないぶん、その中で「近い点」とつないでも 1 本のつながりが遠くまで届きます。地図でいえば、高速道路 → 一般道 → 路地、の順に乗り継ぐイメージです。
        </P>
        <P>
          この発想は、整列したリストに「急行の段」を重ねて探索を速くする<Strong>スキップリスト</Strong>
          <Cite n={8} /> と同じです。HNSW はそれを、順番のない高次元の空間に持ち込んだものといえます<Cite n={1} />。
        </P>
        <Figure kind="animation" n={3} caption="上の層から順に探す。各層で止まった点が、1 つ下の層の入口になる。">
          <LayerSearch />
        </Figure>
        <P>
          探し方は単純です。一番上の層にある入口から始めて、その層で貪欲探索をします。止まった点は下の層にも必ず載っているので、そこを 1 つ下の層の入口にして、また貪欲探索をする。これを層 0 まで繰り返します
          <Cite n={1} />。上の層では「一番近い 1 点」だけを持って進み、最後の層 0 では候補を <C>efSearch</C> 個まで持って広めに探します（7 で詳しく）。
        </P>
        <P>
          上の層は大股で目的地の近くまで運ぶ役、下の層は近くを細かく探す役です。入口がはじめから目的地の近くになるので、細かい層を長く歩かずに済み、局所解にも落ちにくくなります。Animation 2 で行き詰まったのと同じ点を、今度は正しく見つけられています。
        </P>
      </NoteSection>

      <NoteSection step={5} id="levels" title="どの層まで載るかは確率で決まる">
        <P>
          どの点を上の層に載せるかは、データの中身では決めず、点を入れるときに<Strong>乱数で決めます</Strong>。式にすると <C>floor(-ln(U) × mL)</C>（U は 0〜1 の乱数、mL = 1 / ln(M)）。こうすると、1 つ上の層に載る確率がちょうど 1/M になります
          <Cite n={1} />。M = 16 なら、層 1 に載るのは 16 点に 1 点、層 2 は 256 点に 1 点です。
        </P>
        <Figure kind="animation" n={4} caption="1 万個の点の層を実際に振ってみる。M を変えると、上の層への減り方が変わる。">
          <LevelDice />
        </Figure>
        <P>
          層が上がるごとに点が 1/M に減るので、層の数はおよそ <C>log_M N</C> 段にしかなりません。M = 16 で 100 万点なら <C>log_16(1,000,000) ≈ 5</C> なので、層は 6 段ほどです。各層で数歩ずつ進むとすると、全体の手数もおよそ
          <C>log N</C> に比例します。点が 10 倍になっても、手数は少し増えるだけです<Cite n={1} />。
        </P>
        <P>
          乱数で決めるのは手抜きではありません。上の層の点がデータ全体にまんべんなく散らばるので、どの方向の目的地にも大股で近づけます。データを順番に入れても、偏った順番で入れても、層の作りが崩れにくいという利点もあります。
        </P>
      </NoteSection>

      <NoteSection step={6} id="insert" title="点の入れ方">
        <P>
          グラフは、点を 1 つずつ入れながら育てます。入れ方は探し方とほぼ同じで、<Strong>新しい点そのものを探しに行き、見つかった近い点とつなぐ</Strong>だけです。手順は 2 段に分かれます
          <Cite n={1} />。
        </P>
        <P>
          まず、新しい点が載る層を乱数で決めます。それより上の層では、探索と同じく貪欲に降りてくるだけで、つながりは作りません。自分が載る層まで来たら、そこから層 0 までの各層で、近い候補を <C>efConstruction</C> 個まで集め、その中から M
          個を選んで両方向につなぎます。相手のつながりが上限（上の層は M 本、層 0 は 2M 本）を超えたら、相手の側で一番遠いつながりを切って上限に収めます。
        </P>
        <Figure kind="animation" n={5} caption="140 点のグラフに 1 点を入れる。層 1 と層 0 で、近い候補を集めてつなぎ、つながりすぎた相手は遠い線を切る。">
          <InsertNode />
        </Figure>
        <P>
          つながりを両方向にするのは、あとから入った点からも、先に入っていた点からもたどれるようにするためです。片方向だと、新しい点は「誰からも来られない行き止まり」になりかねません。また、点をあとから足せる仕組みなので、データが少しずつ増える用途にもそのまま使えます。
        </P>
        <Callout title="論文では「近い順」ではなく「散らばるように」選ぶ">
          この図では近い順に M 個を選んでいます。論文にはもう 1 つ、候補を近い順に見ていき、<Strong>すでに選んだどの点よりも新しい点に近いときだけ選ぶ</Strong>
          というやり方（ヒューリスティック）があります<Cite n={1} />。同じ方向にある候補ばかりが選ばれるのを防ぐので、点が固まっている場所でも、離れた固まりへの道が残りやすくなります。
        </Callout>
      </NoteSection>

      <NoteSection step={7} id="params" title="3 つのパラメータ">
        <P>
          ここまでで、HNSW のパラメータがそれぞれ何を決めているかが見えてきます<Cite n={[1, 4]} />。
        </P>
        <Figure kind="table" n={1} caption="HNSW の主なパラメータ。名前は実装によって少し違う（Lucene では M を maxConn、efConstruction を beamWidth と呼ぶ）。">
          <div className="flex w-full flex-col divide-y divide-ink/10 overflow-hidden rounded-[10px] border border-ink/10">
            {PARAMS.map((p) => (
              <div key={p.name} className="grid gap-1 px-4 py-3 sm:grid-cols-[130px_minmax(0,1fr)_minmax(0,1fr)] sm:gap-4">
                <span className="flex flex-col">
                  <code className="font-mono text-[13px] font-bold">{p.name}</code>
                  <span className="text-[11px] text-mute">{p.when}</span>
                </span>
                <span className="text-[13px] leading-[1.7]">{p.what}</span>
                <span className="text-[13px] leading-[1.7] text-mute">上げると: {p.up}</span>
              </div>
            ))}
          </div>
        </Figure>
        <P>
          <Strong>M</Strong> はグラフの「道の多さ」です。多いほど遠回りせずに済み、局所解にも落ちにくくなりますが、点ごとに持つつながりが増えてメモリと作る時間が増えます。hnswlib のドキュメントでは、ほとんどの用途は M = 12〜48 で足り、埋め込みのように次元が高く高い recall が要るデータでは 48〜64 くらいまで上げる、とされています
          <Cite n={4} />。
        </P>
        <P>
          <Strong>efConstruction</Strong> は、点を入れるときにどれだけ広く候補を探すかです。大きいほど「本当に近い点」とつながった質の良いグラフになりますが、作る時間が延びます。ある程度より上げても質は良くならないので、目安として、作ったあとに efSearch = efConstruction で M 件を探した recall が 0.9 を下回るなら、まだ上げる余地がある、という確かめ方が紹介されています
          <Cite n={4} />。
        </P>
        <P>
          この 2 つはグラフを作るときに決まり、あとから変えるには作り直しが要ります。一方、<Strong>efSearch だけは検索のたびに変えられます</Strong>。層 0 で持っておく候補の数で、返したい件数 k 以上にする必要があります
          <Cite n={4} />。精度と速さの調整は、まずここで行います。
        </P>
        <Figure kind="animation" n={6} caption="efSearch を動かすと、精度（recall）と計算量がどう変わるか。16 次元・3,000 点で実際に測った値。">
          <EfTradeoff />
        </Figure>
        <P>
          Animation 6 のとおり、efSearch は小さいところで少し上げるだけで recall が大きく上がり、100% に近づくほど同じ伸びに多くの計算が要るようになります。「どこまで精度を取りに行くか」を、検索の用途ごとに決めるのがチューニングの中心です。
        </P>
      </NoteSection>

      <NoteSection step={8} id="use" title="実際に使うとき">
        <P>
          Faiss では、M を作るときに渡し、efConstruction と efSearch は属性で設定します<Cite n={3} />。efConstruction はグラフを作る <C>add</C> の前に決めておく必要があり、efSearch は検索の前ならいつでも変えられます。
        </P>
        <Figure kind="code" n={1} caption="Faiss（Python）で HNSW のインデックスを作って検索する。">
          <CodeBlock title="python" code={FAISS} />
        </Figure>
        <P>
          OpenSearch では、ベクトルのフィールドを定義するときにパラメータを書きます<Cite n={6} />。距離の測り方（<C>space_type</C>）もここで決めます。efSearch にあたる値は、インデックスの設定や検索のリクエストで指定します。なお、OpenSearch や Elasticsearch の中で使われている Lucene では、M を maxConn、efConstruction を beamWidth と呼びます
          <Cite n={5} />。
        </P>
        <Figure kind="code" n={2} caption="OpenSearch の k-NN フィールドを HNSW（Lucene エンジン）で定義する。">
          <CodeBlock title="OpenSearch" code={OPENSEARCH} />
        </Figure>
        <P>
          どの実装でも、まずは既定値で作り、実際のクエリで recall と応答時間を測りながら efSearch を動かす、という順番が手堅いです。それでも recall が足りないときに、M や efConstruction を上げて作り直します。
        </P>
      </NoteSection>

      <NoteSection step={9} id="caveats" title="弱いところ">
        <P>HNSW は速くて扱いやすい一方で、グラフを持つ方式ならではの弱点もあります。</P>
        <Callout tone="warn" title="メモリをたくさん使う">
          ベクトル本体に加えて、点ごとに最下層だけで最大 2M 本のつながりを持ちます。hnswlib の目安では、つながりのぶんだけで 1 点あたり M × 8〜10 バイトほどです<Cite n={4} />。M = 16 で 1,000
          万点なら、ベクトルとは別に 1.3〜1.6 GB ほどになります。基本的にグラフ全体をメモリに載せて使うので、データ量に応じたメモリの見積もりが欠かせません。
        </Callout>
        <Callout tone="warn" title="消すのが苦手">
          点を抜くと、その点を通っていた道が途切れます。多くの実装は「消した印」を付けて探索では飛ばし、まとめて作り直すときに本当に消します（Faiss の IndexHNSW は削除そのものに対応していません）。更新や削除が多いデータでは、定期的な作り直しを前提にした運用になります。
        </Callout>
        <Callout tone="warn" title="絞り込みと組み合わせると精度が落ちやすい">
          「カテゴリが A のものだけ」のように条件で絞ると、たどれる点が減って道が途切れやすくなります。探してから絞ると件数が足りなくなり、絞ってから探すとグラフがつながらなくなる、という板挟みです。検索エンジン側で、条件が厳しいときは総当たりに切り替えるなどの工夫がされています。
        </Callout>
        <Callout tone="warn" title="100% 正解するわけではない">
          近似なので、本当の上位 k 件を取りこぼすことがあります。精度が大事な場面では、efSearch を上げるか、候補を多めに取ってから正確な距離で並べ直します。recall はデータによって変わるので、自分のデータで測るのが確実です。
        </Callout>
      </NoteSection>

      <section className="mx-auto mt-6 w-full max-w-[720px] rounded-[10px] bg-slab p-6 text-slab-fg sm:p-8">
        <span className="text-[10.5px] font-bold uppercase tracking-[.08em] text-slab-fg/55">まとめ</span>
        <ul className="mt-3 flex flex-col gap-3 text-[15px] font-semibold leading-[1.8]">
          <Li>近い点どうしをつないだグラフを、目的地に近づく方へ貪欲にたどる。</Li>
          <Li>グラフを層に重ね、上の層で大きく近づいてから下の層で細かく探す。</Li>
          <Li>上の層に載る確率は 1/M。だから層の数も手数も log N 程度で済む。</Li>
          <Li>M と efConstruction は作るとき、efSearch は探すときの「精度と速さ」の調整つまみ。</Li>
        </ul>
      </section>

      <NoteSection step={10} id="references" title="参考文献">
        <References items={REFS} />
      </NoteSection>
    </>
  )
}

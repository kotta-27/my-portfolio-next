import { A, C, Callout, Cite, CodeBlock, Figure, Li, NoteSection, P, References, Strong, type Reference } from '@/components/notes/Prose'
import { BruteVsHnsw } from '@/components/notes/hnsw/BruteVsHnsw'
import { GreedyWalk } from '@/components/notes/hnsw/GreedyWalk'
import { LayerSearch } from '@/components/notes/hnsw/LayerSearch'
import { LevelDice } from '@/components/notes/hnsw/LevelDice'
import { InsertNode } from '@/components/notes/hnsw/InsertNode'
import { EfTradeoff } from '@/components/notes/hnsw/EfTradeoff'

export const toc = [
  { id: 'why', title: { ja: 'なぜ調べたか', en: 'Why I looked into it' } },
  { id: 'problem', title: { ja: '近いベクトルを探すのは重い', en: 'Finding nearby vectors is expensive' } },
  { id: 'greedy', title: { ja: 'グラフをたどって近づく', en: 'Walking a graph toward the target' } },
  { id: 'layers', title: { ja: '層を重ねて、遠くから一気に近づく', en: 'Stacking layers to close in from far away' } },
  { id: 'levels', title: { ja: 'どの層まで載るかは確率で決まる', en: 'How high a point goes is decided by chance' } },
  { id: 'insert', title: { ja: '点の入れ方', en: 'Inserting a point' } },
  { id: 'params', title: { ja: '3 つのパラメータ', en: 'The three parameters' } },
  { id: 'use', title: { ja: '実際に使うとき', en: 'Using it in practice' } },
  { id: 'caveats', title: { ja: '弱いところ', en: 'Weak spots' } },
  { id: 'references', title: { ja: '参考文献', en: 'References' } },
]

type Param = { name: string; when: string; what: string; up: string }

const PARAMS: Param[] = [
  { name: 'M', when: '作るとき', what: '1 つの点が持つつながりの数（最下層は 2M）', up: '精度が上がる。メモリと作る時間が増える' },
  { name: 'efConstruction', when: '作るとき', what: '点を入れるときに集める候補の数', up: 'グラフの質が上がる。作る時間が増える' },
  { name: 'efSearch', when: '探すとき', what: '最下層で持っておく候補の数（k 以上）', up: '精度が上がる。探す時間が増える' },
]

const PARAMS_EN: Param[] = [
  { name: 'M', when: 'build time', what: 'Number of links each point keeps (2M on the bottom layer)', up: 'Higher: better accuracy; more memory and longer build' },
  { name: 'efConstruction', when: 'build time', what: 'Number of candidates gathered when inserting a point', up: 'Higher: better graph quality; longer build' },
  { name: 'efSearch', when: 'search time', what: 'Number of candidates kept on the bottom layer (at least k)', up: 'Higher: better accuracy; slower search' },
]

function ParamTable({ items, upLabel }: { items: Param[]; upLabel: string }) {
  return (
    <div className="flex w-full flex-col divide-y divide-ink/10 overflow-hidden rounded-[10px] border border-ink/10">
      {items.map((p) => (
        <div key={p.name} className="grid gap-1 px-4 py-3 sm:grid-cols-[130px_minmax(0,1fr)_minmax(0,1fr)] sm:gap-4">
          <span className="flex flex-col">
            <code className="font-mono text-[13px] font-bold">{p.name}</code>
            <span className="text-[11px] text-mute">{p.when}</span>
          </span>
          <span className="text-[13px] leading-[1.7]">{p.what}</span>
          <span className="text-[13px] leading-[1.7] text-mute">
            {upLabel}
            {p.up}
          </span>
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

const REFS_EN: Reference[] = REFS.map((ref) => ({
  ...ref,
  authors: ref.authors === '水野航太' ? 'Kota Mizuno' : ref.authors,
  source: ref.source.replace('（arXiv 2016）', ' (arXiv 2016)').replace('（GitHub）', ' (GitHub)').replace('API ドキュメント', 'API docs'),
}))

const FAISS = `import faiss

d = 768                                  # ベクトルの次元
index = faiss.IndexHNSWFlat(d, 32)       # M = 32
index.hnsw.efConstruction = 200          # add の前に決める
index.add(xb)                            # xb: (n, d) の float32

index.hnsw.efSearch = 64                 # 探すときに変えられる
D, I = index.search(xq, 10)              # 近い 10 件の距離と番号`

const FAISS_EN = `import faiss

d = 768                                  # vector dimension
index = faiss.IndexHNSWFlat(d, 32)       # M = 32
index.hnsw.efConstruction = 200          # set before add
index.add(xb)                            # xb: float32 array of shape (n, d)

index.hnsw.efSearch = 64                 # can be changed at search time

D, I = index.search(xq, 10)              # distances and ids of the 10 nearest`

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
          <ParamTable items={PARAMS} upLabel="上げると: " />
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

      <Summary
        label="まとめ"
        items={[
          '近い点どうしをつないだグラフを、目的地に近づく方へ貪欲にたどる。',
          'グラフを層に重ね、上の層で大きく近づいてから下の層で細かく探す。',
          '上の層に載る確率は 1/M。だから層の数も手数も log N 程度で済む。',
          'M と efConstruction は作るとき、efSearch は探すときの「精度と速さ」の調整つまみ。',
        ]}
      />

      <NoteSection step={10} id="references" title="参考文献">
        <References items={REFS} />
      </NoteSection>
    </>
  )
}

export function HnswEn() {
  return (
    <>
      <P>
        <Strong>HNSW (Hierarchical Navigable Small World) is a way to build a graph, and to search it, so that you can find nearby vectors fast.</Strong> It is used inside many
        vector search systems, including Faiss, Lucene (OpenSearch / Elasticsearch) and pgvector. This note follows how it works through diagrams of a small HNSW that actually runs on
        this page.
      </P>

      <NoteSection step={1} id="why" title="Why I looked into it">
        <P>
          When I wrote <A href="https://zenn.dev/kotap/articles/faiss-lucene-ann-gif">an article comparing vector search in Faiss and Lucene</A>
          <Cite n={7} /> (in Japanese), both turned out to be HNSW underneath. I wanted to be able to explain parameters like M and ef from how the algorithm works, rather than from
          &ldquo;raising it apparently improves accuracy&rdquo;.
        </P>
        <P>
          This note covers the shape of the graph, how it is searched, how it is built, and its parameters. It does not touch other approaches such as quantization (PQ and friends)
          that compresses vectors, or IVF that splits data into clusters before searching.
        </P>
        <Callout title="About the diagrams">
          Every diagram here comes from a small HNSW written to follow the steps in the paper (Malkov &amp; Yashunin) <Cite n={1} />, running inside this page. For readability the
          points are 2-dimensional, there are 140 of them, and M = 4. Real embeddings have hundreds of dimensions, but the algorithm does the same thing.
        </Callout>
      </NoteSection>

      <NoteSection step={2} id="problem" title="Finding nearby vectors is expensive">
        <P>
          Pass text or images through an embedding model and you get vectors with hundreds to thousands of dimensions. The model is trained so that things with similar meaning end up
          close together, so finding &ldquo;similar things&rdquo; means <Strong>finding the closest points</Strong> in this vector space.
        </P>
        <P>
          The sure way is to measure the distance to every point (brute force). But one distance already costs as many multiplications as there are dimensions. For a million
          768-dimensional vectors, a single search takes about 770 million multiplications. Paying that on every search is too much.
        </P>
        <Figure kind="animation" n={1} caption="The same problem solved by brute force and by HNSW. HNSW measures only some of the points and still reaches the same answer.">
          <BruteVsHnsw />
        </Figure>
        <P>
          In 2 or 3 dimensions, tree structures that split space into boxes (k-d trees and the like) find neighbors quickly. In high dimensions, though, nearby points could be in
          almost any box, so the splits stop helping and you end up looking at nearly everything (the curse of dimensionality).
        </P>
        <P>
          So <Strong>approximate nearest neighbor search (ANN)</Strong> gives up a little on always being right, in exchange for measuring far fewer points. How right it is gets
          measured by the share of the true top k it returns (<Strong>recall@k</Strong>). Among ANN methods, HNSW is widely used for its good balance between speed and recall.
        </P>
      </NoteSection>

      <NoteSection step={3} id="greedy" title="Walking a graph toward the target">
        <P>
          The foundation is a <Strong>graph that links nearby points to each other</Strong> (called NSW, the predecessor of HNSW) <Cite n={2} />. To search, you start from some
          point and keep moving to whichever linked point is closest to the target. When no neighbor gets you any closer, you stop. This is called <Strong>greedy search</Strong>.
        </P>
        <P>
          Whether it works depends on the shape of the graph. &ldquo;Small World&rdquo; refers to the idea that you can reach anyone in the world through a few acquaintances. If, besides
          links to nearby points, there are some links to far-away points, you can get close to any target in a few steps from anywhere. In NSW, the links between the earliest
          points, inserted while the graph was still small, end up serving as those long-range links <Cite n={2} />.
        </P>
        <Figure kind="animation" n={2} caption="Greedy search on a graph that contains every point, without layers. Press Next to advance one move at a time.">
          <GreedyWalk />
        </Figure>
        <P>
          This approach has two weak spots. First, most links are between nearby points, so <Strong>reaching a distant target takes many small steps</Strong>. Second, the search can{' '}
          <Strong>stop at a place where it cannot get any closer (a local minimum)</Strong>. In Animation 2, it gets right next to the truly nearest point, but stops because it has no
          neighbor leading there. NSW softened this by restarting the search from different entry points <Cite n={2} />.
        </P>
      </NoteSection>

      <NoteSection step={4} id="layers" title="Stacking layers to close in from far away">
        <P>
          HNSW <Strong>stacks this graph into several layers</Strong>. The bottom layer, layer 0, has every point. Upper layers hold only some of them, and because there are fewer
          points, even links between &ldquo;near&rdquo; points reach far. Think of it as taking the highway, then main roads, then side streets.
        </P>
        <P>
          The idea is the same as the <Strong>skip list</Strong> <Cite n={8} />, which speeds up searching a sorted list by stacking &ldquo;express lanes&rdquo; on top of it. HNSW
          brings that idea into unordered, high-dimensional space <Cite n={1} />.
        </P>
        <Figure kind="animation" n={3} caption="Search from the top layer down. The point where each layer stops becomes the entry point of the layer below.">
          <LayerSearch />
        </Figure>
        <P>
          The search itself is simple. Start from the entry point on the top layer and run a greedy search on that layer. The point where it stops is guaranteed to exist on the
          layer below, so use it as the entry point there and search greedily again. Repeat down to layer 0 <Cite n={1} />. On upper layers only the single closest point is
          carried along; on layer 0 the search keeps up to <C>efSearch</C> candidates and looks more widely (more on this in section 7).
        </P>
        <P>
          Upper layers carry you close to the target in big strides, and lower layers search the neighborhood in detail. Because the entry point starts out near the target, you
          spend little time walking the fine-grained layer, and you are less likely to fall into a local minimum. The same point that Animation 2 got stuck next to is found correctly
          this time.
        </P>
      </NoteSection>

      <NoteSection step={5} id="levels" title="How high a point goes is decided by chance">
        <P>
          Which points go up to higher layers is not decided by the data; it is <Strong>drawn at random</Strong> when the point is inserted. As a formula, <C>floor(-ln(U) × mL)</C>,
          where U is a random number between 0 and 1 and mL = 1 / ln(M). This makes the chance of reaching one layer higher exactly 1/M <Cite n={1} />. With M = 16, one point in 16
          reaches layer 1 and one in 256 reaches layer 2.
        </P>
        <Figure kind="animation" n={4} caption="Actually rolling the levels for 10,000 points. Change M to see how quickly the upper layers thin out.">
          <LevelDice />
        </Figure>
        <P>
          Since each layer up has about 1/M of the points, there are only around <C>log_M N</C> layers. With M = 16 and a million points, <C>log_16(1,000,000) ≈ 5</C>, so about six
          layers. If each layer takes a few steps, the total number of steps also grows roughly with <C>log N</C>. Ten times more points means only a few more steps <Cite n={1} />.
        </P>
        <P>
          Using randomness is not a shortcut. The points on upper layers end up spread evenly across the data, so you can close in on a target in any direction with big strides. It
          also means the layer structure does not break down even if data is inserted in order or in a skewed order.
        </P>
      </NoteSection>

      <NoteSection step={6} id="insert" title="Inserting a point">
        <P>
          The graph grows as points are inserted one by one. Inserting is almost the same as searching: <Strong>search for the new point itself, then link it to the nearby points you
          find</Strong>. It happens in two phases <Cite n={1} />.
        </P>
        <P>
          First, draw the layer the new point will reach. Above that layer, simply descend greedily as in a search, without creating links. From that layer down to layer 0, gather up
          to <C>efConstruction</C> nearby candidates on each layer, pick M of them, and link them in both directions. If a neighbor ends up with more links than allowed (M on upper
          layers, 2M on layer 0), it drops its farthest link to get back under the limit.
        </P>
        <Figure kind="animation" n={5} caption="Inserting one point into a 140-point graph. On layers 1 and 0, gather nearby candidates, link to them, and have overloaded neighbors drop their farthest link.">
          <InsertNode />
        </Figure>
        <P>
          Links go both ways so that the new point can be reached both from points inserted later and from points that were already there. With one-way links, a new point could
          become a dead end that nobody can reach. And since points can be added later, the same structure works for data that keeps growing.
        </P>
        <Callout title="The paper picks neighbors to be spread out, not just the closest">
          This diagram picks the M closest candidates. The paper also describes another rule (a heuristic): go through candidates from nearest to farthest, and{' '}
          <Strong>pick one only if it is closer to the new point than to any point already picked</Strong> <Cite n={1} />. This avoids choosing many candidates in the same
          direction, so even in dense areas, paths to other distant clusters are more likely to survive.
        </Callout>
      </NoteSection>

      <NoteSection step={7} id="params" title="The three parameters">
        <P>
          With all that in place, it becomes clear what each HNSW parameter controls <Cite n={[1, 4]} />.
        </P>
        <Figure kind="table" n={1} caption="The main HNSW parameters. Names differ a little between implementations (Lucene calls M maxConn and efConstruction beamWidth).">
          <ParamTable items={PARAMS_EN} upLabel="" />
        </Figure>
        <P>
          <Strong>M</Strong> is how many roads the graph has. More of them means fewer detours and fewer local minima, but each point keeps more links, so memory use and build time
          go up. The hnswlib docs say M = 12–48 is fine for most uses, and that high-dimensional data needing high recall, such as embeddings, may need 48–64 <Cite n={4} />.
        </P>
        <P>
          <Strong>efConstruction</Strong> is how widely candidates are searched when a point is inserted. Larger values connect points to their truly nearest neighbors and give a
          better graph, at the cost of build time. Past some point it stops improving quality. One suggested check: after building, search for M neighbors with efSearch =
          efConstruction, and if recall is below 0.9, there is room to raise it <Cite n={4} />.
        </P>
        <P>
          These two are fixed when the graph is built; changing them means rebuilding. <Strong>Only efSearch can be changed on every search.</Strong> It is the number of candidates
          kept on layer 0 and must be at least the number of results k <Cite n={4} />. Tuning accuracy against speed starts here.
        </P>
        <Figure kind="animation" n={6} caption="How recall and the amount of computation change as efSearch moves. Values actually measured on 3,000 16-dimensional points.">
          <EfTradeoff />
        </Figure>
        <P>
          As Animation 6 shows, raising a small efSearch a little improves recall a lot, and the closer you get to 100%, the more computation each further gain costs. Deciding how much
          accuracy to go after, use case by use case, is the core of tuning.
        </P>
      </NoteSection>

      <NoteSection step={8} id="use" title="Using it in practice">
        <P>
          In Faiss, M is passed when creating the index, and efConstruction and efSearch are set as attributes <Cite n={3} />. efConstruction must be set before <C>add</C> builds the
          graph; efSearch can be changed any time before a search.
        </P>
        <Figure kind="code" n={1} caption="Building and searching an HNSW index with Faiss (Python).">
          <CodeBlock title="python" code={FAISS_EN} />
        </Figure>
        <P>
          In OpenSearch, the parameters go into the definition of the vector field <Cite n={6} />. The distance metric (<C>space_type</C>) is set there too. The value corresponding
          to efSearch is set in the index settings or in the search request. In Lucene, which OpenSearch and Elasticsearch use internally, M is called maxConn and efConstruction is
          called beamWidth <Cite n={5} />.
        </P>
        <Figure kind="code" n={2} caption="Defining an OpenSearch k-NN field with HNSW (Lucene engine).">
          <CodeBlock title="OpenSearch" code={OPENSEARCH} />
        </Figure>
        <P>
          Whatever the implementation, a safe order is to build with the defaults first, then move efSearch while measuring recall and latency on real queries. If recall is still not
          enough, raise M or efConstruction and rebuild.
        </P>
      </NoteSection>

      <NoteSection step={9} id="caveats" title="Weak spots">
        <P>HNSW is fast and easy to use, but as a graph-based method it has its own weak spots.</P>
        <Callout tone="warn" title="It uses a lot of memory">
          On top of the vectors themselves, each point keeps up to 2M links on the bottom layer alone. hnswlib estimates the links at roughly M × 8–10 bytes per point <Cite n={4} />.
          With M = 16 and 10 million points, that is around 1.3–1.6 GB besides the vectors. The whole graph is usually kept in memory, so sizing memory for your data is essential.
        </Callout>
        <Callout tone="warn" title="Deleting is hard">
          Removing a point cuts the paths that went through it. Most implementations mark it as deleted, skip it during search, and only really remove it on a rebuild (Faiss&rsquo;s
          IndexHNSW does not support deletion at all). For data with many updates and deletes, plan for periodic rebuilds.
        </Callout>
        <Callout tone="warn" title="Accuracy tends to drop with filtering">
          Filtering by a condition, like &ldquo;only category A&rdquo;, leaves fewer points to walk through, and paths break more easily. Filter after searching and you may not get
          enough results; filter before and the graph may not stay connected. Search engines work around this, for example by falling back to brute force when the filter is very
          strict.
        </Callout>
        <Callout tone="warn" title="It is not right 100% of the time">
          It is approximate, so it can miss some of the true top k. When accuracy matters, raise efSearch, or fetch extra candidates and re-rank them by exact distance. Recall depends
          on the data, so measuring on your own data is the reliable way.
        </Callout>
      </NoteSection>

      <Summary
        label="Summary"
        items={[
          'Walk a graph of linked nearby points, greedily, toward the target.',
          'Stack the graph into layers: close in with big strides on top, then search finely below.',
          'A point reaches the next layer with probability 1/M, so both the number of layers and the steps stay around log N.',
          'M and efConstruction tune accuracy against speed at build time; efSearch does it at search time.',
        ]}
      />

      <NoteSection step={10} id="references" title="References">
        <References items={REFS_EN} />
      </NoteSection>
    </>
  )
}

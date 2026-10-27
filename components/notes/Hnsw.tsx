import { A, C, Callout, CodeBlock, Figure, Li, NoteSection, P, Strong } from '@/components/notes/Prose'
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
]

const PARAMS = [
  { name: 'M', when: '作るとき', what: '1 つの点が持つつながりの数（最下層は 2M）', up: '精度が上がる。メモリと作る時間が増える' },
  { name: 'efConstruction', when: '作るとき', what: '点を入れるときに集める候補の数', up: 'グラフの質が上がる。作る時間が増える' },
  { name: 'efSearch', when: '探すとき', what: '最下層で持っておく候補の数（k 以上）', up: '精度が上がる。探す時間が増える' },
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
          を書いたとき、どちらも中身は HNSW でした。M や ef といったパラメータを「上げると精度が上がるらしい」ではなく、仕組みから説明できるようにしたくて整理しました。
        </P>
        <Callout title="この記事の図について">
          図はすべて、論文（Malkov & Yashunin, 2016）の手順どおりに書いた小さな HNSW を、このページの中で実際に動かしたものです。見やすさのため点は 2 次元・140 個、M = 4 にしています。
        </Callout>
      </NoteSection>

      <NoteSection step={2} id="problem" title="近いベクトルを探すのは重い">
        <P>
          文章や画像を埋め込みモデルに通すと、数百〜数千次元のベクトルになります。「似ているもの」を探すのは、このベクトル空間で<Strong>一番近い点を探す</Strong>
          ことです。確実なのは全部の点と距離を測ること（総当たり）ですが、点が 100 万個あれば 1 回の検索で 100 万回の計算が要ります。
        </P>
        <Figure kind="animation" n={1} caption="同じ問題を、総当たりと HNSW で解く。HNSW は一部の点だけを測って、同じ答えにたどり着く。">
          <BruteVsHnsw />
        </Figure>
        <P>
          HNSW は「必ず正解する」ことを少しだけ諦めて、そのかわり測る点を大きく減らします。こういう探し方を<Strong>近似最近傍探索（ANN）</Strong>と呼びます。
        </P>
      </NoteSection>

      <NoteSection step={3} id="greedy" title="グラフをたどって近づく">
        <P>
          土台になるのは、<Strong>近い点どうしを線でつないだグラフ</Strong>です。探すときは、どこかの点から始めて「つながっている点の中で、目的地に一番近い点へ移る」を繰り返します。どの隣に移っても近づかなくなったら終わりです。
        </P>
        <Figure kind="animation" n={2} caption="層を使わず、全部の点が入ったグラフだけを貪欲にたどる。「次へ」で 1 手ずつ進む。">
          <GreedyWalk />
        </Figure>
        <P>
          この方法には 2 つの弱点があります。近い点どうししかつながっていないので、<Strong>遠い目的地まで小さな歩幅で何度も移動する</Strong>こと。そして途中で
          <Strong>それ以上近づけない場所（局所解）に止まる</Strong>ことがあることです。
        </P>
      </NoteSection>

      <NoteSection step={4} id="layers" title="層を重ねて、遠くから一気に近づく">
        <P>
          HNSW は、このグラフを<Strong>何層も重ねます</Strong>。一番下の層 0 には全部の点。上の層にはその一部だけが載っていて、点が少ないぶん、1 本のつながりが遠くまで届きます。地図でいえば、高速道路 → 一般道 → 路地、の順に乗り継ぐイメージです。
        </P>
        <Figure kind="animation" n={3} caption="上の層から順に探す。各層で止まった点が、1 つ下の層の入口になる。">
          <LayerSearch />
        </Figure>
        <P>
          上の層は大股で目的地の近くまで運ぶ役、下の層は近くを細かく探す役です。入口が目的地の近くになるので、Animation 2 で行き詰まったのと同じ点を、今度は正しく見つけられています。
        </P>
      </NoteSection>

      <NoteSection step={5} id="levels" title="どの層まで載るかは確率で決まる">
        <P>
          どの点を上の層に載せるかは、点を入れるときに<Strong>乱数で決めます</Strong>。式にすると <C>floor(-ln(U) × mL)</C>（U は 0〜1 の乱数、mL = 1 / ln(M)）。こうすると、1 つ上の層に載る確率がちょうど 1/M になります。
        </P>
        <Figure kind="animation" n={4} caption="1 万個の点の層を実際に振ってみる。M を変えると、上の層への減り方が変わる。">
          <LevelDice />
        </Figure>
        <P>
          層が上がるごとに点が 1/M に減るので、層の数は点の数の対数ぶんしか増えません。探索で各層を数歩ずつ進むとすると、全体の手数もおよそ <C>log N</C> に比例します。100 万点でも、たどる層は数段です。
        </P>
      </NoteSection>

      <NoteSection step={6} id="insert" title="点の入れ方">
        <P>
          グラフは、点を 1 つずつ入れながら育てます。入れ方は探し方とほぼ同じで、<Strong>新しい点そのものを探しに行き、見つかった近い点とつなぐ</Strong>だけです。
        </P>
        <Figure kind="animation" n={5} caption="140 点のグラフに 1 点を入れる。層 1 と層 0 で、近い候補を集めてつなぎ、つながりすぎた相手は遠い線を切る。">
          <InsertNode />
        </Figure>
        <Callout title="論文では「近い順」ではなく「散らばるように」選ぶ">
          この図では近い順に M 個を選んでいます。論文には、すでに選んだ点と同じ方向にある候補を後回しにする選び方（ヒューリスティック）もあり、点が固まっている場所でも遠くへの道が残りやすくなります。Faiss や Lucene などの実装はこちらを使っています。
        </Callout>
      </NoteSection>

      <NoteSection step={7} id="params" title="3 つのパラメータ">
        <P>ここまでで、HNSW のパラメータがそれぞれ何を決めているかが見えてきます。</P>
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
          M と efConstruction はグラフを作るときに決まり、あとから変えるには作り直しが要ります。<Strong>efSearch だけは検索のたびに変えられる</Strong>
          ので、精度と速さの調整はまずここで行います。
        </P>
        <Figure kind="animation" n={6} caption="efSearch を動かすと、精度（recall）と計算量がどう変わるか。16 次元・3,000 点で実際に測った値。">
          <EfTradeoff />
        </Figure>
      </NoteSection>

      <NoteSection step={8} id="use" title="実際に使うとき">
        <P>Faiss では、M を作るときに渡し、efConstruction と efSearch は属性で設定します。</P>
        <Figure kind="code" n={1} caption="Faiss（Python）で HNSW のインデックスを作って検索する。">
          <CodeBlock title="python" code={FAISS} />
        </Figure>
        <P>OpenSearch では、ベクトルのフィールドを定義するときにパラメータを書きます。efSearch にあたる値は、インデックスの設定や検索のリクエストで指定します。</P>
        <Figure kind="code" n={2} caption="OpenSearch の k-NN フィールドを HNSW（Lucene エンジン）で定義する。">
          <CodeBlock title="OpenSearch" code={OPENSEARCH} />
        </Figure>
      </NoteSection>

      <NoteSection step={9} id="caveats" title="弱いところ">
        <Callout tone="warn" title="メモリをたくさん使う">
          ベクトル本体に加えて、点ごとに最下層だけで最大 2M 本のつながりを持ちます。M = 16 なら 1 点あたり 32 個の番号で、数百万点になると無視できません。
        </Callout>
        <Callout tone="warn" title="消すのが苦手">
          点を抜くと、その点を通っていた道が途切れます。多くの実装は「消した印」を付けて探索では飛ばし、まとめて作り直すときに本当に消します（Faiss の IndexHNSW は削除そのものに対応していません）。
        </Callout>
        <Callout tone="warn" title="絞り込みと組み合わせると精度が落ちやすい">
          「カテゴリが A のものだけ」のように条件で絞ると、たどれる点が減って道が途切れやすくなります。検索エンジン側で、条件が厳しいときは総当たりに切り替えるなどの工夫がされています。
        </Callout>
        <Callout tone="warn" title="100% 正解するわけではない">
          近似なので、本当の上位 k 件を取りこぼすことがあります。精度が大事な場面では、efSearch を上げるか、候補を多めに取ってから正確な距離で並べ直します。
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
    </>
  )
}

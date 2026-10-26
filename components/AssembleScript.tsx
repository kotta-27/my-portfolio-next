/** 浮かせる量（1 段あたり）。開いた隙間からは下のブロックのスタッドが見える */
const RISE_PER_ROW = 10
/** 揃うまでに出てくるタイル数の上限（BentoGrid の MAX_STAGGER と合わせる） */
const MAX_STAGGER = 14

/**
 * 初回の組み上げ演出の準備。ブロックが描画される前（HTML の解析中）に走らせ、
 * 画面内のタイルを段ごとに「下の段ほど低く、上の段ほど高く」浮かせておく（--rise）。
 * 出揃ったら（--settle）全部が一斉に下り、隙間が閉じて下の段のスタッドにはまる。一番下の段は動かない。
 * 段の位置はレイアウト次第なので、サーバーでは決められずここで測る。動かなくてもその場でフェードインするだけ。
 */
const SCRIPT = `(function(){try{
var els=[].slice.call(document.querySelectorAll('.tile-enter'));if(!els.length)return;
var vh=innerHeight,tops=[];
function top(e){return Math.round(e.getBoundingClientRect().top)}
function same(a,b){return Math.abs(a-b)<=4}
els.forEach(function(e){var t=top(e);if(t<vh&&!tops.some(function(x){return same(x,t)}))tops.push(t)});
tops.sort(function(a,b){return b-a});
var settle=Math.min(els.length,${MAX_STAGGER})*35+300;
els.forEach(function(e){
  e.style.setProperty('--settle',settle+'ms');
  var t=top(e),k=0;for(var j=0;j<tops.length;j++)if(same(tops[j],t)){k=j;break}
  if(t<vh&&k>0){e.style.setProperty('--rise',k*${RISE_PER_ROW}+'px');e.style.setProperty('--click','1.5px')}
});
}catch(e){}})()`

/** タイル群の直後に置く */
export function AssembleScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
}

/**
 * イントロを見たかどうかの Cookie 名。
 * サーバー（page.tsx）とクライアント（IntroSeen）の両方から使うので、'use client' でないモジュールに置く
 * （'use client' のファイルから export した値は、サーバー側では文字列ではなくクライアント参照になる）。
 */
export const INTRO_COOKIE = 'intro_seen'

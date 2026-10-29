import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 段の間隔 = ブロックの厚み（--lip 5px）+ 間に挟むプレート（--plate-h 6px + --plate-side-h 2px）。globals.css と揃える
      spacing: { brick: '29px' },
      fontFamily: {
        // 日本語は Web フォントを配信せず OS の日本語フォントを使う（Noto Sans JP は @font-face だけで CSS が 90KB 超になるため）
        sans: ['var(--font-jakarta)', '"Hiragino Sans"', '"Hiragino Kaku Gothic ProN"', '"Yu Gothic UI"', '"Yu Gothic"', 'Meiryo', '"Noto Sans JP"', '"Noto Sans CJK JP"', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Bento palette。値は globals.css の CSS 変数（ライト / ダークで切り替わる）
        ground: 'rgb(var(--ground) / <alpha-value>)',
        tile: 'rgb(var(--tile) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        teal: 'rgb(var(--teal) / <alpha-value>)',
        coral: 'rgb(var(--coral) / <alpha-value>)',
        mute: 'rgb(var(--mute) / <alpha-value>)',
        soft: 'rgb(var(--soft) / <alpha-value>)',
        // ink / teal / coral の塗りの上に載せる文字色（ライトは白、ダークは黒寄り）
        paper: 'rgb(var(--paper) / <alpha-value>)',
        // 大きな濃色面（Contact・Reflection）。ダークでは反転させず、一段明るい紺にする
        slab: {
          DEFAULT: 'rgb(var(--slab) / <alpha-value>)',
          fg: 'rgb(var(--slab-fg) / <alpha-value>)',
        },
        // 写真の上の暗いオーバーレイ用。テーマに関係なく常に暗い
        night: '#0d1b2a',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        dialogIn: {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.55s ease both',
        'fade-in': 'fadeIn 0.5s ease both',
        'dialog-in': 'dialogIn 0.25s ease both',
      },
    },
  },
  plugins: [],
}
export default config

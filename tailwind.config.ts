import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // 日本語は Web フォントを配信せず OS の日本語フォントを使う（Noto Sans JP は @font-face だけで CSS が 90KB 超になるため）
        sans: ['var(--font-jakarta)', '"Hiragino Sans"', '"Hiragino Kaku Gothic ProN"', '"Yu Gothic UI"', '"Yu Gothic"', 'Meiryo', '"Noto Sans JP"', '"Noto Sans CJK JP"', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Bento palette
        ground: '#e5e9ef',
        tile: '#ffffff',
        ink: '#0d1b2a',
        teal: '#0e8a8c',
        coral: '#ee6c4d',
        mute: '#5d6b7a',
        soft: '#edf1f5',
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

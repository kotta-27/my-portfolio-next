'use client'

import { motion } from 'framer-motion'
import { PiFileTextFill, PiFolderSimpleFill, PiGitBranchBold, PiPencilSimpleFill } from 'react-icons/pi'
import { useTr } from '@/components/notes/i18n'

export type FolderState = {
  name: string
  branch: string
  /** main = 最初からある作業ツリー（.git はフォルダ）、linked = worktree add で増やしたもの（.git はファイル）、ghost = フォルダが消えて管理情報だけ残ったもの */
  kind: 'main' | 'linked' | 'ghost'
  dirty?: boolean
  active?: boolean
  error?: boolean
  highlight?: boolean
}

/** 作業フォルダ 1 つ。connector を付けると下（.git）へ線を伸ばす */
export function FolderBrick({ f, connector = false }: { f: FolderState; connector?: boolean }) {
  const ghost = f.kind === 'ghost'
  const tr = useTr()
  const tone = f.error ? 'border-coral' : f.highlight || f.active ? 'border-teal' : ghost ? 'border-mute/50' : 'border-ink/15'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0, x: f.error ? [0, -6, 6, -4, 4, 0] : 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 32, x: { duration: 0.4 } }}
      className="flex min-w-0 flex-col"
    >
      <div
        className={`relative flex flex-1 flex-col gap-2 rounded-[8px] border-2 px-2 pb-[10px] pt-[9px] sm:px-3 sm:pb-3 sm:pt-[10px] transition-colors duration-200 ${tone} ${
          ghost ? 'border-dashed bg-transparent text-mute' : 'bg-tile text-ink'
        }`}
      >
        <span className="flex min-w-0 items-start gap-[6px] font-mono text-[11px] font-bold sm:text-[12.5px]">
          <PiFolderSimpleFill className={`mt-[2px] shrink-0 text-[13px] ${ghost ? 'text-mute/60' : 'text-mute'}`} />
          <span className="min-w-0 break-all">{f.name}/</span>
        </span>
        <motion.span
          key={f.branch}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`inline-flex max-w-full w-fit items-center gap-[4px] truncate rounded-[5px] px-[6px] py-[2px] font-mono text-[10.5px] font-bold sm:text-[11px] ${
            ghost ? 'bg-soft text-mute' : 'bg-teal/10 text-teal'
          }`}
        >
          <PiGitBranchBold className="text-[12px]" />
          {f.branch}
        </motion.span>
        {/* 幅の狭い画面では 3 列に収まらないので省く（本文と図の説明で補える） */}
        <span className="hidden items-center gap-[5px] font-mono text-[10.5px] text-mute sm:flex">
          {f.kind === 'main' ? <PiFolderSimpleFill className="text-[12px]" /> : <PiFileTextFill className="text-[12px]" />}
          {f.kind === 'main' ? tr('.git/（本体）', '.git/ (main)') : ghost ? tr('フォルダは削除済み', 'folder deleted') : tr('.git（ファイル）', '.git (file)')}
        </span>
        {f.dirty && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex w-fit items-center gap-[4px] text-[10.5px] font-bold text-coral"
          >
            <PiPencilSimpleFill className="text-[11px]" />
            {tr('未コミットの変更', 'uncommitted changes')}
          </motion.span>
        )}
        {f.active && (
          <span className="inline-flex items-center gap-[4px] text-[10px] font-bold text-teal">
            <span className="h-[7px] w-[7px] rounded-full bg-teal" />
            {tr('作業中', 'working')}
          </span>
        )}
      </div>
      {connector && <span aria-hidden className={`mx-auto h-[18px] w-0 border-l-2 ${ghost ? 'border-dashed border-mute/50' : 'border-ink/25'}`} />}
    </motion.div>
  )
}

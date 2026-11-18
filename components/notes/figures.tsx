'use client'

import { lazyFigure } from '@/components/notes/LazyFigure'

/*
 * ノートの動く図。どれも画面に近づいてから読み込む（components/notes/LazyFigure.tsx）。
 * 2 つ目の引数は、読み込むまでに置く枠の高さ（スマホ / 広い画面）。実際の図の高さに合わせてある。
 */

// HNSW
export const BruteVsHnsw = lazyFigure(() => import('@/components/notes/hnsw/BruteVsHnsw').then((m) => m.BruteVsHnsw), 'h-[997px] sm:h-[741px]')
export const GreedyWalk = lazyFigure(() => import('@/components/notes/hnsw/GreedyWalk').then((m) => m.GreedyWalk), 'h-[556px] sm:h-[678px]')
export const LayerSearch = lazyFigure(() => import('@/components/notes/hnsw/LayerSearch').then((m) => m.LayerSearch), 'h-[695px] sm:h-[672px]')
export const LevelDice = lazyFigure(() => import('@/components/notes/hnsw/LevelDice').then((m) => m.LevelDice), 'h-[488px] sm:h-[389px]')
export const InsertNode = lazyFigure(() => import('@/components/notes/hnsw/InsertNode').then((m) => m.InsertNode), 'h-[905px] sm:h-[674px]')
export const EfTradeoff = lazyFigure(() => import('@/components/notes/hnsw/EfTradeoff').then((m) => m.EfTradeoff), 'h-[716px] sm:h-[633px]')

// git worktree
export const RepoModel = lazyFigure(() => import('@/components/notes/worktree/RepoModel').then((m) => m.RepoModel), 'h-[724px] sm:h-[569px]')
export const SwitchVsWorktree = lazyFigure(() => import('@/components/notes/worktree/SwitchVsWorktree').then((m) => m.SwitchVsWorktree), 'h-[564px] sm:h-[407px]')
export const SharedVsOwn = lazyFigure(() => import('@/components/notes/worktree/SharedVsOwn').then((m) => m.SharedVsOwn), 'h-[756px] sm:h-[466px]')
export const SameBranch = lazyFigure(() => import('@/components/notes/worktree/SameBranch').then((m) => m.SameBranch), 'h-[490px] sm:h-[375px]')

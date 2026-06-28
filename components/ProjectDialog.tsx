'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import type { Lang } from '@/types'
import type { ProjectItem } from '@/data/projects'
import { Tag } from '@/components/Tag'

type Props = {
  project: ProjectItem
  lang: Lang
  onClose: () => void
}

export function ProjectDialog({ project, lang, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]" />

      {/* panel */}
      <div
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-[600px] sm:max-w-[1220px] max-h-[90vh] flex flex-col animate-dialog-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* image */}
        <div className="relative h-[220px] sm:h-[340px] shrink-0 bg-[#f4f4f4]">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors duration-150 text-[14px]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex flex-col gap-4">
          <div>
            <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-2">{project.name}</h2>
            <div className="flex flex-wrap gap-[5px]">
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>

          <p className="text-[13.5px] leading-[1.8] text-[#555]">
            {project.detail[lang]}
          </p>

          {project.links.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[6px] text-[12px] font-medium tracking-[.04em] uppercase no-underline bg-[#1a1a1a] text-white rounded-lg px-5 py-[10px] hover:bg-[#333] transition-colors duration-150"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

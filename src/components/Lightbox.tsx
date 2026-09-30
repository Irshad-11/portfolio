import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Lightbox({ images, index, onClose, onIndex }: { images: string[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  useEffect(() => {
    if (index === null) return
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = '' }
  }, [index, images.length, onClose, onIndex])

  if (index === null) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <button className="absolute top-4 right-4 icon-btn !bg-black/50 !text-white" onClick={onClose} aria-label="Close"><X size={18} /></button>
      {images.length > 1 && (
        <>
          <button className="absolute left-3 top-1/2 -translate-y-1/2 icon-btn !bg-black/50 !text-white" onClick={e => { e.stopPropagation(); onIndex((index - 1 + images.length) % images.length) }} aria-label="Previous"><ChevronLeft size={18} /></button>
          <button className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn !bg-black/50 !text-white" onClick={e => { e.stopPropagation(); onIndex((index + 1) % images.length) }} aria-label="Next"><ChevronRight size={18} /></button>
        </>
      )}
      <img src={images[index]} alt="" className="max-h-[88vh] max-w-full object-contain border border-white/20" onClick={e => e.stopPropagation()} />
      {images.length > 1 && <span className="absolute bottom-5 left-1/2 -translate-x-1/2 mono text-white/70">{index + 1} / {images.length}</span>}
    </div>
  )
}
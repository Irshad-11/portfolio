import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  formOpen: boolean
  formTitle: string
  onClose: () => void
  children: ReactNode   // the list/table
  form: ReactNode       // the add/edit form
}

/**
 * Desktop: 2-column layout — list on left, form panel slides in on right.
 * Mobile:  form appears as a bottom-sheet modal overlay.
 */
export default function AdminSplitPanel({ formOpen, formTitle, onClose, children, form }: Props) {
  // Prevent body scroll on mobile when panel is open
  useEffect(() => {
    if (formOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [formOpen])

  return (
    <div className="relative">
      {/* Desktop layout */}
      <div className={`hidden lg:grid transition-all duration-300 gap-6 ${formOpen ? 'grid-cols-[1fr_400px]' : 'grid-cols-1'}`}>
        {/* List column */}
        <div className="min-w-0">{children}</div>

        {/* Form column (desktop) */}
        {formOpen && (
          <div className="glass rounded-2xl border border-[color:var(--border)] overflow-hidden flex flex-col self-start sticky top-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border)]">
              <h3 className="font-semibold text-[color:var(--text)] text-sm">{formTitle}</h3>
              <button onClick={onClose} className="text-[color:var(--text-faint)] hover:text-[color:var(--text)] transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-10rem)] p-5 space-y-4">
              {form}
            </div>
          </div>
        )}
      </div>

      {/* Mobile layout — list always visible */}
      <div className="lg:hidden">{children}</div>

      {/* Mobile modal overlay */}
      {formOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          {/* Sheet */}
          <div className="relative bg-[#0e0e0e] border-t border-[color:var(--border)] rounded-t-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border)] flex-shrink-0">
              <h3 className="font-semibold text-[color:var(--text)] text-sm">{formTitle}</h3>
              <button onClick={onClose} className="text-[color:var(--text-faint)] hover:text-[color:var(--text)]">
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto p-5 space-y-4 pb-10">
              {form}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

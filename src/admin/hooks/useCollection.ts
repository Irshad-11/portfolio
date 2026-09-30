import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { pruneUnused } from '../../lib/storage'
import { supabase } from '../../lib/supabase'
import { useData } from '../../context/DataContext'

type Row = { id: string; sort_order?: number }

/** Admin-side CRUD for a Supabase table (sees hidden rows too). */
export function useCollection<T extends Row>(table: string, order = 'sort_order', ascending = true) {
  const { refetch } = useData()
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from(table).select('*').order(order, { ascending }).order('created_at', { ascending: false })
    if (error) toast.error(`${table}: ${error.message}`)
    setItems((data as T[]) || [])
    setLoading(false)
  }, [table, order, ascending])

  useEffect(() => { load() }, [load])

  const save = useCallback(async (draft: Partial<T>): Promise<T | null> => {
    const { id, created_at, ...rest } = draft as Record<string, unknown>
    void created_at
    let res
    const previous = id && id !== 'draft' ? items.find(i => i.id === id) : undefined
    if (id && id !== 'draft') {
      res = await supabase.from(table).update(rest).eq('id', id as string).select().single()
    } else {
      const max = items.reduce((m, i) => Math.max(m, i.sort_order ?? 0), 0)
      res = await supabase.from(table).insert([{ ...rest, sort_order: (rest.sort_order as number) ?? max + 1 }]).select().single()
    }
    if (res.error) { toast.error(res.error.message); return null }
    await load(); refetch()
    if (previous) void pruneUnused(previous)
    return res.data as T
  }, [table, items, load, refetch])

  const remove = useCallback(async (id: string) => {
    const previous = items.find(i => i.id === id)
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) return toast.error(error.message)
    setItems(p => p.filter(i => i.id !== id)); refetch()
    if (previous) void pruneUnused(previous)
  }, [table, refetch, items])

  /** Optimistic partial update (used by inline toggles). */
  const patch = useCallback(async (id: string, values: Record<string, unknown>) => {
    setItems(p => p.map(i => (i.id === id ? { ...i, ...values } : i)))
    const { error } = await supabase.from(table).update(values).eq('id', id)
    if (error) { toast.error(error.message); load() } else refetch()
  }, [table, load, refetch])

  const move = useCallback(async (id: string, dir: -1 | 1) => {
    const i = items.findIndex(x => x.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= items.length) return
    const next = [...items]; [next[i], next[j]] = [next[j], next[i]]
    const renum = next.map((x, k) => ({ ...x, sort_order: k + 1 }))
    setItems(renum)
    await Promise.all(renum.filter((x, k) => x.sort_order !== items[k]?.sort_order || x.id !== items[k]?.id)
      .map(x => supabase.from(table).update({ sort_order: x.sort_order }).eq('id', x.id)))
    refetch()
  }, [items, table, refetch])

  return { items, loading, load, save, remove, patch, move, setItems }
}
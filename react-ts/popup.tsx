import { useEffect, useState } from "react"
import { openDB } from "idb"

export const HistoryPanel = () => {
  const [items, setItems] = useState<
    { id: number; text: string; ts: number }[]
  >([])

  useEffect(() => {
    ;(async () => {
      const db = await openDB("clipboard-db", 1)
      const tx = db.transaction("items", "readonly")
      const all = await tx.store.getAll()
      setItems(all.reverse()) // 新しい順
    })()
  }, [])

  return (
    <ul className="p-4 space-y-2 text-sm">
      {items.map((i) => (
        <li key={i.id} className="truncate border-b">
          {i.text}
        </li>
      ))}
    </ul>
  )
}

export default HistoryPanel


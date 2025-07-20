import { dbPromise, type ClipItem } from "../lib/db"
import { useEffect, useState } from "react"

export default function HistoryPanel() {
  const [items, setItems] = useState<ClipItem[]>([])

  useEffect(() => {
    ;(async () => {
      const db = await dbPromise
      const all = await db.getAll("items")
      setItems(all.reverse())
    })()
  }, [])

  return (
    <ul className="p-4 space-y-1 text-sm w-72">
      {items.map((i) => (
        <li key={i.id} className="truncate border-b last:border-none">
          {i.text}
        </li>
      ))}
    </ul>
  )
}


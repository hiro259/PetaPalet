import { useEffect, useState } from "react"
import { dbPromise, type ClipItem } from "../lib/db"

export default function HistoryPanel() {
  const [items, setItems] = useState<ClipItem[]>([])

  useEffect(() => {
    void (async () => {
      const db = await dbPromise
      const all = await db.getAll("items")
      setItems(all.reverse())
    })()
  }, [])

  return (
    <ul className="p-4 text-sm">
      {items.map((item) => (
        <li key={item.id} className="truncate">
          {item.text}
        </li>
      ))}
    </ul>
  )
}

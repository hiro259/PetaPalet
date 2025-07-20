import { useEffect, useState } from "react"
import { Button, Card, ScrollArea, useToast } from "shadcn/ui"
import { dbPromise } from "../lib/db"
import type { ClipItem } from "../lib/db"

export default function HistoryPanel() {
  const [items, setItems] = useState<ClipItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    void (async () => {
      const db = await dbPromise
      const all = await db.getAll("items")
      setItems(all.reverse())
    })()

    const listener = (msg: { type?: string; payload?: ClipItem }) => {
      if (msg.type !== "SAVE_CLIP" || !msg.payload) return
      setItems((prev) => [msg.payload, ...prev])
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => {
      chrome.runtime.onMessage.removeListener(listener)
    }
  }, [])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ description: "Copied!", duration: 1000 })
  }

  const clearAll = async () => {
    const db = await dbPromise
    await db.clear("items")
    setItems([])
  }

  return (
    <>
      <ScrollArea className="h-[400px] w-80">
        <div className="p-2 space-y-2 text-sm">
          {items.map((item) => (
            <Card
              key={item.id}
              className="flex items-center justify-between cursor-pointer p-2 hover:bg-secondary"
              onClick={() => handleCopy(item.text)}
            >
              <span className="w-12 shrink-0">
                {new Date(item.ts).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
              <span className="flex-1 truncate px-2">{item.text}</span>
              <span className="shrink-0">📋</span>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <Button onClick={clearAll} className="mt-2 w-full">
        Clear All
      </Button>
    </>
  )
}

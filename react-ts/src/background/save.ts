import { dbPromise } from "../lib/db"
import type { ClipItem } from "../lib/db"

chrome.runtime.onMessage.addListener(async (msg: { type?: string; payload?: ClipItem }) => {
  if (msg.type !== "SAVE_CLIP" || !msg.payload) return
  const db = await dbPromise
  await db.add("items", msg.payload)
})

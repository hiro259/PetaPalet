import { dbPromise } from "../lib/db"

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg?.type !== "SAVE_CLIP") return
  const db = await dbPromise
  await db.add("items", msg.payload) // 型は ClipItem に合う
})


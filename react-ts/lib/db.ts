import {
  openDB,
  deleteDB,
  type IDBPDatabase,
  type DBSchema
} from "idb"

export type ClipItem = {
  id?: number
  text: string
  ts: number
}

interface ClipSchema extends DBSchema {
  items: {
    key: number
    value: ClipItem
  }
}

const DB_NAME = "clipboard-db"

export const dbPromise = (async () => {
  // ① まず現在の DB を開く（存在しなければ作られる）
  let db = await openDB<ClipSchema>(DB_NAME)

  // ② items ストアが無ければバージョンアップして作成
  if (!db.objectStoreNames.contains("items")) {
    const newVersion = db.version + 1
    db.close() // 旧ハンドルを閉じる

    db = await openDB<ClipSchema>(DB_NAME, newVersion, {
      upgrade(upgradeDb) {
        // ここは必ず items が無い状態で呼ばれる
        upgradeDb.createObjectStore("items", {
          keyPath: "id",
          autoIncrement: true
        })
      }
    })
  }

  return db
})()


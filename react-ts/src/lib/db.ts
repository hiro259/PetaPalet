import { openDB, type IDBPDatabase, type DBSchema } from "idb"

export type ClipItem = { id?: number; text: string; ts: number }

interface ClipSchema extends DBSchema {
  items: {
    key: number
    value: ClipItem
  }
}

const DB_NAME = "clipboard-db"
const STORE_NAME = "items"

export const dbPromise: Promise<IDBPDatabase<ClipSchema>> = (async () => {
  let db = await openDB<ClipSchema>(DB_NAME, undefined, {
    upgrade(upgradeDb) {
      if (!upgradeDb.objectStoreNames.contains(STORE_NAME)) {
        upgradeDb.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        })
      }
    }
  })

  if (!db.objectStoreNames.contains(STORE_NAME)) {
    const newVersion = db.version + 1
    db.close()

    db = await openDB<ClipSchema>(DB_NAME, newVersion, {
      upgrade(upgradeDb) {
        upgradeDb.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        })
      }
    })
  }

  return db
})()

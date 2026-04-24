"use client"

const DB_NAME = 'dsp-offline'
const STORE = 'submissions'
const DB_VERSION = 1

export interface QueuedSubmission {
  id: string
  url: string
  body: any
  createdAt: number
  attempts: number
  lastError?: string
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function enqueue(item: Omit<QueuedSubmission, 'id' | 'createdAt' | 'attempts'>): Promise<QueuedSubmission> {
  const full: QueuedSubmission = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    attempts: 0,
    ...item,
  }
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).add(full)
    tx.oncomplete = () => resolve(full)
    tx.onerror = () => reject(tx.error)
  })
}

export async function getAll(): Promise<QueuedSubmission[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => resolve(req.result as QueuedSubmission[])
    req.onerror = () => reject(req.error)
  })
}

export async function remove(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function update(id: string, patch: Partial<QueuedSubmission>): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const getReq = store.get(id)
    getReq.onsuccess = () => {
      const current = getReq.result
      if (!current) { resolve(); return }
      store.put({ ...current, ...patch })
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function count(): Promise<number> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).count()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

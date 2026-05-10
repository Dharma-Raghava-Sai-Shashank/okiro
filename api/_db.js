import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'Collegeverse'

if (!uri) {
  console.warn('[api] MONGODB_URI is not set')
}

let cached = globalThis.__trackerMongo
if (!cached) {
  cached = globalThis.__trackerMongo = { client: null, promise: null }
}

export async function getDb() {
  if (cached.client) return cached.client.db(dbName)
  if (!cached.promise) {
    cached.promise = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    })
      .connect()
      .then((client) => {
        cached.client = client
        return client
      })
      .catch((err) => {
        cached.promise = null
        throw err
      })
  }
  const client = await cached.promise
  return client.db(dbName)
}

export async function getTasksCollection() {
  const db = await getDb()
  return db.collection('tracker_tasks')
}

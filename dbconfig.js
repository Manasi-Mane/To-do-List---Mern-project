import { MongoClient } from "mongodb"

const url = "mongodb://127.0.0.1:27017"

const dbName = "node-project"
export const collectionName = "todo"

const client = new MongoClient(url)

export const connection = async () => {
    const connect = await client.connect()
    return connect.db(dbName)
}
import e from "express";
import { collectionName, connection } from "./dbconfig.js";
import cors from 'cors'
import { ObjectId } from "bson";
import jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser";
const app = e();

app.use(e.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())

app.post("/login", async (req, res) => {
    const userData = req.body;
    if (userData.email && userData.password) {
        const db = await connection()
        const collection = await db.collection('users')
        const result = await collection.findOne({ email: userData.email, password: userData.password })
        if (result) {
            jwt.sign(userData, 'Google', { expiresIn: '5d' }, (error, token) => {
                res.send({ succes: true, msg: "login done", token })
            })
        }
        else {
            res.send({ succes: false, msg: "user not found" })
        }
    }
    else {
        res.send({ succes: false, msg: "login not done" })
    }

})

app.post("/signup", async (req, res) => {
    const userData = req.body;
    if (userData.email && userData.password) {
        const db = await connection()
        const collection = await db.collection('users')
        const result = await collection.insertOne(userData)
        if (result) {
            jwt.sign(userData, 'Google', { expiresIn: '5d' }, (error, token) => {
                res.send({ succes: true, msg: "signup done", token })
            })
        }
    }
    else {
        res.send({ succes: false, msg: "signup not done" })
    }

})
app.post("/add-task", async (req, res) => {
    const db = await connection()
    const collection = await db.collection(collectionName);
    const result = await collection.insertOne(req.body);
    if (result) {
        res.send({ message: "new task added", success: "true", result })
    }
    else {
        res.send({ message: "task not added", success: "false", result })
    }
})

app.get("/tasks", verifyJWTToken, async (req, res) => {
    const db = await connection()
    const collection = await db.collection(collectionName);
    const result = await collection.find().toArray();
    if (result) {
        res.send({ message: "Task list fetched", success: "true", result })
    }
    else {
        res.send({ message: "error try after sometime", success: "false", result })
    }
})

function verifyJWTToken(req, res, next) {
    // console.log("verifyJWTToken",req.cookies['token'])
    const token = req.cookies['token']
    jwt.verify(token, 'Google', (error, decoded) => {
        if(error){
            return res.send({
                msg:"invalid token",
                success:false
            })
        }
        console.log(decoded);
        next()

    })

}

app.delete("/delete/:id", async (req, res) => {
    const db = await connection()
    const id = req.params.id
    const collection = await db.collection(collectionName);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result) {
        res.send({ message: "Task Deleted", success: "true", result })
    }
    else {
        res.send({ message: "error try after sometime", success: "false", result })
    }
})

app.get("/task/:id", async (req, res) => {
    const db = await connection()
    const collection = await db.collection(collectionName);
    const id = req.params.id
    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (result) {
        res.send({ message: "Task fetched", success: "true", result })
    }
    else {
        res.send({ message: "error try after sometime", success: "false", result })
    }
})

app.put("/update-task", async (req, res) => {
    const db = await connection()
    const collection = await db.collection(collectionName);
    const { _id, ...fields } = req.body
    const update = { $set: fields }
    console.log(fields)
    const result = await collection.updateOne({ _id: new ObjectId(_id) }, update)
    if (result) {
        res.send({ message: "Task data updated", success: "true", result })
    }
    else {
        res.send({ message: "error try after sometime", success: "false", result })
    }
})

app.delete("/delete-multiple", async (req, res) => {
    const db = await connection()
    const Ids = req.body
    const deleteTaskIds = Ids.map((item) => new ObjectId(item))
    console.log(Ids)

    const collection = await db.collection(collectionName);
    const result = await collection.deleteMany({ _id: { $in: deleteTaskIds } });
    if (result) {
        res.send({ message: "Task Deleted", success: "result" })
    }
    else {
        res.send({ message: "error try after sometime", success: "false", result })
    }
})


app.listen(3200);
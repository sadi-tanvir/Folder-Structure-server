import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

// const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jnizw.mongodb.net/Folder-Structure?retryWrites=true&w=majority`

const MONGO_URI = `mongodb://localhost:27017/folder-structure`;

// mongodb connection
mongoose.connect(MONGO_URI)
    .then((): void => console.log('MongoDB Connected'))
    .catch((error): void => console.log(error));
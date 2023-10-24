import dotenv from "dotenv";
dotenv.config()
import express, { Request, Response } from "express";
const app = express();
const PORT = process.env.PORT;
import cors from "cors";


// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

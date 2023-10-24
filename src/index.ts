import dotenv from "dotenv";
dotenv.config()
import express, { Request, Response } from "express";
import cors from "cors";
const app = express();
const PORT = process.env.PORT;

import "./db/db";
import folderRoutes from "./routes/folder.route";

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/folder',folderRoutes)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

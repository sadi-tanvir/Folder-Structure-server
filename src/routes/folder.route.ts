import { Request, Response, Router } from "express";
const router = Router();
import { CreateFolder, GetFolders } from "../controller/folder.controller";
import Folder from "../models/Folder";

// create a new folder
router.post('/create', CreateFolder);


// get all folders from database
router.get('/folders', GetFolders)

export default router;
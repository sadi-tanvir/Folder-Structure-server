import { Router } from "express";
import { CreateFolder, DeleteFolder, GetFolders } from "../controller/folder.controller";
const router = Router();

// create a new folder
router.post('/create', CreateFolder);


// get all folders from database
router.get('/folders', GetFolders)


// delete folder
router.delete("/deleteFolder", DeleteFolder)
  

export default router;
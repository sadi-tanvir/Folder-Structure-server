import { Router } from "express";
const router = Router();
import { CreateFolder } from "../controller/folder.controller";

// // create new folder
router.post('/create', CreateFolder);

export default router;
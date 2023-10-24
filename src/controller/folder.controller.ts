import { Request, Response } from "express";
import Folder from "../models/Folder";

export const CreateFolder = async (req: Request, res: Response) => {
    try {
        const { name, parentId } = req.body;
        if (!name) return res.status(400).json({ message: "Folder name is required" });

        const folder = new Folder({
            parentId: parentId,
            name,
            children: [],
        });
        const result = await folder.save();

        // update parent folder's reference
        if (parentId) {
            const parentFolder = await Folder.findOne({ _id: parentId });
            if (parentFolder) {
                parentFolder.children.push(result._id);
                await parentFolder.save();
            } else {
                res.status(400).json({
                    message: "Parent folder not found"
                })
            }
        }

        
        res.status(201).json({
            folder: result
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
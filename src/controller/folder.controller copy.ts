import { Request, Response } from "express";
import Folder from "../models/Folder";


// Create Folder
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




// get all folders from database 
const populateChildren = async (folders: any) => {
    await Folder.populate(folders, { path: 'children' });

    for (const folder of folders) {
        if (folder.children.length > 0) {
            await populateChildren(folder.children);
        }
    }
};

export const GetFolders = async (req: Request, res: Response) => {
    try {
        const rootFolders = await Folder.find({ name: 'root' });

        await populateChildren(rootFolders);

        res.status(200).json({
            rootFolders: rootFolders[0]
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};





// delete folders
const deleteFolderAndChildren = async (folder: any) => {
    // Recursively delete children
    for (const childId of folder.children) {
        const childFolder = await Folder.findById(childId);
        if (childFolder) {
            await deleteFolderAndChildren(childFolder);
        }
    }

    // Remove the folder from its parent's children array
    await Folder.findOneAndUpdate({ _id: folder.parentId }, { $pull: { children: folder._id } });

    // Delete the folder
    await folder.deleteOne();
};

export const DeleteFolder = async (req: Request, res: Response) => {
    try {
        const { currentId } = req.body;

        // Find the folder to be deleted
        const folderToDelete = await Folder.findById(currentId);

        if (!folderToDelete) {
            return res.status(404).json({
                message: "Folder not found"
            });
        }

        // Recursively delete the folder and its children
        await deleteFolderAndChildren(folderToDelete);

        res.json({
            message: 'operation failed'
        });

    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    };
};
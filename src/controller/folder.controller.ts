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



// get all folders from database 
export const GetFolders = async (req: Request, res: Response) => {
    try {
        const rootFolders = await Folder.find({ children: { $exists: true } });

        if (rootFolders.length === 0) {
            return res.status(200).json([]);
        }

        await populateChildren(rootFolders);

        res.status(200).json({
            rootFolders: rootFolders[0]
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const populateChildren = async (folders: any) => {
    await Folder.populate(folders, { path: 'children' });

    for (const folder of folders) {
        if (folder.children.length > 0) {
            await populateChildren(folder.children);
        }
    }
};


export const DeleteFolder = async (req: Request, res: Response) => {
    try {
      const { parentId, currentId } = req.body;
  
      const parentUpdate = await Folder.updateOne(
        { _id: parentId },
        { $pull: { children: currentId } }
      )
  
      if(parentUpdate.modifiedCount){
        let deleted =await Folder.findByIdAndDelete(currentId)
  
        return res.json({
          message:deleted 
        })
      }
  res.json({
    message: 'operation failed'
  })
     
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
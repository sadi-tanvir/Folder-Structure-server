import { Document, Schema, Types, model } from "mongoose"

interface FolderModelType extends Document {
    parentId?: string;
    name: string;
    children: Types.ObjectId[];
}

const folderSchema = new Schema<FolderModelType>({
    parentId: String,
    name: {
        type: String,
        required: true,
        trim: true
    },
    children: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
});

const Folder = model<FolderModelType>('Folder', folderSchema);

export default Folder;

import { Document, ObjectId } from "mongoose";

interface IPost extends Document {
    title: string;
    content: string;
    author: string | ObjectId;
}

export { IPost }
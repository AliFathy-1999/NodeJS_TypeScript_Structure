import { InferSchemaType, Schema, model } from 'mongoose';
import { IPost } from '../../interfaces/posts';

const schema = new Schema<IPost>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true,
        ref: "User"
    },
}, {
    timestamps: true,
    versionKey: false,
})
// schema.index({ author: 'text', title: 'text' }, { unique: true })

const Post = model<IPost>('Post', schema)
type postType = InferSchemaType<typeof schema>;
export { Post, postType };

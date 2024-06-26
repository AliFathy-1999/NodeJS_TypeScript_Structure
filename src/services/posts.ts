import { ObjectId } from 'mongoose';
import { Post, postType } from '../DB/models/posts';
import { IPost } from '../interfaces/posts';
import { cacheOption } from '../interfaces/utils.interface';


const getPostService = async (filterBy: { [key:string] : any}, hashKey: string | ObjectId,cacheFlag: cacheOption = cacheOption.NO_CACHE) : Promise<Array<IPost>> => {
    if (cacheFlag === cacheOption.USE_CACHE) return await Post.find(filterBy).cache({key: hashKey }).exec()
    return await Post.find(filterBy)
}; 

const createPostService = async (postData: Partial<IPost>) : Promise<IPost>=> await Post.create(postData);

const updatePostService = async (filterBy: { [key:string] : any}, updateData: Partial<postType>) : Promise<postType> => await Post.findOneAndUpdate(filterBy, updateData, {runValidation: true, new : true});

const deletePostService = async (filterBy: { [key:string] : any}) : Promise<IPost> => await Post.findOneAndDelete(filterBy);

const getPostByIdService = async (filterBy: { [key:string] : any}) : Promise<IPost> => await Post.findOne(filterBy);

const getPostServicess  = async (filterBy: { [key:string] : any}) : Promise<Array<IPost>> => await Post.find(filterBy).exec(); 
export default{
    getPostService,
    createPostService,
    updatePostService,
    deletePostService,
    getPostByIdService,
    getPostServicess
}

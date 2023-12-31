import { StatusCodes } from 'http-status-codes';
import User from '../DB/models/users';
import { IUser } from '../interfaces/user';
import { ApiError } from '../lib';
import errorMsg from '../utils/messages/errorMsg';


const getUserService = async (filterBy: { [key:string] : any}) : Promise<IUser> => await User.findOne(filterBy); 

const createUserService = async (userData: { [key:string] : any}) : Promise<IUser>=> await User.create(userData);

const updateUserService = async (filterBy: { [key:string] : any}, updateData: { [key:string] : any}) : Promise<IUser> => await User.findOneAndUpdate(filterBy, updateData, {runValidation: true, new : true});

const deleteUserService = async (filterBy: { [key:string] : any}) : Promise<IUser> => await User.findOneAndDelete(filterBy);

const getUserByIdService = async (filterBy: { [key:string] : any}) : Promise<IUser> => await User.findOne(filterBy);


export default{
    getUserService,
    createUserService,
    updateUserService,
    deleteUserService,
    getUserByIdService,
}

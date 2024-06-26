import { JwtPayload } from 'jsonwebtoken';
import { Document, ObjectId } from 'mongoose';

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

enum ORDER {
  ASC = 1,
  DESC = -1,
}

enum TOKEN_TYPE {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN'
}
interface IUser extends Document{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userName: string;
    verified: boolean;
    activatedToken: string;
    pImage?: string;
    role: Role;
    comparePassword(password: string): Promise<Boolean>;
}
interface IUserPayload extends JwtPayload{
  userId: string;
  email: string;
  verified?: boolean;
  role: Role;
}


export { IUser, IUserPayload, Role, ORDER, TOKEN_TYPE }
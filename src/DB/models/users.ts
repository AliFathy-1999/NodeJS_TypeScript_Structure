import { Schema, model, InferSchemaType } from 'mongoose';
import validator from 'validator'
import bcryptjs from 'bcryptjs'

import { ApiError } from '../../lib';
import { IUser, Role } from '../../interfaces/user';
import validationPatterns from '../../utils/pattern.utils';

const { ALPHABETIC_ONLY_PATTERN , STRONG_PASSWORD_PATTERN } = validationPatterns 
import { StatusCodes } from 'http-status-codes';

const schema = new Schema<IUser>({
    firstName : {
        type :      String,
        minLength : [3, 'First name must be at least 3 characters'],
        maxLength : [15, 'First name must be at less than 15 characters'],
        required :  [true, 'First name is a required field'],
        trim :      true,
        match :    ALPHABETIC_ONLY_PATTERN.pattern,
        validate(value:string) {
          if (!value.match(ALPHABETIC_ONLY_PATTERN.pattern)) {
            if(ALPHABETIC_ONLY_PATTERN.message instanceof Function)
            throw new ApiError(ALPHABETIC_ONLY_PATTERN.message("First Name"),StatusCodes.BAD_REQUEST);
          }
        },
      },
      lastName : {
        type :      String,
        minLength : [3, 'Last name must be at least 3 characters'],
        maxLength : [15, 'Last name must be at less than 15 characters'],
        required :  [true, 'Last name is a required field'],
        trim :      true,
        match :     ALPHABETIC_ONLY_PATTERN.pattern,
        validate(value:string) {
          if (!value.match(ALPHABETIC_ONLY_PATTERN.pattern)) {
            if(ALPHABETIC_ONLY_PATTERN.message instanceof Function)
            throw new ApiError((ALPHABETIC_ONLY_PATTERN.message("Last Name")),StatusCodes.BAD_REQUEST);
          }
        },
    },
    userName: {
      type: String,
      minLength: [3, 'Username must be at least 3 characters'],
      maxLength: [30, 'Username must be at less than 30 characters'],
      required: [true, 'Username is a required field'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is a required field'],
      unique: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new ApiError('Invalid email', 400);
        }
      },
    },
    password: {
      type: String,
      required: [true, 'Password is a required field'],
      trim: true,
      minlength: [6, 'Password must be at least 6 characters'],
      match: STRONG_PASSWORD_PATTERN.pattern,

      //@iti43OS

      validate(value: string) {
        if (!value.match(STRONG_PASSWORD_PATTERN.pattern)) {
          throw new ApiError(STRONG_PASSWORD_PATTERN.message as string, 400);
        }
      },
    },
    pImage: [{
      type: String,
      default: 'https://res.cloudinary.com/dttgbrris/image/upload/v1681003634/3899618_mkmx9b.png',
    }],
    verified:{
      type:Boolean,
      default: false,
    },
    activatedToken: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
}, {
  timestamps: true,
  versionKey: false,
})

schema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

schema.methods.comparePassword = async function (password: string): Promise<Boolean> {
  return bcryptjs.compare(password, this.password);
};

schema.pre('save', async function () {
  if (this.isModified('password')) 
    this.password = await bcryptjs.hash(this.password, 10);
});

type userType = InferSchemaType<typeof schema>;
const User = model<IUser>('User', schema)

export { User, userType }

import { Router } from "express";
    
import validate from '../middlewares/validation'
import  { usersValidator }  from '../Validation/index'

import { Auth, adminAuth } from "../middlewares/auth";
import { asyncWrapper } from "../lib";

import { userController } from "../controllers";
import { upload } from "../middlewares/upload-image"
const router = Router()

router.post('/register',upload.single("pImage"), validate(usersValidator.signUp) ,asyncWrapper(userController.register))
router.post('/login', validate(usersValidator.signIn) ,asyncWrapper(userController.signIn))
router.delete('/:id' , adminAuth, asyncWrapper(userController.deleteUser))
router.patch('/', Auth , upload.single("pImage"), validate(usersValidator.signUp) ,asyncWrapper(userController.updateUser))
router.get('/',asyncWrapper(userController.getUsers))


export default router;
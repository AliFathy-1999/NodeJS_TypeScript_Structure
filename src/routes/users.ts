import { Router } from 'express';
    
import validate from '../middlewares/validation'
import { searchValidator, usersValidator } from '../Validation/index'

import { Auth, adminAuth, userAuth } from '../middlewares/auth';
import { asyncWrapper } from '../lib';

import { userController } from '../controllers';

import { upload } from '../utils/upload-files-utils';
import clearCacheMW from '../middlewares/clearCache';

const router = Router();

router.delete('/:id', adminAuth, clearCacheMW, asyncWrapper(userController.deleteUser))
router.patch('/', Auth, upload, validate(usersValidator.signUp), clearCacheMW, asyncWrapper(userController.updateUser))
router.get('/search', validate(searchValidator),asyncWrapper(userController.searchUsers))

router.get('/',adminAuth, asyncWrapper(userController.getUsers))
router.get('/qrcode', asyncWrapper(userController.getQrCode))

router.get('/:id', Auth, asyncWrapper(userController.getUserById))



export default router;
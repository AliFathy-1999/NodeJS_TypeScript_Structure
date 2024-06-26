import { Router } from 'express';
import { Auth, userAuth } from '../middlewares/auth';
import { asyncWrapper } from '../lib';
import { postController } from '../controllers';
import validate from '../middlewares/validation';
import { postsValidator } from '../Validation';
import clearCacheMW from '../middlewares/clearCache';

const router = Router();

router.post('/',userAuth,  validate(postsValidator.createPost),clearCacheMW, asyncWrapper(postController.createPost))
router.patch('/:id', Auth,validate(postsValidator.updatePost), clearCacheMW, asyncWrapper(postController.updatePost))
router.get('/',userAuth, asyncWrapper(postController.getPosts))

export default router;
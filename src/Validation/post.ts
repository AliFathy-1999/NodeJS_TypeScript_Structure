import Joi from 'joi';

const createPost = {
    body: Joi.object().keys({
        title: Joi.string()
        .required()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .messages({
            'string.empty': 'Post title is a required field',
            'string.min': 'Post title must be at least 3 characters',
            'string.max': 'Post title must be at most 50 characters',
            'string.pattern.base' : 'Post title must contain only alphabet letter and numbers',
        }),
        content: Joi.string()
        .required()
        .min(3)
        .max(600)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .messages({
            'string.empty': 'Post Content is a required field',
            'string.min': 'Post Content must be at least 3 characters',
            'string.max': 'Post Content must be at most 600 characters',
            'string.pattern.base' : 'Post Content must contain only alphabet letter and numbers',
        }),
    }),
}

const updatePost = {
    body: Joi.object().keys({
        title: Joi.string()
        .optional()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .messages({
            'string.empty': 'Post title is a required field',
            'string.min': 'Post title must be at least 3 characters',
            'string.max': 'Post title must be at most 50 characters',
            'string.pattern.base' : 'Post title must contain only alphabet letter and numbers',
        }),
        content: Joi.string()
        .optional()
        .min(3)
        .max(600)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .messages({
            'string.empty': 'Post Content is a required field',
            'string.min': 'Post Content must be at least 3 characters',
            'string.max': 'Post Content must be at most 600 characters',
            'string.pattern.base' : 'Post Content must contain only alphabet letter and numbers',
        }),
    }),
}


export default {
    createPost,
    updatePost
}

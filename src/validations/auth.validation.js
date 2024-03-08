import Joi from 'joi';

export const registerValidation = {
    body: {
        name: Joi.string()
            .required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .required()
            .min(6)
            .max(128),
    },
};

export const loginValidation = {
    body: {
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .required()
            .max(128),
    },
};

import Joi from 'joi';

export const addVideoValidation = {
    body: {
        title: Joi.string()
            .required(),
        channelId: Joi.number()
            .required()
    },
};
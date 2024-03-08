import Joi from 'joi';

export const addChannelValidation = {
    body: {
        name: Joi.string()
            .required()
    }
};

export const updateChannelValidation = {
    body: {
        channelId: Joi.number(),
        name: Joi.string()
    }
};

export const addVideoValidation = {
    body: {
        title: Joi.string()
            .required(),
        channelId: Joi.number()
            .required()
    },
};

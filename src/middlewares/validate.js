import Joi from 'joi';
import HttpStatus from 'http-status';
import pick from '../utils/pick.js';
import ApiError from '../utils/ApiError.js';

const { BAD_REQUEST } = HttpStatus;

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object);

    if (error) {
         const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
};

export default validate;

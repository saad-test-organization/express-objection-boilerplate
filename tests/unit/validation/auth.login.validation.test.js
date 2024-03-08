import validate from '../../../src/middlewares/validate';
import { loginValidation } from '../../../src/validations/auth.validation';
import HttpStatus from 'http-status';
import ApiError from '../../../src/utils/ApiError';

const { BAD_REQUEST } = HttpStatus;

describe('Login validation middleware', () => {
  it('should pass validation for valid login data', () => {
    const req = {
      body: {
        email: 'fakename@example.com',
        password: 'securePassword123',
      },
    };
    const res = {};
    const next = jest.fn();
    validate(loginValidation)(req, res, next);
    expect(next).toHaveBeenCalled();

    expect(next.mock.calls[0][0]).not.toBeInstanceOf(ApiError);
    expect(req).toHaveProperty('body');
  });

  it('should handle validation error for required email property', () => {
    const req = {
      body: {
       // email: 'john.doe@example.com',
        password: 'securePassword123',
      },
    };
    const res = {};
    const next = jest.fn();

    validate(loginValidation)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const apiError = next.mock.calls[0][0];
    expect(apiError.statusCode).toBe(BAD_REQUEST);
    expect(apiError.message).toContain('"email" is required');
  });

  it('should handle validation error for required password property', () => {
    const req = {
      body: {
        email: 'john.doe@example.com',
        //password: 'securePassword123',
      },
    };
    const res = {};
    const next = jest.fn();

    validate(loginValidation)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const apiError = next.mock.calls[0][0];
    expect(apiError.statusCode).toBe(BAD_REQUEST);
    expect(apiError.message).toContain('"password" is required');
  });
});

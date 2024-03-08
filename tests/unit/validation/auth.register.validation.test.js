import validate from '../../../src/middlewares/validate';
import { registerValidation } from '../../../src/validations/auth.validation';
import HttpStatus from 'http-status';
import ApiError from '../../../src/utils/ApiError';

const { BAD_REQUEST } = HttpStatus;

describe('Register validation middleware', () => {
  it('should pass validation for valid register data', () => {
    const req = {
      body: {
        name: 'Fake Name',
        email: 'fakename@example.com',
        password: 'securePassword123',
      },
    };
    const res = {};
    const next = jest.fn();
    validate(registerValidation)(req, res, next);
    expect(next).toHaveBeenCalled();

    expect(next.mock.calls[0][0]).not.toBeInstanceOf(ApiError);
    expect(req).toHaveProperty('body');
  });

  it('should handle validation error for required name property', () => {
    const req = {
      body: {
       //name: 'Fake Name',
        email: 'fakename@example.com',
        password: 'securePassword123',
      },
    };
    const res = {};
    const next = jest.fn();

    validate(registerValidation)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const apiError = next.mock.calls[0][0];
    expect(apiError.statusCode).toBe(BAD_REQUEST);
    expect(apiError.message).toContain('"name" is required');
  });

  it('should handle validation error for required password property', () => {
    const req = {
      body: {
        name: 'Fake Name',
        email: 'fakename@example.com',
        //password: 'securePassword123',
      },
    };
    const res = {};
    const next = jest.fn();

    validate(registerValidation)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const apiError = next.mock.calls[0][0];
    expect(apiError.statusCode).toBe(BAD_REQUEST);
    expect(apiError.message).toContain('"password" is required');
  });

  it('should handle validation error for required email property', () => {
    const req = {
      body: {
        name: 'Fake Name',
        //email: 'john.doe@example.com',
        password: 'securePassword123',
      },
    };
    const res = {};
    const next = jest.fn();

    validate(registerValidation)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const apiError = next.mock.calls[0][0];
    expect(apiError.statusCode).toBe(BAD_REQUEST);
    expect(apiError.message).toContain('"email" is required');
  });

  it('should handle validation error for required password property', () => {
    const req = {
      body: {
        name: 'Fake Name',
        email: 'john.doe@example.com',
        //password: 'securePassword123',
      },
    };
    const res = {};
    const next = jest.fn();

    validate(registerValidation)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const apiError = next.mock.calls[0][0];
    expect(apiError.statusCode).toBe(BAD_REQUEST);
    expect(apiError.message).toContain('"password" is required');
  });

  it('should handle validation error for password below minimum length', () => {
    const req = {
      body: {
        name: 'Fake Name',
        email: 'john.doe@example.com',
        password: 'pass',
      },
    };
    const res = {};
    const next = jest.fn();
  
    validate(registerValidation)(req, res, next);
  
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const apiError = next.mock.calls[0][0];
    expect(apiError.statusCode).toBe(BAD_REQUEST);
    expect(apiError.message).toContain('"password" length must be at least 6 characters long');
  });

  it('should handle validation error for password above maximum length', () => {
    const req = {
      body: {
        name: 'Fake Name',
        email: 'fakename@example.com',
        password: 'securePassword123'.repeat(20),
      },
    };
    const res = {};
    const next = jest.fn();
  
    validate(registerValidation)(req, res, next);
  
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const apiError = next.mock.calls[0][0];
    expect(apiError.statusCode).toBe(BAD_REQUEST);
    expect(apiError.message).toContain('"password" length must be less than or equal to 128 characters long');
  })

});

import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js'; 
import User from '../../src/db/models/user.js';
import faker from '@faker-js/faker'

// jest.mock('../../src/utils/auth.js', () => ({
//   generateAccessToken: jest.fn(() => 'mocked-access-token'),
//   generateRefreshToken: jest.fn(() => 'mocked-refresh-token')
// }));
let testAccessToken; 
describe('Authentication Controller', () => {
  const testUser = {
    email: 'fake123@example.com',
    password: 'password1',
    name: 'Test User',
    role: 'user',
  };

  beforeAll(async () => {
    await User.query().delete().where({ email: testUser.email });
  });

  afterAll(async () => {
    //await User.query().delete().where({ email: testUser.email });
  });

  describe('POST /register', () => {
    it('should register a new user and return tokens', async () => {
      const response = await request(app)
        .post('/v1/auth/register')
        .send({email: testUser.email, password: testUser.password, name: testUser.name})
        .expect(httpStatus.CREATED);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).toHaveProperty('name', testUser.name);
      expect(response.body.user).toHaveProperty('role', testUser.role);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });


    it('should return a 409 status if the email already exists', async () => {

      const response = await request(app)
        .post('/v1/auth/register')
        .send({email:testUser.email, password: testUser.password, name: testUser.name})
        .expect(httpStatus.CONFLICT);

      expect(response.body).toHaveProperty('message', 'Email already exists');
    });

  });

  describe('POST /login', () => {
    it('should login a user and return tokens', async () => {

      const response = await request(app)
        .post('/v1/auth/login')
        .send({
            email: testUser.email,
            password: testUser.password
           })
        .expect(httpStatus.OK);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).toHaveProperty('name', testUser.name);
      expect(response.body.user).toHaveProperty('role', testUser.role);
      expect(response.body.tokens).toHaveProperty('access.token');
      expect(response.body.tokens).toHaveProperty('refresh.token');

      testAccessToken = response.body.tokens.access.token;
    });

    it('should return a 401 status if the credentials are invalid', async () => {
      const response = await request(app)
        .post('/v1/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'invalidpassword' })
        .expect(httpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

  });
})
export { testAccessToken };
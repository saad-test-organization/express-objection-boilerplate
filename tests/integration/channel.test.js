import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app';
import Channel from '../../src/db/models/channel';
import { testAccessToken } from './auth.test';

const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiZmFrZUBleGFtcGxlLmNvbSIsImlhdCI6MTcwOTcyMzYyMiwiZXhwIjoxNzA5NzI3MjIyfQ.YeG4LCExTbasBl78-oVc_704rh4ZcF899lZ-j9yCAno';

jest.mock('../../src/utils/messagePublisher', () => ({
  sendMessageToQueue: jest.fn(),
}));

describe('Channel Controller', () => {
  const testChannel = {
    name: 'Fake Channel',
  };

  beforeAll(async () => {
    await Channel.query().delete().where({ name: testChannel.name });
  });

  afterAll(async () => {
    await Channel.query().delete().where({ name: testChannel.name });
  });

  describe('POST /channel', () => {
    it('should add a new channel for the authenticated user', async () => {
      const response = await request(app)
        .post('/v1/channel')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ name: testChannel.name })
        .expect(httpStatus.CREATED);

      expect(response.body).toHaveProperty('message', 'Channel added successfully');
    });

    it('should return a conflict status if the user already has a channel', async () => {
      const response = await request(app)
        .post('/v1/channel')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ name: testChannel.name })
        .expect(httpStatus.CONFLICT);

      expect(response.body).toHaveProperty('message', 'User already has a channel');
    });
  });

  describe('GET /channel/:channelId', () => {
    it('should retrieve the specific channel for the authenticated user', async () => {
      const channel = await Channel.query().insertAndFetch({ name: testChannel.name});

      const response = await request(app)
        .get(`/v1/channel/${channel.id}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .expect(httpStatus.OK);

      expect(response.body).toHaveProperty('channel');
    });

    it('should return a not found status if the channel is not found', async () => {
      const invalidChannelId = 9999999;
      const response = await request(app)
        .get(`/v1/channel/${invalidChannelId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .expect(httpStatus.NOT_FOUND);

      expect(response.body).toHaveProperty('message', 'Channel not found');
    });
  });

  describe('PUT /channel', () => {
    beforeAll(async () => {
      await Channel.query().delete().where({ name: 'Updated Channel' });
    });
  
    afterAll(async () => {
      await Channel.query().delete().where({ name: 'Updated Channel' });
    });
    it('should update the channel for the authenticated user', async () => {
      const updatedChannelName = 'Updated Channel';
      const channel = await Channel.query().insertAndFetch({ name: 'Old Channel' });

      const response = await request(app)
        .put('/v1/channel')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ name: updatedChannelName, channelId: channel.id })
        .expect(httpStatus.OK);

      expect(response.body).toHaveProperty('message', 'Channel updated successfully');
    });

    it('should return a not found status if the channel is not found', async () => {
      const invalidChannelId = 9999999;
      const response = await request(app)
        .put('/v1/channel')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ name: 'Updated Channel', channelId: invalidChannelId })
        .expect(httpStatus.NOT_FOUND);

      expect(response.body).toHaveProperty('message', 'Channel not found');
    });
  });

  describe('DELETE /channel/:channelId', () => {
    beforeAll(async () => {
      await Channel.query().delete().where({ name: 'Test Channel' });
    });
  
    afterAll(async () => {
      await Channel.query().delete().where({ name: 'Test Channel' });
    });
    it('should delete the specific channel and its associated videos for the authenticated user', async () => {
      const channel = await Channel.query().insertAndFetch({ name: 'Test Channel' });

      const response = await request(app)
        .delete(`/v1/channel/${channel.id}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .expect(httpStatus.OK);

      expect(response.body).toHaveProperty('message', 'Channel and associated videos deleted successfully');
    });

    it('should return a not found status if the channel is not found', async () => {
      const invalidChannelId = 9999999;
      const response = await request(app)
        .delete(`/v1/channel/${invalidChannelId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .expect(httpStatus.NOT_FOUND);

      expect(response.body).toHaveProperty('message', 'Channel not found');
    });
  });

  describe('DELETE /channel/deleteWithTransaction/:channelId', () => {
    beforeAll(async () => {
      await Channel.query().delete().where({ name: 'Test Channel trx' });
    });
  
    afterAll(async () => {
      await Channel.query().delete().where({ name: 'Test Channel trx' });
    });
    it('should delete the specific channel and its associated videos for the authenticated user', async () => {
      const channel = await Channel.query().insertAndFetch({ name: 'Test Channel trx' });

      const response = await request(app)
        .delete(`/v1/channel/deleteWithTransaction/${channel.id}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .expect(httpStatus.OK);

      expect(response.body).toHaveProperty('message', 'Channel and associated videos deleted successfully');
    });

    it('should return a not found status if the channel is not found', async () => {
      const invalidChannelId = 9999999;
      const response = await request(app)
        .delete(`/v1/channel/deleteWithTransaction/${invalidChannelId}`)
        .set('Authorization', `Bearer ${testAccessToken}`)
        .expect(httpStatus.NOT_FOUND);

      expect(response.body).toHaveProperty('message', 'Channel not found');
    });
  });
});

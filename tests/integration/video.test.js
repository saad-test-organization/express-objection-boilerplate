import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app';
import User from '../../src/db/models/user';
import Channel from '../../src/db/models/channel';
import Video from '../../src/db/models/video';
import { testAccessToken } from './auth.test';

jest.mock('../../src/utils/messagePublisher', () => ({
  sendMessageToQueue: jest.fn(),
}));

let channel;

describe('Video Controller', () => {
  const testChannel = {
    name: 'Test Channel',
  };

  const testVideo = {
    title: 'Test Video',
  };

  beforeAll(async () => {
    channel = await Channel.query().insertAndFetch({ name: 'Test Channel' })
    //await Channel.query().delete().where({ name: testChannel.name });
    await Video.query().delete().where({ title: testVideo.title });
  });

  afterAll(async () => {
    //await Channel.query().delete().where({ name: testChannel.name });
    await Video.query().delete().where({ title: testVideo.title });
  });

  describe('POST /video', () => {
    // beforeAll(async () => {
     
    //   await Video.query().delete().where({ title: testVideo.title });
    //    //channel = await Channel.query().insertAndFetch({ name: testChannel.name});
    // });
    // afterAll(async () => {
    // //  await Channel.query().delete().where({ name: testChannel.name });
    //   await Video.query().delete().where({ title: testVideo.title });
    // });
  
   
    it('should add a new video to the channel associated with the authenticated user', async () => {
     // const newChannel = await Channel.query().insertAndFetch({ name: 'Test Channel' });

      const response = await request(app)
        .post('/v1/video')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({channelId: channel.id, title: 'Test Video' })
        .expect(httpStatus.CREATED);

      expect(response.body).toHaveProperty('message', 'Video added successfully');
      expect(response.body).toHaveProperty('video');
    });

    it('should return a bad request status if the video title is not provided', async () => {
      const response = await request(app)
        .post('/v1/video')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty('message', 'Video title and channelId is required');
    });

    it('should return a not found status if the user or associated channel is not found', async () => {
      let channelId = 999999;
      const response = await request(app)
        .post('/v1/video')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({channelId: channelId, title: 'Test Video' })
        .expect(httpStatus.NOT_FOUND);

      expect(response.body).toHaveProperty('message', 'Channel not found');
    });
  });

  describe('PUT /video/:videoId', () => {
    it('should update or insert a video into a channel', async () => {
      //const newChannel = await Channel.query().insertAndFetch({ name: 'Test Channel' });

      const response = await request(app)
        .put('/v1/video')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ channelId: channel.id, title: 'Test Video' })
        .expect(httpStatus.OK);

      expect(response.body).toHaveProperty('message', 'Video upserted successfully');
      expect(response.body).toHaveProperty('video');
    });

    it('should return a bad request status if the channel ID and title are not provided', async () => {
      const response = await request(app)
        .put('/v1/video')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty('message', 'Channel ID and title are required');
    });
  });

  describe('POST /video/addChannelWithVideo', () => {
    beforeAll(async () => {
      await Video.query().delete().where({ title: testVideo.title });
      await Channel.query().delete().where({ name: testChannel.name });
    });

    afterAll(async () => {
      await Video.query().delete().where({ title: testVideo.title });
      await Channel.query().delete().where({ name: testChannel.name });
    });
  
  
    it('should add a new channel along with a video if the user doesn\'t have a channel already', async () => {
      const response = await request(app)
        .post('/v1/video/addChannelWithVideo')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({channelName: 'Test Channel', videoTitle: 'Test Video' })
        .expect(httpStatus.CREATED);

      expect(response.body).toHaveProperty('message', 'Channel added successfully');
      expect(response.body).toHaveProperty('channel');
    });

    it('should return a conflict status if the user already has a channel', async () => {
      //const existingChannel = await Channel.query().insertAndFetch({ name: 'Existing Test Channel' });
      //const existingUser = await User.query().insertAndFetch({ channelId: existingChannel.id });

      const response = await request(app)
        .post('/v1/video/addChannelWithVideo')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .send({ channelName: 'Test Channel', videoTitle: 'Test Video' })
        .expect(httpStatus.CONFLICT);

      expect(response.body).toHaveProperty('message', 'User already has a channel');
    });

    it('should return a bad request status if the channel name or video title is not provided', async () => {
      const response = await request(app)
        .post('/v1/video/addChannelWithVideo')
        .set('Authorization', `Bearer ${testAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty('message', 'Channel name and video title are required');
    });
  });
});

import httpStatus from 'http-status';
import User from '../db/models/user.js';
import Video from '../db/models/video.js';
import Channel from '../db/models/channel.js';
import { sendMessageToQueue, topicExchangePublisher } from '../utils/messagePublisher.js';

/**
 * Adds a new video to the channel associated with the authenticated user
 * @public
 */
export const addVideo = async (req, res, next) => {
    try {
      const { title, id } = req.body;
      const userId = req.userId;
  
      if (!title || !id) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'Video title and id is required' });
      }
  
      const channel = await Channel.query().findById(id);
  
      if (!channel) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Channel not found' });
      }
  
      const newVideo = await Video.query().insertAndFetch({
        title,
        id: channel.id,
      });
  
      const message = {
        userId: userId,
        id: newVideo.id,
        title: newVideo.title,
      };
      await sendMessageToQueue(message);
      await topicExchangePublisher(message)
  
      res.status(httpStatus.CREATED);
      return res.json({ message: 'Video added successfully', video: newVideo });
    } catch (error) {
      console.error('Error: ', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  };
  
/**
 * Adds a new channel along with a video if the user doesn't have a channel already
 * @public
 */
export const addChannelWithVideo = async (req, res, next) => {
  try {
    const { channelName, videoTitle} = req.body;
    const userId = req.userId; // Assuming you have the user's ID in the request

    if (!channelName || !videoTitle) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Channel name and video title are required' });
    }

    const existingUser = await User.query().findById(userId).withGraphFetched('channel');

    if (existingUser && existingUser.channel) {
      return res.status(httpStatus.CONFLICT).json({ message: 'User already has a channel' });
    }

    const channelGraph = {
      name: channelName,
      videos: [{ title: videoTitle }],
    };

    const insertedChannel = await Channel.query().insertGraph(channelGraph);

    await User.query().patch({ id: insertedChannel.id }).where({ id: userId });

    res.status(httpStatus.CREATED).json({ message: 'Channel added successfully', channel: insertedChannel });
  } catch (error) {
    console.error('Error: ', error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }
};

/**
 * Updates or inserts a video into a channel
 * @public
 */
export const updateOrInsertVideo = async (req, res, next) => {
    try {
      const { id, title } = req.body;
      const videoId = req.params.videoId;
  
      if (!title) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'Channel ID and title are required' });
      }
  
      const videoGraph = {
        id: videoId,
        title,
        id,
      };
  
      const insertedVideo = await Video.query().upsertGraph([videoGraph], { relate: true });
  
      res.status(httpStatus.OK).json({ message: 'Video upserted successfully', video: insertedVideo });
    } catch (error) {
      console.error('Error: ', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  };
import httpStatus from 'http-status';
import Channel from '../db/models/channel.js';
import User from '../db/models/user.js';
import Video from '../db/models/video.js';
import { transaction } from 'objection';

/**
 * Adds a new channel for the authenticated user
 * @public
 */
export const addChannel = async (req, res, next) => {
    try {
      const { name } = req.body;
  
      const existingUser = await User.query().findOne({ id: req.userId });
      if (existingUser.id) {
        return res.status(httpStatus.CONFLICT).json({ message: 'User already has a channel' });
      }

      const newChannel = await Channel.query().insertAndFetch({ name: name });
  
      await User.query().patch({ id: newChannel.id }).where({ id: req.userId });
  
      res.status(httpStatus.CREATED);
      return res.json({ message: 'Channel added successfully' });
    } catch (error) {
      console.error("Error: ", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
};


// /**
//  * Adds a new video to the channel associated with the authenticated user
//  * @public
//  */
// export const addVideo = async (req, res, next) => {
//   try {
//     const { title } = req.body;
//     const userId = req.userId;

//     if (!title) {
//       return res.status(httpStatus.BAD_REQUEST).json({ message: 'Video title is required' });
//     }

//     const user = await User.query().findById(userId);
//     if (!user || !user.id) {
//       return res.status(httpStatus.NOT_FOUND).json({ message: 'User or associated channel not found' });
//     }

//     const newVideo = await Video.query().insertAndFetch({
//       title,
//       id: user.id,
//     });

//     const message = {
//       userId: user.id,
//       id: newVideo.id,
//       title: newVideo.title
//     };
//     await sendMessageToQueue(message);

//     res.status(httpStatus.CREATED);
//     return res.json({ message: 'Video added successfully', video: newVideo });
//   } catch (error) {
//     console.error('Error: ', error);
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
//   }
// };

/**
 * Update a existing channel for the authenticated user
 * @public
 */
export const updateChannel = async (req, res, next) => {
  try {

    const { name, id } = req.body;

    const channel = await Channel.query().findById(id);

    if (!channel) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Channel not found' });
    }

    await Channel.query().patch({ name }).where({ id: id});

    res.json({ message: 'Channel updated successfully' });
  } catch (error) {
    console.error('Error: ', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }
};

/**
 * Get a existing channel for the authenticated user
 * @public
 */
export const getChannel = async (req, res, next) => {
  try {
    const id= req.params.id;
    const channel = await Channel.query().findById(id);

    if (!channel) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Channel not found' });
    }

    res.json({ channel: channel });
  } catch (error) {
    console.error('Error: ', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }
};

/**
 * Deletes a channel and its associated videos
 * @public
 */
export const deleteChannel = async (req, res, next) => {
  try {
    const id = req.params.id;

    const channel = await Channel.query().findById(id);

    if (!channel) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Channel not found' });
    }

    await Video.query().delete().where({ id: channel.id });
    await Channel.query().deleteById(channel.id);

    res.json({ message: 'Channel and associated videos deleted successfully' });
  } catch (error) {
    console.error('Error: ', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }
};


// every api should send 200 ok reponse
// 

export const deleteChannelUsingTrx = async (req, res, next) => {
  try { 

    await transaction(User.knex(), async (trx) => {
      const id = req.params.id;

      const channel = await Channel.query().findById(id);
  
      if (!channel) { 
        res.status(httpStatus.NOT_FOUND).json({ message: 'Channel not found' });
     } else {
        await Video.query(trx).delete().where({ id: channel.id });
        await Channel.query(trx).deleteById(channel.id);
        res.json({ message: 'Channel and associated videos deleted successfully' });
      }
    });
 
  } catch (error) {
    console.error('Error: ', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }
};
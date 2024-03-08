import { Router } from 'express';
import validate from '../../middlewares/validate.js';
import {addChannelValidation, addVideoValidation, updateChannelValidation} from '../../validations/channel.validation.js';
import {addChannel, getChannel, updateChannel, deleteChannel, deleteChannelUsingTrx} from '../../controllers/channel.controller.js';
import { auth } from '../../middlewares/auth.js';

const router = Router();

router.post('/', auth, validate(addChannelValidation), addChannel);
router.put('/', auth,validate(updateChannelValidation), updateChannel);
router.get('/:id?', auth, getChannel);
router.delete('/:id?', auth, deleteChannel);
//router.delete('/deleteWithTransaction/:id?', auth, deleteChannelUsingTrx);
// router.post('/video', auth, validate(addVideoValidation), addVideo);


export default router;

/**
 * @swagger
 * tags:
 *   name: Channel
 *   description: User Channel
 */

/**
 * @swagger
 * /v1/channel:
 *   post:
 *     summary: Add a new channel
 *     tags: [Channel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: Channel 1 
 *     responses:
 *       "201":
 *         description: Channel added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 channel:
 *                   $ref: '#/components/schemas/Channel'
 *       "404":
 *         description: User not found
 */


/**
 * @swagger
 * /v1/channel/video:
 *   post:
 *     summary: Add Video
 *     tags: [Channel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - id
 *             properties:
 *               title:
 *                 type: string
 *               id:
 *                 type: number
 *             example:
 *               title: Fake Video
 *               id: 1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

/**
 * @swagger
 * /v1/channel:
 *   put:
 *     summary: Add or Update the user's channel
 *     tags: [Channel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - id
 *             properties:
 *               id:
 *                 type: number
 *               name:
 *                 type: string
 *             example:
 *               id: 12
 *               name: Channel 1 
 *     responses:
 *       "201":
 *         description: Channel added or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 channel:
 *                   $ref: '#/components/schemas/Channel'
 * 
 *       "404":
 *         description: User or associated channel not found
 */

/**
 * @swagger
 * /v1/channel/{id}:
 *   get:
 *     summary: Get user's channel information
 *     tags: [Channel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         description: ID of the channel to be deleted.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *         description: Channel information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 channel:
 *                   $ref: '#/components/schemas/Channel'
 *       "404":
 *         description: User or associated channel not found
 */


/**
 * @swagger
 * /v1/channel/{id}:
 *   delete:
 *     summary: Delete the user's channel
 *     tags: [Channel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         description: ID of the channel to be deleted.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *         description: Channel and associated videos deleted successfully
 *       "404":
 *         description: User or associated channel not found
 */

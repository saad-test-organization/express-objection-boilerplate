import { Router } from 'express';

import { addVideo, updateOrInsertVideo, addChannelWithVideo } from '../../controllers/video.controller.js';
import { auth } from '../../middlewares/auth.js';

const router = Router();

router.post('/', auth, addVideo);
router.put('/:id?', auth, updateOrInsertVideo);
//router.post('/addChannelWithVideo', auth, addChannelWithVideo);

/**
 * @swagger
 * tags:
 *   name: Video
 *   description: Channel Videos
 */

/**
 * @swagger
 * /v1/video/:
 *   post:
 *     summary: Add a new video
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tittle
 *               - channelId
 *             properties:
 *               tittle:
 *                 type: string
 *               channelId:
 *                 type: number
 *             example:
 *               title: fake video
 *               channelId: 12
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /v1/video/{id}:
 *   put:
 *     summary: Add a new video
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         description: ID of the video to update. Omit for creating a new video.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             
 *             properties:
 *               title:
 *                 type: string
 *               channelId:
 *                 type: number
 *             example:
 *               title: fake video
 *               channelId: 1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /v1/video/addChannelWithVideo:
 *   post:
 *     summary: Add a new channel along with a video
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - channelName
 *               - videoTitle
 *             properties:
 *               channelName:
 *                 type: string
 *               videoTitle:
 *                 type: string
 *             example:
 *               channelName: Fake Channel 2
 *               videoTitle: Fake Video 4
 *     responses:
 *       "201":
 *         description: Channel and video added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Channel added successfully
 *                 channel:
 *                   $ref: '#/components/schemas/Channel'
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */ 
export default router
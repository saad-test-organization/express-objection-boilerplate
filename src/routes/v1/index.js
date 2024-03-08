import { Router } from 'express';
import authRoutes from './auth.route.js';
import channelRoutes from './channel.route.js'
import videoRoutes from "./video.route.js"

const router = Router();

const defaultRoutes = [
    {
      path: '/auth',
      route: authRoutes,
    },
    {
      path: '/channel',
      route: channelRoutes,
    },
    {
      path: '/video',
      route: videoRoutes,
    },
  ];
  
  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
  
export default router;
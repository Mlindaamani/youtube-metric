
import express from 'express';
import { 
  getChannelInfo, 
  addChannelController, 
  updateChannelController, 
  deleteChannel 
} from '@/modules/channel/channel.controller.ts';
import { authMiddleware } from '@/middleware/authMiddleware.ts';

const router = express.Router();
// router.use(authMiddleware);

router.get('/info', getChannelInfo);
router.post('/', addChannelController);
router.put('/:channelId', updateChannelController);
router.delete('/:channelId', deleteChannel);

export default router;
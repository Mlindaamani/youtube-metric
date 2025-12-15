
import type { Request, Response } from 'express';
import { getChannel, getChannelInfoFromYouTube, addChannel, updateChannel } from '@/modules/channel/channel.service.ts';
import Channel from '@/modules/channel/channel.model.ts';
import { catchAsync } from '@/middleware/errorHandler.ts';


export const getChannelInfo = catchAsync(async (req: Request, res: Response) => {
  const channel = await getChannel();
  if (!channel) {
    return res.status(404).json({ 
      success: false,
      message: 'No channel registered' 
    });
  }

  const liveInfo = await getChannelInfoFromYouTube();

  res.json({
    success: true,
    data: {
      ...channel.toObject(),
      liveStats: liveInfo,
    }
  });
});

export const addChannelController = catchAsync(async (req: Request, res: Response) => {
  const { channelId, title, description, thumbnailUrl, refreshToken, customName } = req.body;

  // Validate required fields
  if (!channelId || !title || !refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Channel ID, title, and refresh token are required'
    });
  }

  const channel = await addChannel({
    channelId,
    title,
    description,
    thumbnailUrl,
    refreshToken,
    customName
  });

  res.status(201).json({
    success: true,
    message: 'Channel registered successfully',
    data: channel
  });
});

export const updateChannelController = catchAsync(async (req: Request, res: Response) => {
  const { channelId } = req.params;
  const { title, description, thumbnailUrl, customName } = req.body;

  if (!channelId) {
    return res.status(400).json({
      success: false,
      message: 'Channel ID is required'
    });
  }

  const channel = await updateChannel(channelId, {
    title,
    description,
    thumbnailUrl,
    customName
  });

  res.json({
    success: true,
    message: 'Channel updated successfully',
    data: channel
  });
});

export const deleteChannel = catchAsync(async (req: Request, res: Response) => {
  const { channelId } = req.params;
  
  if (!channelId) {
    return res.status(400).json({
      success: false,
      message: 'Channel ID is required'
    });
  }
  
  const channel = await Channel.findOneAndDelete({ channelId });
  if (!channel) {
    return res.status(404).json({
      success: false,
      message: 'Channel not found'
    });
  }

  res.json({
    success: true,
    message: 'Channel deleted successfully'
  });
});
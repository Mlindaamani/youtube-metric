
import Channel from '@/modules/channel/channel.model.ts';
import { google } from 'googleapis';

const getAuthClient = (refreshToken: string) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
};

export const getChannel = async () => await Channel.findOne();

export const addChannel = async (channelData: {
  channelId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  refreshToken: string;
  customName?: string;
}) => {
  // Check if channel already exists
  const existingChannel = await Channel.findOne({ channelId: channelData.channelId });
  if (existingChannel) {
    throw new Error('Channel already registered');
  }

  // Create and save new channel
  const channel = new Channel(channelData);
  return await channel.save();
};

export const updateChannel = async (channelId: string, updateData: Partial<{
  title: string;
  description: string;
  thumbnailUrl: string;
  customName: string;
}>) => {
  const channel = await Channel.findOneAndUpdate(
    { channelId },
    updateData,
    { new: true }
  );
  
  if (!channel) {
    throw new Error('Channel not found');
  }
  
  return channel;
};

export const getChannelInfoFromYouTube = async () => {
  const channel = await getChannel();
  if (!channel) throw new Error('No channel registered');

  const auth = getAuthClient(channel.refreshToken);
  const youtube = google.youtube('v3');

  const res = await youtube.channels.list({
    auth,
    part: ['snippet', 'statistics'],
    mine: true,
  });

  const ytChannel = res.data.items?.[0];
  if (!ytChannel) throw new Error('Channel not found');

  return {
    title: ytChannel.snippet?.title,
    thumbnailUrl: ytChannel.snippet?.thumbnails?.high?.url,
    viewCount: ytChannel.statistics?.viewCount,
    subscriberCount: ytChannel.statistics?.subscriberCount,
    videoCount: ytChannel.statistics?.videoCount,
  };
};
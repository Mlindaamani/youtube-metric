import api from "./index";
import { ApiResponse, ChannelInfo, Channel } from "../types";

export const channelAPI = {
  // Get channel information with live stats
  getInfo: async (): Promise<ChannelInfo> => {
    const response = await api.get<ApiResponse<ChannelInfo>>("/channel/info");
    return response.data.data!;
  },

  // Add a new channel
  addChannel: async (channelData: {
    channelId: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    refreshToken: string;
    customName?: string;
  }): Promise<Channel> => {
    const response = await api.post<ApiResponse<Channel>>(
      "/channel",
      channelData
    );
    return response.data.data!;
  },

  // Update channel information
  updateChannel: async (
    channelId: string,
    updateData: {
      title?: string;
      description?: string;
      thumbnailUrl?: string;
      customName?: string;
    }
  ): Promise<Channel> => {
    const response = await api.put<ApiResponse<Channel>>(
      `/channel/${channelId}`,
      updateData
    );
    return response.data.data!;
  },

  // Delete channel
  deleteChannel: async (channelId: string): Promise<void> => {
    await api.delete(`/channel/${channelId}`);
  },
};

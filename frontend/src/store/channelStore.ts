/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { toast } from 'sonner';
import { channelAPI } from '../api/channel';
import { ChannelInfo } from '../types';

interface ChannelState {
  current: ChannelInfo | null;
  loading: boolean;
  error: string | null;
  lastFetchTime: number;
}

interface ChannelActions {
  fetchChannelInfo: () => Promise<void>;
  updateChannel: (channelId: string, updateData: any) => Promise<void>;
  setChannelLoading: (loading: boolean) => void;
  setChannelError: (error: string | null) => void;
  clearChannel: () => void;
}

type ChannelStore = ChannelState & ChannelActions;

export const useChannelStore = create<ChannelStore>((set, get) => ({
  // Initial state
  current: null,
  loading: false,
  error: null,
  lastFetchTime: 0,

  // Actions
  fetchChannelInfo: async () => {
    const state = get();
    const now = Date.now();
    
    // Prevent duplicate calls within 10 seconds
    if (state.loading || (now - state.lastFetchTime) < 10000) {
      return;
    }
    
    try {
      set({ loading: true, error: null, lastFetchTime: now });
      const channelInfo = await channelAPI.getInfo();
      set({ 
        current: channelInfo, 
        loading: false,
        error: null
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch channel info';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      if (error.response?.status !== 404) {
        toast.error(errorMessage);
      }
    }
  },

  updateChannel: async (channelId: string, updateData: any) => {
    try {
      const updatedChannel = await channelAPI.updateChannel(channelId, updateData);
      const currentChannel = get().current;
      
      set({
        current: currentChannel ? {
          ...currentChannel,
          ...updatedChannel
        } : null
      });
      toast.success('Channel updated successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update channel';
      toast.error(errorMessage);
      throw error;
    }
  },

  setChannelLoading: (loading: boolean) => {
    set({ loading });
  },

  setChannelError: (error: string | null) => {
    set({ error });
  },

  clearChannel: () => {
    set({ 
      current: null,
      loading: false,
      error: null,
      lastFetchTime: 0
    });
  },
}));
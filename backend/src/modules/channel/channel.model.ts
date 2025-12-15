
import mongoose from 'mongoose';

const ChannelSchema = new mongoose.Schema(
  {
    channelId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    thumbnailUrl: String,
    refreshToken: { type: String, required: true },
    customName: String,
  },
  { timestamps: true }
);

export default mongoose.model('Channel', ChannelSchema);
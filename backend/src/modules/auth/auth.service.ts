import Channel from "@/modules/channel/channel.model.ts";

export const registerOrUpdateChannel = async (
  profile: any,
  refreshToken: string
) => {
  const channelId = profile.id;

  let channel = await Channel.findOne({ channelId });

  if (channel) {
    channel.refreshToken = refreshToken;
    await channel.save();
  } else {
    channel = new Channel({
      channelId,
      title: profile.displayName || "Unknown Channel",
      refreshToken,
    });
    await channel.save();
  }

  return channel;
};

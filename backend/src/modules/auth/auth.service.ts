import Channel from "@/modules/channel/channel.model.ts";

export const registerOrUpdateChannel = async (
  profile: any,
  refreshToken: string
) => {
  if (!refreshToken) {
    throw new Error(
      "Refresh token is required but not provided by Google. Please revoke app permissions in Google Account settings and try again."
    );
  }

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

import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "@/config/index.ts";
import Channel from "@/modules/channel/channel.model.ts";
import {
  authCallbackHandler,
  getAuthStatus,
  logout,
} from "@/modules/auth/auth.controller.ts";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.redirectUri,
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/youtube.readonly",
      ],
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (err: any, user?: any) => void
    ) => {
      return done(null, { accessToken, refreshToken, profile });
    }
  )
);

// Serialize user by storing the channel ID and tokens
passport.serializeUser((user: any, done) => {
  done(null, {
    channelId: user.profile.id,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken
  });
});

// Deserialize user by looking up the channel in the database
passport.deserializeUser(async (user: any, done) => {
  try {
    const channel = await Channel.findOne({ channelId: user.channelId });
    if (channel) {
      done(null, {
        channelId: user.channelId,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken || channel.refreshToken,
      });
    } else {
      done(null, null);
    }
  } catch (error) {
    done(error);
  }
});

const router = express.Router();

router.get("/status", getAuthStatus);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/youtube.readonly",
    ],
    accessType: "offline",
    prompt: "consent",
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authCallbackHandler
);
router.post("/logout", logout);

export default router;

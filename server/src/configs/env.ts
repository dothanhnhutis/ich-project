import dotenv from "dotenv";
import z from "zod";

dotenv.config({});

const envSchema = z.object({
  NODE_ENV: z.string(),
  SESSION_KEY_NAME: z.string(),
  SESSION_SECRET_KEY: z.string(),
  SESSION_MAX_AGE: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
  GOOGLE_REFRESH_TOKEN: z.string(),
  FACEBOOK_CLIENT_ID: z.string(),
  FACEBOOK_CLIENT_SECRET: z.string(),
  REDIS_HOST: z.string(),
  CLIENT_URL: z.string(),
  SERVER_URL: z.string(),
  JWT_SECRET: z.string(),
  SENDER_EMAIL: z.string(),
  APP_ICON: z.string(),
  CLOUDINARY_NAME: z.string(),
  CLOUDINARY_KEY: z.string(),
  CLOUDINARY_SECRET: z.string(),
  RABBITMQ_URL: z.string(),
});

const configParser = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  SESSION_KEY_NAME: process.env.SESSION_KEY_NAME,
  SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
  SESSION_MAX_AGE: process.env.SESSION_MAX_AGE,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  REDIS_HOST: process.env.REDIS_HOST,
  CLIENT_URL: process.env.CLIENT_URL,
  SERVER_URL: process.env.SERVER_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SENDER_EMAIL: process.env.SENDER_EMAIL,
  APP_ICON: process.env.APP_ICON,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
});

if (!configParser.success) {
  console.error(configParser.error.issues);
  throw new Error("The values in the env file are invalid");
}

export default configParser.data;

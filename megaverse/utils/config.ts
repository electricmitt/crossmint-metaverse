import dotenv from 'dotenv';
dotenv.config();

export const getConfig = () => {
  const apiKey = process.env.MEGAVERSE_API_KEY;
  const baseUrl = process.env.MEGAVERSE_API_BASE_URL;

  if (!apiKey) {
    throw new Error('Missing MEGAVERSE_API_KEY in environment variables');
  }
  if (!baseUrl) {
    throw new Error('Missing MEGAVERSE_API_BASE_URL in environment variables');
  }

  return {
    apiKey,
    baseUrl,
  };
}; 
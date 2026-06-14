function getConfig(): {
  database: { uri?: string };
  port: number;
  jwt: { secret?: string; expires: string };
  cloudinary: { cloudName?: string; apiKey?: string; apiSecret?: string };
} {
  return {
    database: {
      uri: process.env.MONGODB_URI,
    },
    port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
    // JWT
    jwt: {
      secret: process.env.JWT_SECRET,
      expires: process.env.JWT_EXPIRES || '1d',
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
  };
}

export default getConfig;

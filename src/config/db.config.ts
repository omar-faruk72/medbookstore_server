function getConfig(): {
  database: { uri?: string };
  port: number;
  jwt: { secret?: string; expires: string };
} {
  return {
    database: {
      uri: process.env.MONGODB_URI,
    },
    port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
    // JWT কনফিগ এখানে যোগ করুন
    jwt: {
      secret: process.env.JWT_SECRET,
      expires: process.env.JWT_EXPIRES || '1d',
    },
  };
}

export default getConfig;

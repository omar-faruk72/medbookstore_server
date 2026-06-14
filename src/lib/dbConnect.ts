import mongoose from 'mongoose';
import getConfig from 'src/config/db.config';

const config = getConfig();
const MONGODB_URI = config.database.uri;

if (!MONGODB_URI) {
  console.error('❌ Error: .env.local ফাইলে MONGODB_URI খুঁজে পাওয়া যায়নি!');
  process.exit(1);
}
interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseGlobal: MongooseGlobal | undefined;
}

let cached = globalThis.mongooseGlobal;

if (!cached) {
  cached = globalThis.mongooseGlobal = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  if (!cached) {
    throw new Error('Mongoose cached object is missing.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('🔄 MongoDB-র সাথে কানেক্ট হওয়ার চেষ্টা করা হচ্ছে...');

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        console.log('==================================================');
        console.log('✅ MongoDB Connected Successfully!');
        console.log(
          `📂 Database Name: ${mongooseInstance.connection.name.toUpperCase()}`,
        );
        console.log('==================================================');
        return mongooseInstance;
      })
      .catch((error: Error) => {
        console.error('==================================================');
        console.error('❌ MongoDB Connection Failed!');
        console.error(`Reason: ${error.message}`);
        console.error('==================================================');
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

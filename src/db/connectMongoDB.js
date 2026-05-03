import mongoose from 'mongoose';

// import { Note } from '../models/note.js';

export async function connectMongoDB() {
  try {
    const url = process.env.MONGO_URL;
    await mongoose.connect(url);
    console.log('✅ MongoDB connection established successfully');

    // await Note.syncIndexes();
    // console.log('✅ Index synchronization successful');
  } catch (error) {
    console.log(`❌ Error connect Mongo DB: ${error.message}`);
    process.exit(1);
  }
}

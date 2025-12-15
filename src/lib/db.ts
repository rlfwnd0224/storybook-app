import mongoose, { Schema, Model } from 'mongoose';

export interface Book {
  id: string; // Custom ID (e.g., 'story-123')
  title: string;
  author: string;
  coverUrl: string;
  pageCount: number;
  createdAt: string;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imageUrl: string;
}

export interface Story {
  id: string;
  title: string;
  pages: StoryPage[];
}

// Unified interface for Mongoose Document
interface IBook extends Book {
  pages: StoryPage[];
}

// Mongoose Schema
const StoryPageSchema = new Schema<StoryPage>({
  pageNumber: { type: Number, required: true },
  text: { type: String, default: '' },
  imageUrl: { type: String, default: '' }
}, { _id: false });

const BookSchema = new Schema<IBook>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  coverUrl: { type: String, required: true },
  pageCount: { type: Number, required: true },
  createdAt: { type: String, required: true },
  pages: [StoryPageSchema]
});

// Singleton Model (prevent overwrite compile error during HMR)
const BookModel: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

// Connection Caching for Next.js
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
  // Warn in dev, throw in prod (actually we need it in dev too but we'll handle gracefully if missing so app simple crashes or warns)
  console.error("MONGODB_URI is not defined.");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    // Fallback / Warning mechanism?
    // For now, if no URI is provided, we can't save.
    console.warn("MONGODB_URI not found. Database operations will fail.");
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
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

// --- Exported Functions ---

export async function getBooks(): Promise<Book[]> {
  await dbConnect();
  // Return only metadata, exclude pages and internal _id
  // We explicitly select fields to match Book interface
  const books = await BookModel.find({}, {
    id: 1, title: 1, author: 1, coverUrl: 1, pageCount: 1, createdAt: 1, _id: 0
  }).sort({ createdAt: -1 });
  return books;
}

export async function getBook(id: string): Promise<Story | null> {
  await dbConnect();
  // We need full story data including pages
  const book = await BookModel.findOne({ id }, { _id: 0, __v: 0 });
  if (!book) return null;

  // Transform to Story interface (though our IBook includes it, just to be strictly compatible)
  return {
    id: book.id,
    title: book.title,
    pages: book.pages
  };
}

export async function saveBook(book: Book, story: Story): Promise<void> {
  await dbConnect();

  const fullData: IBook = {
    ...book,
    pages: story.pages
  };

  // Upsert (Insert or Update) based on 'id'
  await BookModel.findOneAndUpdate(
    { id: book.id },
    fullData,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function deleteBook(id: string): Promise<void> {
  await dbConnect();
  await BookModel.deleteOne({ id });
}

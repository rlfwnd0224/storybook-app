'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getBooks, getBook, saveBook, deleteBook, Book, Story } from '@/lib/db';

export async function fetchBooks() {
    return await getBooks();
}

export async function fetchBook(id: string) {
    return await getBook(id);
}

export async function removeBook(id: string) {
    await deleteBook(id);
    revalidatePath('/admin');
    revalidatePath('/');
}

export async function saveBookAction(formData: FormData) {
    const id = formData.get('id') as string || `story-${Date.now()}`;
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const coverUrl = formData.get('coverUrl') as string;
    const rawPagesImages = formData.get('rawPagesImages') as string;
    const rawPagesText = formData.get('rawPagesText') as string;

    // Process Images (one URL per line)
    const imageUrls = rawPagesImages.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    // Process Text (split by '---')
    const texts = rawPagesText.split('---').map(s => s.trim());

    // Merge into Pages
    const pages = imageUrls.map((img, index) => ({
        pageNumber: index + 1,
        imageUrl: img,
        text: texts[index] || '' // Fallback if text is missing
    }));

    const book: Book = {
        id,
        title,
        author,
        coverUrl,
        pageCount: pages.length,
        createdAt: new Date().toISOString()
    };

    const story: Story = {
        id,
        title,
        pages
    };

    await saveBook(book, story);

    revalidatePath('/admin');
    revalidatePath('/');
    redirect('/admin');
}

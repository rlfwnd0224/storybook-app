import Link from 'next/link';
import BookForm from '@/components/admin/BookForm';
import { fetchBook, fetchBooks } from '@/app/actions';

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const book = await fetchBook(id);

    if (!book) {
        return <div>Book not found</div>;
    }

    const books = await fetchBooks();
    const bookMeta = books.find((b: any) => b.id === id);

    const fullData = {
        ...book,
        ...bookMeta
    };



    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center mb-6 gap-4">
                <Link href="/admin" className="text-gray-500 hover:text-gray-900">← 뒤로가기</Link>
                <h1 className="text-3xl font-bold">동화책 수정하기</h1>
            </div>
            <BookForm initialData={fullData} />
        </div>
    );
}

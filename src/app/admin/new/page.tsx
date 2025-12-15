import Link from 'next/link';
import BookForm from '@/components/admin/BookForm';

export default function NewBookPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center mb-6 gap-4">
                <Link href="/admin" className="text-gray-500 hover:text-gray-900">← 뒤로가기</Link>
                <h1 className="text-3xl font-bold">새 동화책 만들기</h1>
            </div>
            <BookForm />
        </div>
    );
}

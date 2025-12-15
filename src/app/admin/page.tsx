import Link from 'next/link';
import { fetchBooks, removeBook } from '@/app/actions';

export default async function AdminDashboard() {
    const books = await fetchBooks();

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-gray-500 hover:text-gray-900 text-2xl">🏠</Link>
                    <h1 className="text-3xl font-bold">📚 동화책 관리</h1>
                </div>
                <Link
                    href="/admin/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition-colors"
                >
                    + 새 동화책 추가
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">표지</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목 / 작가</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">페이지 수</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {books.map((book) => (
                            <tr key={book.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={book.coverUrl} alt={book.title} className="h-16 w-12 object-cover rounded shadow-sm" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-base font-bold text-gray-900">{book.title}</div>
                                    <div className="text-sm text-gray-500">{book.author}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {book.pageCount} 페이지
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(book.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/edit/${book.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 font-bold">수정</Link>
                                    <form action={removeBook.bind(null, book.id)} className="inline-block">
                                        <button type="submit" className="text-red-600 hover:text-red-900 font-bold">
                                            삭제
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

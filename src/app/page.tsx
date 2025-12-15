import Link from 'next/link';
import { fetchBooks } from '@/app/actions';

export default async function Home() {
  const books = await fetchBooks();

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 font-sans">
      {/* Header / Hero */}
      <div className="bg-gradient-to-r from-pink-400 to-orange-300 text-white p-12 text-center shadow-lg rounded-b-[40px] mb-12">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">📚 꿈꾸는 동화책 세상</h1>
        <p className="text-xl opacity-90">읽고, 듣고, 상상해 보세요!</p>
        <Link href="/admin" className="inline-block mt-4 text-xs opacity-50 hover:opacity-100 underline">
          (관리자 페이지)
        </Link>
      </div>

      {/* Book Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <Link href={`/reader/${book.id}`} key={book.id} className="group">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border-2 border-transparent group-hover:border-pink-200">
                <div className="relative aspect-[3/4] bg-gray-200">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white text-pink-500 py-2 px-6 rounded-full font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                      책 읽기 📖
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-pink-500 transition-colors line-clamp-1">{book.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{book.author}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{book.pageCount} 쪽</span>
                    <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl">등록된 동화책이 없습니다.</p>
            <p>관리자 페이지에서 동화책을 등록해주세요!</p>
          </div>
        )}
      </div>
    </main>
  );
}

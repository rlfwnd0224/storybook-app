'use client';

import { useState, useEffect } from 'react';
import { saveBookAction } from '@/app/actions';

interface BookFormProps {
    initialData?: any;
}

export default function BookForm({ initialData }: BookFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [author, setAuthor] = useState(initialData?.author || '');
    const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || '');

    // Default parsing from initialData if exists
    const defaultRawImages = initialData?.pages?.map((p: any) => p.imageUrl).join('\n') || '';
    const defaultRawText = initialData?.pages?.map((p: any) => p.text).join('\n---\n') || '';

    const [rawImages, setRawImages] = useState(defaultRawImages);
    const [rawText, setRawText] = useState(defaultRawText);

    const [previewPages, setPreviewPages] = useState<any[]>([]);

    // Update preview whenever raw inputs change
    useEffect(() => {
        const images = rawImages.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
        const texts = rawText.split('---').map((s: string) => s.trim());

        const maxLength = Math.max(images.length, texts.length);
        const pages = [];

        for (let i = 0; i < maxLength; i++) {
            pages.push({
                imageUrl: images[i] || '',
                text: texts[i] || ''
            });
        }
        setPreviewPages(pages);
    }, [rawImages, rawText]);

    return (
        <form action={saveBookAction} className="space-y-8 bg-white p-6 rounded-lg shadow">
            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">1. 기본 정보</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">제목</label>
                        <input type="text" name="title" required value={title} onChange={e => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            placeholder="예: 아기 돼지 삼형제" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">작가</label>
                        <input type="text" name="author" value={author} onChange={e => setAuthor(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            placeholder="예: 김동화" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">표지 이미지 URL</label>
                        <input type="url" name="coverUrl" required value={coverUrl} onChange={e => setCoverUrl(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            placeholder="https://..." />
                        {coverUrl && <img src={coverUrl} alt="Cover Preview" className="mt-2 h-32 object-cover rounded" />}
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">2. 내용 일괄 등록</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            이미지 URL 목록 (한 줄에 하나씩)
                        </label>
                        <textarea
                            name="rawPagesImages"
                            rows={10}
                            value={rawImages}
                            onChange={e => setRawImages(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 font-mono text-xs"
                            placeholder={`https://example.com/page1.jpg\nhttps://example.com/page2.jpg`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            동화 내용 (구분자 '---' 로 페이지 나눔)
                        </label>
                        <textarea
                            name="rawPagesText"
                            rows={10}
                            value={rawText}
                            onChange={e => setRawText(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            placeholder={`첫 번째 페이지 내용...\n---\n두 번째 페이지 내용...`}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 border-t pt-6">
                <h2 className="text-xl font-semibold">3. 미리보기 ({previewPages.length} 페이지)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {previewPages.map((page, idx) => (
                        <div key={idx} className="border rounded p-4 bg-gray-50 flex flex-col gap-2">
                            <span className="font-bold text-gray-500 text-sm">페이지 {idx + 1}</span>
                            <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded overflow-hidden h-40">
                                {page.imageUrl ? (
                                    <img src={page.imageUrl} alt={`Page ${idx + 1}`} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">이미지 없음</div>
                                )}
                            </div>
                            <p className="text-sm p-2 bg-white rounded border min-h-[60px] whitespace-pre-wrap">{page.text || '(내용 없음)'}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end sticky bottom-4">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all">
                    💾 동화책 저장하기
                </button>
            </div>
        </form>
    );
}


import { fetchBook } from '@/app/actions';
import Reader from '@/components/reader/Reader';
import { notFound } from 'next/navigation';

export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const story = await fetchBook(id);

    if (!story) {
        notFound();
    }

    return <Reader story={story} />;
}

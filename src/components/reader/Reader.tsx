'use client';

import { useState, useEffect, useRef } from 'react';
import type { Story } from '@/lib/db';
import Link from 'next/link';

interface ReaderProps {
    story: Story;
}

export default function Reader({ story }: ReaderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const isDoublePage = true; // For now always true, could be responsive later
    const totalPages = story.pages.length;
    const leftPage = story.pages[currentIndex];
    const rightPage = story.pages[currentIndex + 1];
    // currentIndex is 0, 2, 4...

    // Navigation logic for spread
    const nextPage = () => {
        if (currentIndex < totalPages - 2) {
            setCurrentIndex(prev => prev + 2);
        } else if (currentIndex < totalPages - 1) {
            // If odd pages, last one is single
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentIndex >= 2) {
            setCurrentIndex(prev => prev - 2);
        } else if (currentIndex === 1) {
            setCurrentIndex(0);
        }
    };

    const speak = () => {
        // Read Left then Right? Or just current single page logic repurposed?
        // Let's read Left, then queue Right.
        if (!synthRef.current) return;

        synthRef.current.cancel();

        const textsToRead = [];
        if (leftPage?.text) textsToRead.push(leftPage.text);
        if (rightPage?.text) textsToRead.push(rightPage.text);

        if (textsToRead.length === 0) return;

        textsToRead.forEach((text, index) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ko-KR';
            utterance.rate = 0.9;
            utterance.pitch = 1.1;

            if (index === 0) {
                utterance.onstart = () => setIsPlaying(true);
            }
            if (index === textsToRead.length - 1) {
                utterance.onend = () => setIsPlaying(false);
            }

            synthRef.current?.speak(utterance);
        });
    };

    const stop = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsPlaying(false);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextPage();
            if (e.key === 'ArrowLeft') prevPage();
            if (e.key === ' ') {
                e.preventDefault();
                speak();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex]); // Re-bind with latest currentIndex logic

    const PageCard = ({ page, label }: { page: any, label: string }) => {
        if (!page) return <div className="flex-1 bg-stone-100/50"></div>; // Empty page
        return (
            <div className="flex-1 flex flex-col h-full bg-white shadow-lg m-4 rounded-lg overflow-hidden border border-stone-200">
                {/* Image Area - 60% */}
                <div className="h-[60%] bg-stone-50 flex items-center justify-center p-4 border-b border-stone-100">
                    {page.imageUrl ? (
                        <img
                            src={page.imageUrl}
                            alt={label}
                            className="max-h-full max-w-full object-contain shadow-sm"
                        />
                    ) : (
                        <div className="text-stone-300">이미지 없음</div>
                    )}
                </div>
                {/* Text Area - 40% */}
                <div className="flex-1 p-6 flex items-center justify-center bg-white overflow-y-auto">
                    <p className="text-xl md:text-2xl leading-relaxed text-stone-800 font-serif text-center break-keep">
                        {page.text}
                    </p>
                </div>
            </div>
        )
    };

    return (
        <div className="flex flex-col h-screen bg-stone-200 overflow-hidden relative selection:bg-pink-100">
            {/* Top Bar */}
            <div className={`absolute top-0 left-0 right-0 p-4 z-50 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <Link href="/" className="bg-white/90 backdrop-blur rounded-full px-5 py-2 shadow border border-stone-200 text-sm font-bold text-gray-600 hover:text-pink-500 transition-colors">
                        🏠 홈으로
                    </Link>
                    <div className="bg-white/90 backdrop-blur rounded-full px-5 py-2 shadow border border-stone-200 text-sm font-bold text-stone-600">
                        {currentIndex + 1} - {Math.min(currentIndex + 2, totalPages)} / {totalPages}
                    </div>
                </div>
            </div>

            {/* Main Book Area */}
            <div className="flex-1 py-16 px-4 md:px-12 flex items-center justify-center h-full max-w-[1600px] mx-auto w-full">
                <div className="w-full h-full flex flex-row gap-0 shadow-2xl rounded-xl overflow-hidden bg-stone-800 p-2 border-8 border-stone-800">
                    <PageCard page={leftPage} label={`Page ${currentIndex + 1}`} />
                    <div className="w-[1px] bg-stone-300 shadow-inner z-10"></div> {/* Book Spine */}
                    <PageCard page={rightPage} label={`Page ${currentIndex + 2}`} />
                </div>
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-stone-200 p-2 flex items-center gap-4 pointer-events-auto">
                    <button
                        onClick={stop}
                        className="w-10 h-10 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 flex items-center justify-center transition-all"
                    >
                        ⏹
                    </button>
                    <button
                        onClick={speak}
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md transform transition-all ${isPlaying ? 'bg-pink-100 text-pink-500 scale-95 ring-2 ring-pink-200' : 'bg-pink-500 text-white hover:bg-pink-600 hover:scale-105'}`}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                </div>
            </div>

            {/* Navigation Buttons (Large Side Click Areas) */}
            <button
                onClick={prevPage}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-full flex items-center justify-start pl-6 hover:bg-gradient-to-r hover:from-black/5 to-transparent transition-all z-20 group disabled:hidden"
            >
                <div className="w-12 h-12 bg-white/80 rounded-full shadow-lg flex items-center justify-center text-gray-600 group-hover:scale-110 transition-transform">←</div>
            </button>

            <button
                onClick={nextPage}
                disabled={currentIndex >= totalPages - (totalPages % 2 === 0 ? 2 : 1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-full flex items-center justify-end pr-6 hover:bg-gradient-to-l hover:from-black/5 to-transparent transition-all z-20 group disabled:hidden"
            >
                <div className="w-12 h-12 bg-white/80 rounded-full shadow-lg flex items-center justify-center text-gray-600 group-hover:scale-110 transition-transform">→</div>
            </button>
        </div>
    );
}

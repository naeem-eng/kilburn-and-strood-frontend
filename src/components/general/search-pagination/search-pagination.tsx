'use client';
import { LeftArrowIcon, RightArrowIcon } from '@/components/helpers/icons';
import { memo } from 'react';

interface PaginationProps {
    page:      number;
    pageCount: number;
    onChange:  (page: number) => void;
}

const SearchPagination = ({ page, pageCount, onChange }: PaginationProps) => {
    if (pageCount <= 1) return null;

    const getPages = (): (number | { ellipsis: true; target: number })[] => {
        if (pageCount <= 5) return Array.from({ length: pageCount }, (_, i) => i + 1);

        const pages: (number | { ellipsis: true; target: number })[] = [];

        // Always show 3 pages around current, clamped to valid range
        const start = Math.max(1, Math.min(page - 1, pageCount - 2));
        const end   = Math.min(pageCount, start + 2);

        const jump = Math.max(5, Math.floor(pageCount / 10)); // 10% of total pages

        // Left side
        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push({ ellipsis: true, target: Math.max(1, start - jump) });
        }

        // Middle window
        for (let i = start; i <= end; i++) pages.push(i);

        // Right side
        if (end < pageCount) {
            if (end < pageCount - 1) pages.push({ ellipsis: true, target: Math.min(pageCount, end + jump) });
            pages.push(pageCount);
        }

        return pages;
    };

    const btn = "w-6 h-10 md:w-10 md:h-10 flex items-center justify-center border border-light-blue text-dark-gray ";
    const active = "border-dark-blue! text-dark-blue!";

    return (
        <nav aria-label="Pagination" className="flex flex-row items-center gap-x-1 md:gap-x-5 my-12">
            <button
                type="button"
                aria-label="Previous page"
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                className={`${btn} cursor-pointer bg-dark-blue!`}
            >
                <LeftArrowIcon className="w-4 h-4 md:w-10 md:h-4 " fill='white' />
            </button>

            {getPages().map((p:any, i) =>
                typeof p === 'object' && p.ellipsis ? (
                    <button
                        type="button"
                        aria-label={`Jump to page ${p.target}`}
                        key={`ellipsis-${i}`}
                        onClick={() => onChange(p.target)}
                        className={`${btn} cursor-pointer text-sm`}
                    >
                        ...
                    </button>
                ) : (
                    <button
                        type="button"
                        aria-label={`Page ${p}`}
                        aria-current={page === p ? "page" : undefined}
                        key={p}
                        onClick={() => onChange(p as number)}
                        className={`${btn} cursor-pointer ${page === p ? active : ''} text-sm`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                type="button"
                aria-label="Next page"
                onClick={() => onChange(page + 1)}
                disabled={page === pageCount}
                className={`${btn} disabled:opacity-40 cursor-pointer bg-dark-blue!`}
            >
                <RightArrowIcon className="w-4 h-4 md:w-10 md:h-4 " fill='white'/>
            </button>
        </nav>
    );
};

export default memo(SearchPagination);
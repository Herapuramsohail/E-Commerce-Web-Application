import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-dark-900">
      {/* Shimmering Aspect Square */}
      <div className="relative aspect-square w-full animate-pulse bg-slate-200 dark:bg-dark-800"></div>

      {/* Shimmering Info */}
      <div className="flex flex-1 flex-col p-4 space-y-3">
        {/* Category */}
        <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-dark-800 animate-pulse"></div>

        {/* Title */}
        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-dark-800 animate-pulse"></div>

        {/* Rating */}
        <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-dark-800 animate-pulse"></div>

        {/* Price & Action */}
        <div className="pt-4 flex items-center justify-between">
          <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-dark-800 animate-pulse"></div>
          <div className="h-8 w-1/4 rounded-lg bg-slate-200 dark:bg-dark-800 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;

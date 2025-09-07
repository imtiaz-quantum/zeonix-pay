const StatCardSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, rowIndex: number) => (
        <div key={rowIndex} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCardSkeleton;

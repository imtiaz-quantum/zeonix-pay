"use client";

import { useSearchParams } from "next/navigation";

export default function InvalidUsersPage() {
  const searchParams = useSearchParams();
  const page = searchParams?.get("page") ?? "";
  const reason = searchParams?.get("reason") ?? "Invalid page.";

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-[#674CC4] mb-3">
        Oops! No results found
      </h2>
      <p className="text-gray-600 mb-6">
        {reason} {page ? `(page: ${page})` : ""}
      </p>
      <div className="flex justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-[#674CC4]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => history.back()}
          className="inline-flex items-center rounded-lg bg-[#674CC4] px-6 py-3 text-white font-semibold hover:bg-[#5740a8] focus:outline-none focus:ring-2 focus:ring-[#674CC4]/50 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

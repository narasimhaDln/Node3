'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-full hover:bg-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back
    </button>
  );
}

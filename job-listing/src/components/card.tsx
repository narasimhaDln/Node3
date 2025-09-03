"use client";

import React, { memo, useMemo } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { Job } from "../app/types/job";

interface CardProps {
  job: Job;
}

const Card: React.FC<CardProps> = memo(({ job }) => {
  const { data: session } = useSession();

  // Memoize computed values to prevent unnecessary recalculations
  const daysAgo = useMemo(() => {
    return Math.floor(
      (Date.now() - new Date(job.publishedAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }, [job.publishedAt]);

  const companyInitial = useMemo(() => {
    return job.companyName.charAt(0).toUpperCase();
  }, [job.companyName]);

  const visibleSkills = useMemo(() => {
    return job.KeySkills?.slice(0, 6) || [];
  }, [job.KeySkills]);

  const hasMoreSkills = useMemo(() => {
    return (job.KeySkills?.length || 0) > 6;
  }, [job.KeySkills]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-4 sm:p-6 flex flex-col justify-between">
      {/* Header with title and company */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate mb-1">
            {job.title?.trim() || 'Job Title'}
          </h3>
          <p className="text-sm sm:text-base text-gray-700 font-medium truncate">
            {job.companyName?.trim() || 'Company Name'}
          </p>
        </div>

        <div className="w-10 h-10 sm:w-12 sm:h-12 ml-3 flex-shrink-0">
          <div className="w-full h-full bg-gray-100 rounded-md border flex items-center justify-center">
            <span className="text-base sm:text-lg font-bold text-gray-600">
              {companyInitial}
            </span>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 mb-3">
        {job.experience && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{job.experience}</span>
          </div>
        )}

        {job.location && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{job.location}</span>
          </div>
        )}

        {job.workMode && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
            </svg>
            <span>{job.workMode}</span>
          </div>
        )}
      </div>

      {/* Salary */}
      {job.salary && (
        <div className="mb-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-700">
            <svg
              className="w-4 h-4 mr-2 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
            </svg>
            <span className="font-medium">{job.salary.trim()}</span>
          </div>
        </div>
      )}

      {/* Skills */}
      {visibleSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {visibleSkills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200"
            >
              {skill?.trim() || ''}
            </span>
          ))}
          {hasMoreSkills && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{(job.KeySkills?.length || 0) - 6} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
        <div className="flex items-center text-xs sm:text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            {daysAgo} days ago
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">

          {session ? (
            <Link href={`/dashboard/${job.slug?.current}`} className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto bg-blue-500 text-white text-sm font-medium px-6 py-2 rounded-2xl
               hover:bg-blue-700 hover:shadow-lg hover:scale-105 
               active:scale-95 active:bg-blue-800 
               transition-all duration-200 ease-in-out"
              >
                Apply
              </button>
            </Link>
          ) : (
            <button
              onClick={() => signIn()}
              className="w-full sm:w-auto bg-blue-500 text-white text-sm font-medium px-6 py-2 rounded-2xl
             hover:bg-blue-700 hover:shadow-lg hover:scale-105 
             active:scale-95 active:bg-blue-800 
             transition-all duration-200 ease-in-out"
            >
              Sign in to Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;

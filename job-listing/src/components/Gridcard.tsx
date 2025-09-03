import React, { memo } from 'react';
import Card from './card';
import { Job } from '../app/types/job';

interface GridCardProps {
  jobs: Job[];
}

const GridCard: React.FC<GridCardProps> = memo(({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria to find more jobs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="space-y-4">
        {jobs.map((job: Job) => (
          <Card key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
});

GridCard.displayName = 'GridCard';

export default GridCard;

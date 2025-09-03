'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import BackButton from '../../../components/backButton';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

interface Job {
  _id: string;
  title: string;
  companyName: string;
  slug: {
    current: string;
  };
  experience: string;
  location: string;
  noticePeriod: string;
  salary: string;
  employmentType: string;
  workMode: string;
  openings: number;
  description: string;
  role: string;
  applicationLink: string;
  eligibility: string;
  KeySkills: string[];
  responsibilities: string[];
  publishedAt: string;
  postedBy: string;
  category: string;
}

// Function to fetch a single job by its slug
async function getJob(slug: string): Promise<Job | null> {
  const res = await fetch(`http://localhost:3000/api/jobs/${slug}`, {
    cache: 'no-store',
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('Failed to fetch job data');
  }

  return res.json();
}

// Function to fetch related jobs by category
async function getRelatedJobs(
  category: string,
  currentJobId: string,
): Promise<Job[]> {
  try {
    const res = await fetch(
      `http://localhost:3000/api/jobs?category=${category}&limit=6`,
      {
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      return [];
    }

    const jobs = await res.json();
    // Filter out the current job and return up to 5 related jobs
    return jobs.filter((job: Job) => job._id !== currentJobId).slice(0, 7);
  } catch (error) {
    console.error('Failed to fetch related jobs:', error);
    return [];
  }
}

// Related Job Card Component
const RelatedJobCard = ({ job }: { job: Job }) => (
  <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
          {job.title}
        </h3>
        <p className="text-gray-600 font-medium mt-1">{job.companyName}</p>
      </div>
      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
        <svg
          className="w-6 h-6 text-indigo-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm8-2a2 2 0 11-4 0 2 2 0 014 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>

    <div className="flex items-center gap-2 mb-3">
      <svg
        className="w-4 h-4 text-gray-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-sm text-gray-600">{job.location}</span>
    </div>

    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg border border-blue-100">
        <p className="text-xs font-medium text-blue-800 mb-1">Experience</p>
        <p className="text-sm font-semibold text-blue-900">{job.experience}</p>
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg border border-blue-100">
        <p className="text-xs font-medium text-blue-800 mb-1">Salary</p>
        <p className="text-sm font-semibold text-blue-900">{job.salary}</p>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-200">
      <div className="flex items-center gap-2 text-gray-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm">
          Posted: {new Date(job.publishedAt).toLocaleDateString()}
        </span>
      </div>
    </div>

    <div className="flex items-center justify-between mt-3">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-medium text-green-600">
          {job.openings} Opening{job.openings > 1 ? 's' : ''}
        </span>
      </div>
      <span className="text-xs text-gray-500">
        {new Date(job.publishedAt).toLocaleDateString()}
      </span>
    </div>
  </div>
);

export default async function JobDetailsPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    notFound();
  }

  // Fetch related jobs
  const relatedJobs = await getRelatedJobs(job.category, job._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Header Card */}
            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 mb-8 border border-white/20">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600 uppercase tracking-wider">
                      {job.openings} Opening{job.openings > 1 ? 's' : ''}{' '}
                      Available
                    </span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    {job.title}
                  </h1>

                  <p className="text-2xl text-gray-700 mt-3 font-medium">
                    {job.companyName}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600">
                      {job.location} • {job.workMode}
                    </span>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-lg">
                    <svg
                      className="w-10 h-10 text-indigo-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm8-2a2 2 0 11-4 0 2 2 0 014 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">
                      Experience
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-blue-900">
                    {job.experience}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">
                      Salary
                    </span>
                  </div>
                  <p className="text-lg font-semibold  text-emerald-900">
                    {job.salary}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">
                      Type
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-blue-900">
                    {job.employmentType}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">
                      Notice
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-blue-900">
                    {job.noticePeriod}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">
                    Posted: {new Date(job.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a2 2 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">Posted By: {job.postedBy}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">Category: {job.category}</span>
                </div>
              </div>
            </div>

            {/* Content Cards */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20">
              {/* Job Description */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Job Description
                  </h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                    {job.description}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 my-10"></div>

              {/* Role & Responsibilities */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Role & Responsibilities
                  </h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                    {job.role}
                  </p>
                  <div className="space-y-3">
                    {job.responsibilities?.map((resp, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100"
                      >
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-gray-800 leading-relaxed">
                          {resp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 my-10"></div>

              {/* Skills Required */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Skills Required
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {job.KeySkills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 text-black py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-default border border-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <div className="text-center">
                  <button className="inline-flex items-center gap-3 bg-blue-400 text-white font-bold py-3  px-10 rounded-full hover:bg-blue-600 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transform">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Jobs Sidebar */}
          <div className="hidden lg:block w-120 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Related Jobs
                  </h3>
                </div>

                {relatedJobs.length > 0 ? (
                  <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                    {relatedJobs.map((relatedJob) => (
                      <RelatedJobCard key={relatedJob._id} job={relatedJob} />
                    ))}

                    {/* View More Button */}
                    <div className="pt-4">
                      <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        View More Jobs in {job.category}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm">
                      No related jobs found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

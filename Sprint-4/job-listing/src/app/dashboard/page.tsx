'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GridCard from '../../components/Gridcard';
import FiltersSidebar from '../../components/Filtersidebar';
import { Job, ApiJob, Filters, transformApiJobsToJobs } from '../types/job';
import Pagination from '../../components/Pagination';

const getJobs = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  filters?: Filters,
): Promise<{ jobs: Job[]; total: number }> => {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search?.trim()) searchParams.append('search', search.trim());

  if (filters) {
    Object.entries(filters).forEach(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        values.forEach((value) => {
          searchParams.append(key, value);
        });
      }
    });
  }

  const finalUrl = `http://localhost:3000/api/jobs/pagination?${searchParams.toString()}`;

  const res = await fetch(finalUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

  await new Promise(resolve => setTimeout(resolve, 1000));
  const response = await res.json();
  const apiJobs: ApiJob[] = response.jobs || response.data || response || [];

  let total: number =
    response.pagination?.total ??
    response.total ??
    response.totalCount ??
    response.count ??
    0;

  if (total === 0 && apiJobs.length > 0) {
    total = page === 1 && apiJobs.length === limit
      ? apiJobs.length * 2
      : apiJobs.length;
  }

  return { jobs: transformApiJobsToJobs(apiJobs), total };
};

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    experience: [],
    location: [],
    salary: [],
    workMode: [],
    department: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  const jobsPerPage = 10;
  const isFetchingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchJobs = useCallback(
    async (page: number, search: string, filtersToUse: Filters) => {
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);

        const { jobs: jobsData, total } = await getJobs(
          page,
          jobsPerPage,
          search,
          filtersToUse,
        );

        setJobs(jobsData);
        setTotalJobs(Math.max(0, total));
        setCurrentPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
        setJobs([]);
        setTotalJobs(0);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [jobsPerPage],
  );

  // Handle URL changes and initial load
  useEffect(() => {
    if (!mounted || !searchParams) return;

    const urlPage = parseInt(searchParams?.get('page') ?? '1', 10) || 1;
    const urlSearch = searchParams?.get('search') ?? '';

    // Fetch jobs with current URL parameters and filters
    fetchJobs(urlPage, urlSearch, filters);
  }, [mounted, searchParams, filters, fetchJobs]);

  const handlePageChange = useCallback(
    (page: number) => {
      const totalPages = Math.max(1, Math.ceil(totalJobs / jobsPerPage));
      if (page < 1 || page > totalPages || page === currentPage || loading) {
        return;
      }

      const params = new URLSearchParams();
      if (page !== 1) {
        params.set('page', page.toString());
      }
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      }
      Object.entries(filters).forEach(([key, values]) => {
        if (Array.isArray(values) && values.length > 0) {
          values.forEach((value) => {
            params.append(key, value);
          });
        }
      });

      const newUrl = params.toString() ? `/dashboard?${params.toString()}` : '/dashboard';
      router.push(newUrl, { scroll: false });
      setCurrentPage(page); // Update currentPage immediately
    },
    [totalJobs, jobsPerPage, currentPage, loading, searchQuery, filters, router],
  );

  const handleFilterChange = useCallback(
    (newFilters: Filters) => {
      setFilters(newFilters);
      setCurrentPage(1); // Reset to page 1 on filter change
    },
    [],
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(1);
    router.push('/dashboard', { scroll: false });
  }, [router]);

  const handleClearFilters = useCallback(() => {
    const clearedFilters: Filters = {
      experience: [],
      location: [],
      salary: [],
      workMode: [],
      department: [],
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = useCallback(() => {
    return Object.values(filters).some((filterArray) => filterArray.length > 0);
  }, [filters]);

  const getJobRange = useCallback(() => {
    if (totalJobs === 0) return { start: 0, end: 0 };
    const start = (currentPage - 1) * jobsPerPage + 1;
    const end = Math.min(currentPage * jobsPerPage, totalJobs);
    return { start, end };
  }, [totalJobs, currentPage, jobsPerPage]);

  const { start, end } = getJobRange();
  const totalPages = Math.max(1, Math.ceil(totalJobs / jobsPerPage));

  const memoizedFiltersSidebar = useMemo(() => {
    return (
      <FiltersSidebar
        onFilterChange={handleFilterChange}
        currentFilters={filters}
      />
    );
  }, [handleFilterChange, filters]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => fetchJobs(currentPage, searchQuery, filters)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-center gap-8">
        {memoizedFiltersSidebar}
        <div className="w-full md:w-[70%] lg:w-[65%] xl:w-[50%] min-w-0">
          <header className="mb-6 flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Latest Jobs
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              {totalJobs > 0
                ? `Showing ${start}-${end} of ${totalJobs} jobs (Page ${currentPage} of ${totalPages})`
                : searchQuery || hasActiveFilters()
                  ? `No jobs found${searchQuery ? ` for "${searchQuery}"` : ''}${hasActiveFilters() ? ' with current filters' : ''}`
                  : 'No jobs available'}
            </p>
            {!loading && (searchQuery || hasActiveFilters()) && (
              <div className="flex gap-2 justify-center">
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    Clear search
                  </button>
                )}
                {hasActiveFilters() && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </header>
          {loading && (
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
              <p className="text-sm text-blue-600">Loading jobs...</p>
            </div>
          )}
          {error && jobs.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
              <p className="text-sm">Warning: {error}</p>
            </div>
          )}
          {jobs.length > 0 ? (
            <div className="w-full space-y-6">
              <GridCard jobs={jobs} />
              <Pagination
                totalJobs={totalJobs}
                jobsPerPage={jobsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </div>
          ) : (
            !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchQuery || hasActiveFilters()
                    ? 'No jobs found'
                    : 'No jobs available'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || hasActiveFilters()
                    ? 'Try adjusting your search terms or filters.'
                    : 'Check back later for new job postings.'}
                </p>
                <div className="flex gap-2 justify-center mb-6">
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                      Clear Search
                    </button>
                  )}
                  {hasActiveFilters() && (
                    <button
                      onClick={handleClearFilters}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
                <Pagination
                  totalJobs={totalJobs}
                  jobsPerPage={jobsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

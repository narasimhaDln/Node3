export interface Job {
  _id: string;
  title: string;
  companyName: string;
  slug: {
    current: string;
  };
  experience: string;
  location: string;
  salary: string;
  workMode: string;
  KeySkills: string[];
  publishedAt: string;
}

// API response might have different structure
export interface ApiJob {
  _id: string;
  title: string;
  companyName: string;
  slug: {
    current: string;
  };
  experience: string;
  location: string | string[]; // API might return either string or string[]
  salary: string;
  workMode: string;
  KeySkills: string[];
  publishedAt: string;
}

export interface Filters {
  experience: string[];
  location: string[];
  salary: string[];
  workMode: string[];
  department: string[];
}
export const transformApiJobToJob = (apiJob: ApiJob): Job => ({
  ...apiJob,
  location: Array.isArray(apiJob.location)
    ? apiJob.location.join(', ')
    : apiJob.location || '',
});
export const transformApiJobsToJobs = (apiJobs: ApiJob[]): Job[] =>
  apiJobs.map(transformApiJobToJob);

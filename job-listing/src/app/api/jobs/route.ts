import { NextResponse } from 'next/server';
import { client } from '../../../sanity/lib/sanityClient';

export const revalidate = 60;

//Get all jobs
export async function GET() {
  try {
    const query = `*[_type == "jobs"]{
       _id,
      title,
      companyName,
      slug,
      experience,
      location,
      noticePeriod,
      salary,
      employmentType,
      workMode,
      openings,
      description,
      role,
      applicationLink,
      eligibility,
      KeySkills,
      responsibilities,
      publishedAt,
      "postedBy": postedBy->name,
      "category":category->category
    } | order(publishedAt desc)`;

    const jobs = await client.fetch(query);

    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching jobs', error },
      { status: 500 },
    );
  }
}

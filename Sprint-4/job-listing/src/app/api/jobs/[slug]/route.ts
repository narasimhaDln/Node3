import { NextResponse } from 'next/server';
import { client } from '../../../../sanity/lib/sanityClient';


// ISR: Revalidate every 300 seconds (5 minutes)
export const revalidate = 300;

// Get a single job by slug
export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;

    const query = `*[_type == "jobs" && slug.current == $slug][0]{
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
    }`;

    const job = await client.fetch(query, { slug });

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching job', error },
      { status: 500 },
    );
  }
}

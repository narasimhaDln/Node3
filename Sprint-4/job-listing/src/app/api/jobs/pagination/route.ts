import { NextResponse } from 'next/server';
import { client } from '../../../../sanity/lib/sanityClient';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

// pagination + search + filters applied for the jobs
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    //pagination
    //pages
    const page = parseInt(searchParams.get('page') || '1', 10);
    //per page=10 items limit
    const limit = 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    // Search keyword
    const search = searchParams.get('search') || '';

    // Get filter parameters
    const experience = searchParams.getAll('experience');
    const location = searchParams.getAll('location');
    const salary = searchParams.getAll('salary');
    const workMode = searchParams.getAll('workMode');
    const department = searchParams.getAll('department');

    // Build filter conditions
    const filterConditions = ['_type == "jobs"'];

    // Add search condition
    if (search) {
      filterConditions.push(`title match "*${search}*"`);
    }

    // Add filters to the query - simplified to prevent GROQ errors
    if (experience && experience.length > 0) {
      const expConditions = experience
        .map((exp) => `experience == "${exp}"`)
        .join(' || ');
      filterConditions.push(`(${expConditions})`);
    }

    if (location && location.length > 0) {
      const locConditions = location
        .map((loc) => `"${loc}" in location`)
        .join(' || ');
      filterConditions.push(`(${locConditions})`);
    }

    if (salary && salary.length > 0) {
      const salConditions = salary
        .map((sal) => `salary == "${sal}"`)
        .join(' || ');
      filterConditions.push(`(${salConditions})`);
    }

    if (workMode && workMode.length > 0) {
      const modeConditions = workMode
        .map((mode) => `workMode == "${mode}"`)
        .join(' || ');
      filterConditions.push(`(${modeConditions})`);
    }

    if (department && department.length > 0) {
      const deptConditions = department
        .map((dept) => `category->category == "${dept}"`)
        .join(' || ');
      filterConditions.push(`(${deptConditions})`);
    }

    // Combine all conditions with AND logic
    const whereClause = filterConditions.join(' && ');

    // GROQ query with search, filters, and pagination
    const query = `{
      "jobs": *[${whereClause}] | order(publishedAt desc) [${start}...${end}]{
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
          "category": category->category
      },
      "total": count(*[${whereClause}])
    }`;

    try {
      // Try the filtered query first, fallback to basic query if it fails
      let result;
      try {
        result = await client.fetch(query);
      } catch (filterError) {
        // If the filtered query fails, return an empty array for jobs and total count
        result = {
          jobs: [],
          total: 0,
        };
      }

      const { jobs, total } = result;

      if (!jobs) {
        return NextResponse.json({
          jobs: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        });
      }

      return NextResponse.json({
        jobs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Error fetching jobs', error },
      { status: 500 },
    );
  }
}

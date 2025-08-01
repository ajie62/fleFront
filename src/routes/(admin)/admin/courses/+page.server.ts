import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch('http://localhost:8000/api/courses');
  const json = await res.json();
  const courses = json['member'] || [];

  return { courses };
};

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const apiUrl = 'http://localhost:8000/api/courses';

	const totalCoursesFetch = fetch(`${apiUrl}?pagination=false`);
	const publishedCoursesFetch = fetch(`${apiUrl}?isPublished=true&pagination=false`);
	const unpublishedCoursesFetch = fetch(`${apiUrl}?isPublished=false&pagination=false`);

	const [totalCoursesRes, publishedCoursesRes, unpublishedCoursesRes] = await Promise.all([
		totalCoursesFetch,
		publishedCoursesFetch,
		unpublishedCoursesFetch
	]);

	const totalCoursesData = await totalCoursesRes.json();
	const publishedCoursesData = await publishedCoursesRes.json();
	const unpublishedCoursesData = await unpublishedCoursesRes.json();

	return {
		totalCourses: totalCoursesData['member']?.length ?? 0,
		publishedCount: publishedCoursesData['member']?.length ?? 0,
		unpublishedCount: unpublishedCoursesData['member']?.length ?? 0
	};
};

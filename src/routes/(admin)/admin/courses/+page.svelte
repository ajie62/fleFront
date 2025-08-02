<script lang="ts">
  import CourseFilters from '$lib/components/admin/courses/CourseFilters.svelte';
  import CourseTable from '$lib/components/admin/courses/CourseTable.svelte';
  import CourseCards from '$lib/components/admin/courses/CourseCards.svelte';
  import type { Course, Status, Level } from '$lib/types';

  export let data: { courses: Course[] };
  const { courses } = data;

  const statusOptions = ['all', 'published', 'unpublished'] as const;
  let selectedStatus: Status = 'all';

  const levelOptions = ['all', 'beginner', 'intermediate', 'advanced'] as const;
  let selectedLevel: Level = 'all';

  $: filteredCourses = courses.filter((course) => {
    const matchStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'published' && course.isPublished) ||
      (selectedStatus === 'unpublished' && !course.isPublished);

    const matchLevel =
      selectedLevel === 'all' || course.level === selectedLevel;

    return matchStatus && matchLevel;
  });
</script>

<section class="px-4 sm:px-6 py-8 bg-gray-100 min-h-screen">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-4xl font-bold text-gray-800 mb-6">Admin Panel</h1>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 class="text-2xl font-semibold text-gray-600">Gestion des cours</h2>
        <a
            href="/admin/courses/create"
            class="mt-4 sm:mt-0 inline-block bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition cursor-pointer"
        >
            + Créer un cours
        </a>
    </div>

    <CourseFilters
      bind:selectedStatus
      bind:selectedLevel
      {statusOptions}
      {levelOptions}
    />

    {#if filteredCourses.length > 0}
      <CourseTable courses={filteredCourses} />
      <CourseCards courses={filteredCourses} />
    {:else}
      <div class="bg-white rounded-xl shadow p-6 text-center text-gray-500 text-lg mt-8">
        Aucun cours ne correspond aux filtres sélectionnés.
      </div>
    {/if}
  </div>
</section>
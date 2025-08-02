<script lang="ts">
  import type { Course } from '$lib/types';

  export let courses: Course[];
</script>

<div class="space-y-4 md:hidden">
  {#each courses as course (course.id)}
    <div class="bg-white rounded-xl shadow p-4">
      <h3 class="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
      <p class="text-sm text-gray-600 mb-1"><strong>Niveau :</strong> {course.level}</p>
      <p class="text-sm text-gray-600 mb-1">
        <strong>Statut :</strong>
        {#if course.isPublished}
          <span class="text-green-700">Publié</span>
        {:else}
          <span class="text-yellow-700">Non publié</span>
        {/if}
      </p>
      <div class="mt-4 text-right">
        <a
          href={`/admin/courses/${course.id}/edit`}
          class="inline-block cursor-pointer px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
        >
          Éditer
        </a>
      </div>
    </div>
  {/each}
</div>
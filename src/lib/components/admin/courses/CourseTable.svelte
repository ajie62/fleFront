<script lang="ts">
  import type { Course } from '$lib/types';

  export let courses: Course[];
</script>

<div class="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
  <table class="min-w-full text-left">
    <thead class="bg-gray-100 text-sm uppercase text-gray-600">
      <tr>
        <th class="px-6 py-4">Titre</th>
        <th class="px-6 py-4">Niveau</th>
        <th class="px-6 py-4">Statut</th>
        <th class="px-6 py-4 text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each courses as course (course.id)}
        <tr class="border-b hover:bg-gray-50 transition">
          <td class="px-6 py-4 font-medium text-gray-900">{course.title}</td>
          <td class="px-6 py-4 capitalize">{course.level}</td>
          <td class="px-6 py-4">
            {#if course.isPublished}
              <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Publié</span>
            {:else}
              <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Non publié</span>
            {/if}
          </td>
          <td class="px-6 py-4 text-right space-x-2">
            <a href={`/admin/courses/${course.id}`} class="text-blue-600 hover:underline text-sm">Voir</a>
            <a href={`/admin/courses/${course.id}/edit`} class="text-indigo-600 hover:underline text-sm">Éditer</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

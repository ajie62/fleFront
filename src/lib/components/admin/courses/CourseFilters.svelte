<script lang="ts">
  import type { Status, Level } from '$lib/types';

  export let selectedStatus: Status;
  export let selectedLevel: Level;

  export let statusOptions: readonly Status[];
  export let levelOptions: readonly Level[];
</script>

<div class="mb-4 flex flex-wrap gap-2">
  {#each statusOptions as status}
    <button
      class="cursor-pointer px-4 py-2 rounded border text-sm transition
        {selectedStatus === status
          ? status === 'published'
            ? 'bg-green-600 text-white'
            : status === 'unpublished'
              ? 'bg-yellow-500 text-white'
              : 'bg-blue-600 text-white'
          : 'bg-white text-gray-800 hover:bg-gray-100'}"
      on:click={() => selectedStatus = status}
    >
      {status === 'all' ? 'Tous' : status === 'published' ? 'Publiés' : 'Non publiés'}
    </button>
  {/each}
</div>

<div class="mb-6 flex flex-wrap gap-2">
  {#each levelOptions as level}
    <button
      class="cursor-pointer px-4 py-2 rounded border text-sm transition
        {selectedLevel === level
          ? 'bg-indigo-600 text-white'
          : 'bg-white text-gray-800 hover:bg-gray-100'}"
      on:click={() => selectedLevel = level}
    >
      {level === 'all'
        ? 'Tous niveaux'
        : level === 'beginner'
          ? 'Débutant'
          : level === 'intermediate'
            ? 'Intermédiaire'
            : 'Avancé'}
    </button>
  {/each}
</div>

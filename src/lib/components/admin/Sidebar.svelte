<script lang="ts">
  // All code/comments in EN (project rule)
  import { onMount } from 'svelte';

  export let isMobile: boolean = false;
  export let onClose: () => void = () => {};

  // Collapsible state for the "Cours" group (collapsed by default)
  let isCoursesOpen = false;

  // Persist state between navigations (optional but nice UX)
  const STORAGE_KEY = 'sidebar.courses.open';
  onMount(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        isCoursesOpen = saved === '1';
      }
    } catch {
      // Ignore storage errors
    }
  });

  function toggleCourses() {
    isCoursesOpen = !isCoursesOpen;
    try {
      localStorage.setItem(STORAGE_KEY, isCoursesOpen ? '1' : '0');
    } catch {
      // Ignore storage errors
    }
  }
</script>

<aside
  class={`flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm
          ${isMobile
            ? 'fixed inset-y-0 left-0 z-40 h-full'
            : 'relative md:sticky md:top-0 md:h-screen'}`}
  role="navigation"
  aria-label="Admin sidebar"
>
  <!-- Header (no extra borders) -->
  <div class="p-4 flex items-center justify-between">
    <h2 class="text-lg font-semibold">Admin</h2>
    {#if isMobile}
      <button
        type="button"
        class="text-sm underline"
        on:click={onClose}
        aria-label="Close sidebar"
      >Close</button>
    {/if}
  </div>

  <!-- Nav -->
  <nav class="p-3 space-y-1 overflow-y-auto">
    <a href="/admin" class="block px-3 py-2 rounded-lg hover:bg-gray-100">Dashboard</a>

    <!-- Courses group (collapsible) -->
    <div class="mt-4">
      <button
        type="button"
        class="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100"
        aria-expanded={isCoursesOpen}
        aria-controls="courses-group"
        on:click={toggleCourses}
      >
        <span class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Cours</span>
        <span
          class="inline-block transition-transform duration-200"
          style={`transform: rotate(${isCoursesOpen ? 90 : 0}deg);`}
          aria-hidden="true"
        >›</span>
      </button>

      {#if isCoursesOpen}
        <ul id="courses-group" class="mt-1 space-y-1">
          <li>
            <a href="/admin/courses" class="block pl-6 pr-3 py-2 rounded-lg hover:bg-gray-100">
              Courses
            </a>
          </li>
          <li>
            <a href="/admin/chapters" class="block pl-6 pr-3 py-2 rounded-lg hover:bg-gray-100">
              Chapters
            </a>
          </li>
          <li>
            <a href="/admin/lessons" class="block pl-6 pr-3 py-2 rounded-lg hover:bg-gray-100">
              Lessons
            </a>
          </li>
        </ul>
      {/if}
    </div>

    <!-- Other links -->
    <a href="/admin/users" class="block px-3 py-2 rounded-lg hover:bg-gray-100">Users</a>
    <!-- Add more sections as needed -->
  </nav>

  <!-- Logout button pinned at the bottom -->
  <form method="POST" action="/logout" class="mt-auto p-4">
    <button
      type="submit"
      class="w-full inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold
             bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:outline-none
             focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition
             cursor-pointer"
      aria-label="Log out"
    >
      <span class="mr-2">⎋</span>
      Log out
    </button>
  </form>
</aside>

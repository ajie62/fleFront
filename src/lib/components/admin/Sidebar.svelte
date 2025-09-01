<script lang="ts">
  // All code/comments in EN (project rule)
  import { onMount } from 'svelte';
  import { currentPath } from '$lib/stores/pagePath';

  export let isMobile: boolean = false;
  export let onClose: () => void = () => {};

  // Collapsible "Cours" section (collapsed by default, persisted)
  let isCoursesOpen = false;
  const STORAGE_KEY = 'sidebar.courses.open';

  onMount(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) isCoursesOpen = saved === '1';
    } catch {
      // ignore storage errors
    }
  });

  function toggleCourses() {
    isCoursesOpen = !isCoursesOpen;
    try {
      localStorage.setItem(STORAGE_KEY, isCoursesOpen ? '1' : '0');
    } catch {
      // ignore storage errors
    }
  }

  // --- Active route helpers -------------------------------------------------
  // Exact match: '/path' and '/path?query=...' only
  function isActiveExact(path: string): boolean {
    const p = $currentPath || '';
    return p === path || p.startsWith(path + '?');
  }

  // Under a base path (subpaths): '/path/*' or '/path?query=...'
  function isActiveUnder(path: string): boolean {
    const p = $currentPath || '';
    return p === path || p.startsWith(path + '/') || p.startsWith(path + '?');
  }

  // "All courses" should be on for /admin/courses and its subpages,
  // but NOT for the builder route.
  function isActiveCoursesList(): boolean {
    return isActiveUnder('/admin/courses') && !isActiveExact('/admin/courses/builder');
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
        class="text-sm underline cursor-pointer"
        on:click={onClose}
        aria-label="Close sidebar"
      >Close</button>
    {/if}
  </div>

  <!-- Navigation -->
  <nav class="p-3 space-y-2 overflow-y-auto">
    <!-- Dashboard -->
    <a
      href="/admin"
      class="block px-3 py-2 rounded-lg hover:bg-gray-100"
      class:bg-gray-100={isActiveExact('/admin')}
      class:font-medium={isActiveExact('/admin')}
      aria-current={isActiveExact('/admin') ? 'page' : undefined}
    >Dashboard</a>

    <!-- Cours (collapsible) -->
    <div class="mt-2">
      <button
        type="button"
        class="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
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
          <!-- Course Builder -->
          <li>
            <a
              href="/admin/courses/builder"
              class="block pl-6 pr-3 py-2 rounded-lg hover:bg-gray-100"
              class:bg-gray-100={isActiveExact('/admin/courses/builder')}
              class:font-medium={isActiveExact('/admin/courses/builder')}
              aria-current={isActiveExact('/admin/courses/builder') ? 'page' : undefined}
            >Course Builder</a>
          </li>

          <!-- All courses (list) -->
          <li>
            <a
              href="/admin/courses"
              class="block pl-6 pr-3 py-2 rounded-lg hover:bg-gray-100"
              class:bg-gray-100={isActiveCoursesList()}
              class:font-medium={isActiveCoursesList()}
              aria-current={isActiveCoursesList() ? 'page' : undefined}
            >All courses</a>
          </li>
        </ul>
      {/if}
    </div>

    <!-- Example: other root link -->
    <a
      href="/admin/users"
      class="block px-3 py-2 rounded-lg hover:bg-gray-100"
      class:bg-gray-100={isActiveExact('/admin/users')}
      class:font-medium={isActiveExact('/admin/users')}
      aria-current={isActiveExact('/admin/users') ? 'page' : undefined}
    >Users</a>
  </nav>

  <!-- Logout button pinned at the bottom -->
  <form method="POST" action="/logout" class="mt-auto p-4">
    <button
      type="submit"
      class="w-full inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold
             bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:outline-none
             focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition cursor-pointer"
      aria-label="Log out"
    >
      <span class="mr-2">⎋</span>
      Log out
    </button>
  </form>
</aside>

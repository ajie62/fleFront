<script lang="ts">
  // All code/comments in EN (project rule)
  import { onMount, onDestroy } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { currentPath } from '$lib/stores/pagePath';
  import Sidebar from '$lib/components/admin/Sidebar.svelte';
  import SidebarToggle from '$lib/components/admin/SidebarToggle.svelte';
  import '../../../app.css';

  let sidebarOpen = false;

  // Close sidebar on Escape key (mobile overlay UX)
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && sidebarOpen) {
      sidebarOpen = false;
    }
  };

  onMount(() => {
    // Everything inside onMount is client-only
    if (typeof window !== 'undefined') {
      currentPath.set(window.location.pathname);

      // Close mobile sidebar when viewport switches to desktop (md+)
      const mediaQuery = window.matchMedia('(min-width: 768px)');
      const handleResize = (e: MediaQueryListEvent) => {
        if (e.matches) sidebarOpen = false;
      };

      // Initial check
      if (mediaQuery.matches) sidebarOpen = false;

      // Listeners
      mediaQuery.addEventListener('change', handleResize);
      window.addEventListener('keydown', handleKeydown);

      // Cleanup on unmount (client-only)
      onDestroy(() => {
        // Guard for safety in edge rendering paths
        if (typeof window !== 'undefined') {
          mediaQuery.removeEventListener('change', handleResize);
          window.removeEventListener('keydown', handleKeydown);
        }
      });
    }
  });

  // afterNavigate is client-only, but keep it simple and defensive
  afterNavigate((nav) => {
    sidebarOpen = false; // Always close the mobile sidebar after navigation
    const path = nav.to?.url.pathname || '';
    currentPath.set(path);
  });

  function openSidebar() {
    sidebarOpen = true;
  }
  function closeSidebar() {
    sidebarOpen = false;
  }
</script>

<!-- TOP BAR (mobile only) -->
<div class="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white">
  <!-- Use SidebarToggle directly (it renders a <button> internally).
       Pass the required onClick prop; no outer <button> to avoid button-in-button. -->
  <SidebarToggle onClick={openSidebar}></SidebarToggle>
  <h1 class="text-lg font-semibold text-gray-800">Admin</h1>
</div>

<div class="min-h-screen flex bg-gray-100 relative">
  {#if sidebarOpen}
    <!-- Mobile overlay (click to close). No self-closing HTML tags. -->
    <div
      class="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] md:hidden"
      aria-hidden="true"
      on:click={closeSidebar}
    ></div>
  {/if}

  <!-- Sidebar mobile (slides over) -->
  {#if sidebarOpen}
    <Sidebar isMobile={true} onClose={closeSidebar}></Sidebar>
  {/if}

  <!-- Sidebar desktop (persistent) -->
  <div class="hidden md:block">
    <Sidebar></Sidebar>
  </div>

  <!-- Main content -->
  <main class="flex-1 p-6 w-full overflow-x-hidden">
    <slot></slot>
  </main>
</div>

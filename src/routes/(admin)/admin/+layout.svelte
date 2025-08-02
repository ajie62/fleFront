<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { currentPath } from '$lib/stores/pagePath';
  import Sidebar from '$lib/components/admin/Sidebar.svelte';
  import SidebarToggle from '$lib/components/admin/SidebarToggle.svelte';
  import '../../../app.css';

  let sidebarOpen = false;

  onMount(() => {
    currentPath.set(window.location.pathname);

    // ✅ Fermer la sidebar mobile quand on passe en desktop
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleResize = (e: MediaQueryListEvent) => {
        if (e.matches) {
        sidebarOpen = false;
        }
    };

    // Initial check
    if (mediaQuery.matches) {
        sidebarOpen = false;
    }

    // Ajout de l'écouteur
    mediaQuery.addEventListener('change', handleResize);

    return () => {
        mediaQuery.removeEventListener('change', handleResize);
    };
  });

  afterNavigate((nav) => {
    currentPath.set(nav.to?.url.pathname || '');
    sidebarOpen = false; // fermer la sidebar mobile à chaque navigation
  });
</script>

<!-- TOP BAR (mobile only) -->
<div class="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white">
  <SidebarToggle onClick={() => (sidebarOpen = true)} />
  <h1 class="text-lg font-semibold text-gray-800">Admin</h1>
</div>

<div class="min-h-screen flex bg-gray-100 relative">
  <!-- Sidebar desktop & mobile -->
  {#if sidebarOpen}
    <Sidebar isMobile={true} onClose={() => (sidebarOpen = false)} />
  {/if}

  <div class="hidden md:block">
    <Sidebar />
  </div>

  <!-- Main content -->
  <main class="flex-1 p-6 w-full overflow-x-hidden">
    <slot />
  </main>
</div>
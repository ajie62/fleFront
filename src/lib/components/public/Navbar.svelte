<script lang="ts">
  let isOpen = false;
</script>

<nav class="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
  <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    <a href="/" class="text-xl font-bold text-gray-800">MonSite</a>

    <!-- Menu Hamburger -->
    <button
      class="sm:hidden text-gray-700 focus:outline-none"
      on:click={() => (isOpen = !isOpen)}
      aria-label="Toggle menu"
    >
      <!-- Icône SVG -->
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Menu Desktop -->
    <div class="hidden sm:flex space-x-4">
      <a href="/" class="text-gray-700 hover:text-blue-500">Accueil</a>
      <a href="/about" class="text-gray-700 hover:text-blue-500">À propos</a>
      <a href="/login" class="text-gray-700 hover:text-blue-500">Connexion</a>
    </div>
  </div>

  <!-- Menu Mobile (absolute and overlaying content) -->
  {#if isOpen}
    <div
      class="sm:hidden absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start px-4 py-2 z-40"
    >
      <a href="/" class="py-2 text-gray-700 hover:text-blue-500 w-full">Accueil</a>
      <a href="/about" class="py-2 text-gray-700 hover:text-blue-500 w-full">À propos</a>
      <a href="/login" class="py-2 text-gray-700 hover:text-blue-500 w-full">Connexion</a>
    </div>
  {/if}
</nav>

<div class="pt-10"></div>
<slot />

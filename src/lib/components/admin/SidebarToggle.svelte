<script lang="ts">
  export let onClick: () => void;
</script>

<button
  class="md:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
  on:click={onClick}
  aria-label="Open menu"
>
  <!-- Icône burger (3 barres) -->
  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>

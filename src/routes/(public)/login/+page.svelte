<script lang="ts">
  export let data: {
    error: string;
    email: string;
  };
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <form method="POST" class="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
    <h1 class="text-2xl font-bold text-center text-gray-800">Connexion</h1>

    {#if data.error}
      <div class="bg-red-100 text-red-700 p-3 rounded text-sm">{data.error}</div>
    {/if}

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Adresse e-mail</label>
      <input
        type="email"
        name="email"
        id="email"
        class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        value={data.email}
        required
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
      <input
        type="password"
        name="password"
        id="password"
        class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        required
      />
    </div>

    <button
      type="submit"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer"
    >
      Se connecter
    </button>
  </form>
</div>
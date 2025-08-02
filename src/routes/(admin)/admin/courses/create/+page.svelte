<script lang="ts">
  import { goto } from '$app/navigation';

  let title = '';
  let description = '';
  let level: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  let isPublished = false;
  let error: string | null = null;

  async function submitForm(event: SubmitEvent) {
    event.preventDefault();
    error = null;

    try {
      const response = await fetch('http://localhost:8000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json'
          // PAS de Authorization ici — on s'appuie sur le cookie httpOnly
        },
        credentials: 'include', // essentiel pour que le cookie soit envoyé
        body: JSON.stringify({ title, description, level, isPublished })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Erreur lors de la création du cours.');
      }

      await goto('/admin/courses');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Erreur inconnue';
    }
  }
</script>

<section class="px-4 sm:px-6 py-8">
  <div class="max-w-3xl mx-auto">
    <h1 class="text-4xl font-bold text-gray-800 mb-6">Créer un cours</h1>

    {#if error}
      <p class="text-red-600 mb-4">{error}</p>
    {/if}

    <form on:submit={submitForm} class="space-y-6 bg-white p-6 rounded-xl shadow">
      <div>
        <label for="title" class="block text-gray-700 font-medium mb-1">Titre</label>
        <input id="title" bind:value={title} required class="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label for="description" class="block text-gray-700 font-medium mb-1">Description</label>
        <textarea id="description" bind:value={description} required class="w-full border rounded px-3 py-2 h-32"></textarea>
      </div>

      <div>
        <label for="level" class="block text-gray-700 font-medium mb-1">Niveau</label>
        <select id="level" bind:value={level} class="w-full border rounded px-3 py-2">
          <option value="beginner">Débutant</option>
          <option value="intermediate">Intermédiaire</option>
          <option value="advanced">Avancé</option>
        </select>
      </div>

      <div class="flex items-center">
        <input id="isPublished" type="checkbox" bind:checked={isPublished} class="mr-2" />
        <label for="isPublished" class="text-gray-700">Publié</label>
      </div>

      <div class="text-right">
        <button
          type="submit"
          class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Enregistrer
        </button>
      </div>
    </form>
  </div>
</section>
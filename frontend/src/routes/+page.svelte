<script lang="ts">
	import { onMount } from 'svelte';

	interface Bar {
		id: number;
		name: string;
		adresse: string;
		tel?: string;
		email: string;
		description?: string;
	}

	let bars: Bar[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('http://localhost:3000/bars');
			if (!response.ok) {
				throw new Error(`Erreur: ${response.status}`);
			}
			bars = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Une erreur est survenue';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Liste des Bars</title>
	<meta name="description" content="Découvrez notre sélection de bars" />
</svelte:head>

<section class="max-w-7xl mx-auto p-8">
	<h1 class="text-center mb-8">Liste des Bars</h1>

	{#if loading}
		<p class="text-center py-8">Chargement des bars...</p>
	{:else if error}
		<p class="text-center py-8 text-red-600">Erreur: {error}</p>
	{:else if bars.length === 0}
		<p class="text-center py-8">Aucun bar trouvé.</p>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each bars as bar}
				<div class="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
					<h2 class="mt-0 mb-4 text-gray-800">{bar.name}</h2>
					<p class="mb-2"><strong>Adresse:</strong> {bar.adresse}</p>
					{#if bar.tel}
						<p><strong>Téléphone:</strong> {bar.tel}</p>
					{/if}
					<p><strong>Email:</strong> {bar.email}</p>
					{#if bar.description}
						<p class="mt-4 italic text-gray-600">{bar.description}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>
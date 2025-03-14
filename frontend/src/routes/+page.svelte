<script lang="ts">
	import { onMount } from 'svelte';
	import type { Bar } from '../types/interfaces';

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
	<h1 class="text-center text-amber-800 text-3xl font-bold mb-8">Liste des Bars</h1>

	{#if loading}
		<p class="text-center py-8 text-amber-800">Chargement des bars...</p>
	{:else if error}
		<p class="text-center py-8 text-red-600">Erreur: {error}</p>
	{:else if bars.length === 0}
		<p class="text-center py-8 text-amber-800">Aucun bar trouvé.</p>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each bars as bar}
				<div class="bg-amber-100 rounded-md p-6 shadow-md hover:bg-amber-200 transition-all duration-200 border border-amber-300">
					<h2 class="mt-0 mb-4 text-amber-800 font-semibold text-xl">{bar.name}</h2>
					<p class="mb-2 text-amber-900"><strong>Adresse:</strong> {bar.adresse}</p>
					{#if bar.tel}
						<p class="text-amber-900"><strong>Téléphone:</strong> {bar.tel}</p>
					{/if}
					<p class="text-amber-900"><strong>Email:</strong> {bar.email}</p>
					{#if bar.description}
						<p class="mt-4 italic text-amber-700">{bar.description}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>
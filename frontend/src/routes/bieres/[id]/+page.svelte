<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    type Beer = {
        id: number;
        name: string;
        description?: string;
        degree: number;
        prix: number;
        bars_id?: number;
        createdAt?: string;
        updatedAt?: string;
    };

    let beer: Beer | null = null;
    let loading = true;
    let error: string | null = null;
    let relatedBarName: string | null = null;

    onMount(async () => {
        await fetchBeerDetails();
    });

    async function fetchBeerDetails() {
        const id = $page.params.id;

        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

            const response = await fetch(`http://localhost:3000/biere/${id}`, {
                headers: token ? {
                    'Authorization': `Bearer ${token}`
                } : {}
            });

            if (!response.ok) {
                throw new Error(`Erreur: ${response.status}`);
            }

            beer = await response.json();

            // If beer is associated with a bar, fetch the bar's name
            if (beer?.bars_id) {
                const barResponse = await fetch(`http://localhost:3000/bars/${beer.bars_id}`, {
                    headers: token ? {
                        'Authorization': `Bearer ${token}`
                    } : {}
                });

                if (barResponse.ok) {
                    const barData = await barResponse.json();
                    relatedBarName = barData.name;
                }
            }
        } catch (err) {
            error = err instanceof Error ? err.message : 'Une erreur est survenue';
        } finally {
            loading = false;
        }
    }

    function goBack() {
        goto('/bieres');
    }

    function formatDate(dateString: string) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    }
</script>

<svelte:head>
    <title>{beer ? beer.name : 'Détails de la bière'}</title>
    <meta name="description" content={beer?.description || 'Détails d\'une bière'} />
</svelte:head>

<section class="max-w-2xl mx-auto p-8">
    <div class="mb-6">
        <button
                on:click={goBack}
                class="text-blue-500 hover:text-blue-700 flex items-center"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la liste des bières
        </button>
    </div>

    {#if loading}
        <div class="text-center py-12">
            <p class="text-gray-600">Chargement des détails de la bière...</p>
        </div>
    {:else if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p class="font-bold">Erreur</p>
            <p>{error}</p>
        </div>
    {:else if !beer}
        <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6" role="alert">
            <p>La bière demandée n'existe pas ou a été supprimée.</p>
        </div>
    {:else}
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-8 shadow-md">
            <h1 class="text-3xl font-bold text-amber-800 mb-6">{beer.name}</h1>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div class="mb-6">
                        <h2 class="text-lg font-semibold text-amber-700 mb-2">Caractéristiques</h2>
                        <div class="bg-white p-4 rounded-md shadow-sm">
                            <p class="mb-2"><span class="font-semibold">Degré d'alcool:</span> {beer.degree}%</p>
                            <p><span class="font-semibold">Prix:</span> {beer.prix.toFixed(2)}€</p>
                        </div>
                    </div>

                    {#if relatedBarName}
                        <div class="mb-6">
                            <h2 class="text-lg font-semibold text-amber-700 mb-2">Bar associé</h2>
                            <div class="bg-white p-4 rounded-md shadow-sm">
                                <p>{relatedBarName}</p>
                                <a
                                        href={`/bars/${beer.bars_id}`}
                                        class="text-blue-500 hover:text-blue-700 mt-2 inline-block"
                                >
                                    Voir le bar
                                </a>
                            </div>
                        </div>
                    {/if}
                </div>

                <div>
                    {#if beer.description}
                        <div class="mb-6">
                            <h2 class="text-lg font-semibold text-amber-700 mb-2">Description</h2>
                            <div class="bg-white p-4 rounded-md shadow-sm">
                                <p>{beer.description}</p>
                            </div>
                        </div>
                    {/if}

                    <div class="mb-6">
                        <h2 class="text-lg font-semibold text-amber-700 mb-2">Informations</h2>
                        <div class="bg-white p-4 rounded-md shadow-sm">
                            {#if beer.createdAt}
                                <p class="mb-2"><span class="font-semibold">Ajoutée le:</span> {formatDate(beer.createdAt)}</p>
                            {/if}
                            {#if beer.updatedAt}
                                <p><span class="font-semibold">Dernière mise à jour:</span> {formatDate(beer.updatedAt)}</p>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</section>
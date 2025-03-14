<script lang="ts">
    import { onMount } from 'svelte';

    // Formulaire d'ajout de bière
    let name = '';
    let alcoholContent = '';
    let price = '';
    let description = '';
    let loading = false;
    let error: string | null = null;
    let successMessage: string | null = null;
    
    // Liste des bières
    type Beer = {
        id: string;
        name: string;
        alcoholContent: number;
        price: number;
        description?: string;
    };
    
    let beers: Beer[] = [];
    let filteredBeers: Beer[] = [];
    
    // Pagination
    let currentPage = 1;
    let itemsPerPage = 5;
    let totalPages = 0;
    
    // Filtres et tri
    let sortOrder: 'asc' | 'desc' = 'asc';
    let minAlcohol = '';
    let maxAlcohol = '';
    let minPrice = '';
    let maxPrice = '';

    onMount(async () => {
        await fetchBeers();
    });

    const fetchBeers = async () => {
        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) {
                error = 'Vous devez être connecté pour voir la liste des bières';
                return;
            }

            const response = await fetch('http://localhost:3000/biere', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des bières');
            }
            
            const data = await response.json();
            beers = data;
            applyFiltersAndSort();
        } catch (err) {
            error = err instanceof Error ? err.message : 'Une erreur est survenue';
        }
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        loading = true;
        error = null;
        successMessage = null;
        
        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) {
                throw new Error('Vous devez être connecté pour ajouter une bière');
            }

            const beerData = {
                name,
                alcoholContent: parseFloat(alcoholContent),
                price: parseFloat(price),
                description: description || undefined
            };

            const response = await fetch('http://localhost:3000/biere', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(beerData)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Échec de l\'ajout de la bière');
            }
            
            successMessage = 'Bière ajoutée avec succès!';
            
            // Réinitialiser le formulaire
            name = '';
            alcoholContent = '';
            price = '';
            description = '';
            
            // Actualiser la liste
            await fetchBeers();
            
        } catch (err) {
            error = err instanceof Error ? err.message : 'Une erreur est survenue';
        } finally {
            loading = false;
        }
    };
    
    const deleteBeer = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette bière?')) {
            return;
        }
        
        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) {
                throw new Error('Vous devez être connecté pour supprimer une bière');
            }

            const response = await fetch(`http://localhost:3000/biere/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Échec de la suppression');
            }
            
            successMessage = 'Bière supprimée avec succès!';
            
            // Actualiser la liste
            await fetchBeers();
            
        } catch (err) {
            error = err instanceof Error ? err.message : 'Une erreur est survenue';
        }
    };
    
    const editBeer = async (id: string) => {
        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) {
                error = 'Vous devez être connecté pour modifier une bière';
                return;
            }
            
            // Rediriger vers la page d'édition
            window.location.href = `/edit-beer/${id}`;
            
        } catch (err) {
            error = err instanceof Error ? err.message : 'Une erreur est survenue';
        }
    };
    
    const applyFiltersAndSort = () => {
        filteredBeers = [...beers];
        
        // Filtres de prix
        if (minPrice) {
            filteredBeers = filteredBeers.filter(beer => beer.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
            filteredBeers = filteredBeers.filter(beer => beer.price <= parseFloat(maxPrice));
        }
        
        // Filtres d'alcool
        if (minAlcohol) {
            filteredBeers = filteredBeers.filter(beer => beer.alcoholContent >= parseFloat(minAlcohol));
        }
        if (maxAlcohol) {
            filteredBeers = filteredBeers.filter(beer => beer.alcoholContent <= parseFloat(maxAlcohol));
        }
        
        // Tri par nom
        filteredBeers.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        
        // Calcul du nombre total de pages
        totalPages = Math.ceil(filteredBeers.length / itemsPerPage);
        if (currentPage > totalPages) {
            currentPage = totalPages > 0 ? totalPages : 1;
        }
    };
    
    $: {
        // Recalculer les filtres dès qu'il y a un changement dans la liste ou dans les valeurs de filtres
        if (beers) {
            applyFiltersAndSort();
        }
    }
    
    const clearFilters = () => {
        minAlcohol = '';
        maxAlcohol = '';
        minPrice = '';
        maxPrice = '';
        sortOrder = 'asc';
        currentPage = 1;
    };
    
    const changePage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
    };
    
    // Bières à afficher sur la page actuelle
    $: displayedBeers = filteredBeers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
</script>

<svelte:head>
    <title>Ajout de bières</title>
    <meta name="description" content="Ajouter et gérer des bières" />
</svelte:head>

<section class="max-w-md mx-auto p-8">
    <h1 class="text-center mb-8">Ajout de bières</h1>
    
    <!-- Messages -->
    {#if successMessage}
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{successMessage}</p>
        </div>
    {/if}
    
    {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{error}</p>
        </div>
    {/if}
    
    <!-- Formulaire d'ajout -->
    <form on:submit={handleSubmit} class="bg-gray-50 rounded-lg p-6 shadow-sm mb-8">
        <div class="mb-4">
            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nom</label>
            <input
                type="text"
                id="name"
                bind:value={name}
                required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nom de la bière"
            />
        </div>
        
        <div class="mb-4">
            <label for="alcoholContent" class="block text-gray-700 text-sm font-bold mb-2">
                Degré d'alcool (%)
            </label>
            <input
                type="number"
                id="alcoholContent"
                bind:value={alcoholContent}
                min="0"
                step="0.1"
                required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="5.0"
            />
        </div>
        
        <div class="mb-4">
            <label for="price" class="block text-gray-700 text-sm font-bold mb-2">
                Prix (€)
            </label>
            <input
                type="number"
                id="price"
                bind:value={price}
                min="0"
                step="0.01"
                required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="4.50"
            />
        </div>
        
        <div class="mb-6">
            <label for="description" class="block text-gray-700 text-sm font-bold mb-2">
                Description (optionnel)
            </label>
            <textarea
                id="description"
                bind:value={description}
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Description de la bière"
                rows="3"
            ></textarea>
        </div>
        
        <div class="flex items-center justify-center">
            <button
                type="submit"
                disabled={loading}
                class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:opacity-50"
            >
                {loading ? 'Ajout en cours...' : 'Ajouter la bière'}
            </button>
        </div>
    </form>
    
    <!-- Filtres et tri -->
    <div class="bg-gray-50 rounded-lg p-6 shadow-sm mb-8">
        <h2 class="font-semibold mb-4">Filtres et tri</h2>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Tri</label>
                <select 
                    bind:value={sortOrder}
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                >
                    <option value="asc">A → Z</option>
                    <option value="desc">Z → A</option>
                </select>
            </div>
            
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Par page</label>
                <select 
                    bind:value={itemsPerPage}
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Degré d'alcool (%)</label>
                <div class="flex space-x-2">
                    <input
                        type="number"
                        bind:value={minAlcohol}
                        min="0"
                        step="0.1"
                        placeholder="Min"
                        class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                    />
                    <input
                        type="number"
                        bind:value={maxAlcohol}
                        min="0"
                        step="0.1"
                        placeholder="Max"
                        class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>
            
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Prix (€)</label>
                <div class="flex space-x-2">
                    <input
                        type="number"
                        bind:value={minPrice}
                        min="0"
                        step="0.01"
                        placeholder="Min"
                        class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                    />
                    <input
                        type="number"
                        bind:value={maxPrice}
                        min="0"
                        step="0.01"
                        placeholder="Max"
                        class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>
        </div>
        
        <button
            on:click={clearFilters}
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
            Réinitialiser les filtres
        </button>
    </div>
    
    <!-- Liste des bières -->
    <div class="bg-gray-50 rounded-lg p-6 shadow-sm">
        <h2 class="font-semibold mb-4">Liste des bières</h2>
        
        {#if displayedBeers.length === 0}
            <p class="text-center text-gray-600 py-4">Aucune bière trouvée</p>
        {:else}
            <div class="space-y-4">
                {#each displayedBeers as beer}
                    <div class="border p-4 rounded flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <p class="font-bold">{beer.name}</p>
                            <p>Degré d'alcool: {beer.alcoholContent}%</p>
                            <p>Prix: {beer.price}€</p>
                            {#if beer.description}
                                <p>Description: {beer.description}</p>
                            {/if}
                        </div>
                        <div class="flex space-x-2 mt-2 md:mt-0">
                            <button on:click={() => editBeer(beer.id)} class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded">
                                Modifier
                            </button>
                            <button on:click={() => deleteBeer(beer.id)} class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded">
                                Supprimer
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
        
        <!-- Pagination -->
        {#if totalPages > 1}
            <div class="flex justify-center mt-6 space-x-2">
                <button 
                    on:click={() => changePage(currentPage - 1)} 
                    disabled={currentPage === 1} 
                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                    Précédent
                </button>
                {#each Array(totalPages) as _, index}
                    <button 
                        on:click={() => changePage(index + 1)} 
                        class="px-3 py-2 rounded {currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}"
                    >
                        {index + 1}
                    </button>
                {/each}
                <button 
                    on:click={() => changePage(currentPage + 1)} 
                    disabled={currentPage === totalPages} 
                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                    Suivant
                </button>
            </div>
        {/if}
    </div>
</section>

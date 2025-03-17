<script lang="ts">
    import { onMount } from 'svelte';


    let name = '';
    let addresse = '';
    let tel = '';
    let email = '';
    let description = '';
    let loading = false;
    let error: string | null = null;
    let successMessage: string | null = null;
    let isAuthenticated = false;


    onMount(() => {
        // Check authentication on page load
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        isAuthenticated = !!token;
    });

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        loading = true;
        error = null;
        try {
            // Récupérer le token d'authentification
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) {
                throw new Error('Vous devez être connecté pour ajouter un bar');
            }


            const response = await fetch('http://localhost:3000/bars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    addresse,
                    tel,
                    email,
                    description
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Échec de l\'ajout du bar');
            }

            successMessage = 'Bar ajouté avec succès!';

            // Réinitialiser le formulaire
            name = '';
            addresse = '';
            tel = '';
            email = '';
            description = '';

            // Rediriger vers la liste des bars après un court délai
            setTimeout(() => {
                window.location.href = '/bars';
            }, 2000);

        } catch (err) {
            error = err instanceof Error ? err.message : 'Une erreur est survenue';
        } finally {
            loading = false;
        }
    };
</script>

<svelte:head>
    <title>Ajouter un bar</title>
    <meta name="description" content="Ajouter un nouveau bar à notre plateforme" />
</svelte:head>

<section class="max-w-md mx-auto p-8">
    <h1 class="text-center mb-8">Ajout de bars</h1>

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

    {#if isAuthenticated}
        <form on:submit={handleSubmit} class="bg-gray-50 rounded-lg p-6 shadow-sm">

            <div class="mb-4">
                <label for="name" class="block text-gray-700 text-sm font-bold mb-2">
                    Nom
                </label>
                <input
                        type="text"
                        id="name"
                        bind:value={name}
                        required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Nom du bar"
                />
            </div>

            <div class="mb-4">
                <label for="address" class="block text-gray-700 text-sm font-bold mb-2">
                    Adresse
                </label>
                <input
                        type="text"
                        id="address"
                        bind:value={addresse}
                        required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="123 rue Example, Ville"
                />
            </div>

            <div class="mb-4">
                <label for="tel" class="block text-gray-700 text-sm font-bold mb-2">
                    Téléphone
                </label>
                <input
                        type="tel"
                        id="tel"
                        bind:value={tel}
                        required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="01 23 45 67 89"
                />
            </div>

            <div class="mb-4">
                <label for="email" class="block text-gray-700 text-sm font-bold mb-2">
                    Email
                </label>
                <input
                        type="email"
                        id="email"
                        bind:value={email}
                        required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="contact@bar.com"
                />
            </div>

            <div class="mb-6">
                <label for="description" class="block text-gray-700 text-sm font-bold mb-2">
                    Description
                </label>
                <textarea
                        id="description"
                        bind:value={description}
                        required
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Description du bar"
                        rows="3"
                ></textarea>
            </div>

            <div class="flex items-center justify-center">
                <button
                        type="submit"
                        disabled={loading}
                        class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:opacity-50"
                >
                    {loading ? 'Ajout en cours...' : 'Ajouter le bar'}
                </button>
            </div>
        </form>
    {:else}
        <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6" role="alert">
            <p class="font-bold mb-2">Vous n'êtes pas connecté</p>
            <p>Veuillez vous connecter pour ajouter un bar.</p>
            <div class="mt-4 text-center">
                <a href="/login" class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">
                    Se connecter
                </a>
            </div>
        </div>
    {/if}

    <div class="mt-6 text-center">
        <a href="/bars" class="text-sm text-blue-500 hover:text-blue-800">
            Retour à la liste des bars
        </a>
    </div>
</section>
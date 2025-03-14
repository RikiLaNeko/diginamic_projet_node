<script lang="ts">

	import {onMount} from "svelte";

	let name = '';
	let password = '';
	let rememberMe = false;
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
			const response = await fetch('http://localhost:3000/users/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name, password, rememberMe })
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Échec de la connexion');
			}

			// Stocker le token dans localStorage ou sessionStorage selon "rememberMe"
			const storage = rememberMe ? localStorage : sessionStorage;
			storage.setItem('authToken', data.token);
			storage.setItem('user', JSON.stringify(data.user));

			successMessage = 'Connexion réussie!';

			// Rediriger vers la page d'accueil après un court délai
			setTimeout(() => {
				window.location.href = '/';
			}, 1000);

		} catch (err) {
			error = err instanceof Error ? err.message : 'Une erreur est survenue';
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Connexion</title>
	<meta name="description" content="Connectez-vous à votre compte" />
</svelte:head>

<section class="max-w-md mx-auto p-8">
	<h1 class="text-center mb-8">Connexion</h1>

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

	<form on:submit={handleSubmit} class="bg-gray-50 rounded-lg p-6 shadow-sm">
		<div class="mb-4">
			<label for="username" class="block text-gray-700 text-sm font-bold mb-2">
				Nom d'utilisateur
			</label>
			<input
				type="text"
				id="username"
				bind:value={name}
				required
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				placeholder="votre nom d'utilisateur"
			/>
		</div>

		<div class="mb-6">
			<label for="password" class="block text-gray-700 text-sm font-bold mb-2">
				Mot de passe
			</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				required
				class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				placeholder="••••••••"
			/>
		</div>

		<div class="mb-6 flex items-center">
			<input
				type="checkbox"
				id="rememberMe"
				bind:checked={rememberMe}
				class="mr-2"
			/>
			<label for="rememberMe" class="text-sm text-gray-700">
				Se souvenir de moi
			</label>
		</div>

		<div class="flex flex-col items-center">
			<button
				type="submit"
				disabled={loading}
				class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:opacity-50 mb-4"
			>
				{loading ? 'Connexion en cours...' : 'Se connecter'}
			</button>

			<a href="/forgot-password" class="text-sm text-blue-500 hover:text-blue-800">
				Mot de passe oublié?
			</a>
		</div>

		<div class="mt-6 text-center pt-4 border-t border-gray-200">
			<p class="text-sm text-gray-600">
				Pas encore de compte?
				<a href="/register" class="font-bold text-blue-500 hover:text-blue-800">
					S'inscrire
				</a>
			</p>
		</div>
	</form>
</section>
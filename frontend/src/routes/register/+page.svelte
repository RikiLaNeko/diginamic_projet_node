<script lang="ts">
	import { onMount } from 'svelte';

	let username = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let acceptTerms = false;
	let loading = false;
	let error: string | null = null;
	let successMessage: string | null = null;

	const handleSubmit = async (e: Event) => {
		e.preventDefault();

		// Vérification simple des mots de passe
		if (password !== confirmPassword) {
			error = 'Les mots de passe ne correspondent pas';
			return;
		}

		// Vérification des conditions
		if (!acceptTerms) {
			error = 'Veuillez accepter les conditions d\'utilisation';
			return;
		}

		loading = true;
		error = null;

		try {
			const response = await fetch('http://localhost:3000/users/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: username,
					email,
					password
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Échec de l\'inscription');
			}

			successMessage = 'Inscription réussie ! Vous allez être redirigé vers la page de connexion.';

			// Rediriger vers la page de connexion après un court délai
			setTimeout(() => {
				window.location.href = '/login';
			}, 2000);

		} catch (err) {
			error = err instanceof Error ? err.message : 'Une erreur est survenue';
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Inscription</title>
	<meta name="description" content="Créez votre compte" />
</svelte:head>

<section class="max-w-md mx-auto p-8">
	<h1 class="text-center mb-8">Créer un compte</h1>

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
					bind:value={username}
					required
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					placeholder="Votre nom d'utilisateur"
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
					placeholder="votre@email.com"
			/>
		</div>

		<div class="mb-4">
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

		<div class="mb-6">
			<label for="confirmPassword" class="block text-gray-700 text-sm font-bold mb-2">
				Confirmer le mot de passe
			</label>
			<input
					type="password"
					id="confirmPassword"
					bind:value={confirmPassword}
					required
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					placeholder="••••••••"
			/>
		</div>

		<div class="mb-6 flex items-center">
			<input
					type="checkbox"
					id="acceptTerms"
					bind:checked={acceptTerms}
					required
					class="mr-2"
			/>
			<label for="acceptTerms" class="text-sm text-gray-700">
				J'accepte les <a href="/terms" class="text-blue-500 hover:text-blue-800">conditions d'utilisation</a>
			</label>
		</div>

		<div class="flex flex-col items-center">
			<button
					type="submit"
					disabled={loading}
					class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:opacity-50"
			>
				{loading ? 'Inscription en cours...' : 'S\'inscrire'}
			</button>
		</div>

		<div class="mt-6 text-center pt-4 border-t border-gray-200">
			<p class="text-sm text-gray-600">
				Vous avez déjà un compte?
				<a href="/login" class="font-bold text-blue-500 hover:text-blue-800">
					Se connecter
				</a>
			</p>
		</div>
	</form>
</section>
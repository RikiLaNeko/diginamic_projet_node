<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Store for authentication state
	const user = writable(null);

	// Toggle mobile menu
	let isMenuOpen = false;
	const toggleMenu = () => isMenuOpen = !isMenuOpen;

	// Check if user is logged in on mount
	onMount(() => {
		const token = localStorage.getItem('token');
		if (token) {
			// You could fetch user info here if needed
			user.set({ token });
		}
	});

	// Logout function
	function logout() {
		localStorage.removeItem('token');
		user.set(null);
	}
</script>

<header class="bg-amber-800 text-white shadow-md">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<!-- Logo/Brand -->
			<div class="flex items-center">
				<a href="/" class="flex-shrink-0 flex items-center">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 mr-2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.309 48.309 0 0 1-8.135-1.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
					</svg>
					<span class="font-bold text-xl">BeerApp</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<nav class="hidden md:flex items-center space-x-4">
				<a href="/" class="px-3 py-2 hover:bg-amber-700 rounded-md">Accueil</a>
				<a href="/bars" class="px-3 py-2 hover:bg-amber-700 rounded-md">Bars</a>
				<a href="/bieres" class="px-3 py-2 hover:bg-amber-700 rounded-md">Bières</a>

				{#if $user}
					<a href="/commandes" class="px-3 py-2 hover:bg-amber-700 rounded-md">Commandes</a>
					<button on:click={logout} class="ml-4 px-4 py-2 bg-amber-900 hover:bg-amber-950 rounded-md">
						Déconnexion
					</button>
				{:else}
					<a href="/login" class="ml-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-md">
						Connexion
					</a>
					<a href="/register" class="px-4 py-2 bg-amber-900 hover:bg-amber-950 rounded-md">
						Inscription
					</a>
				{/if}
			</nav>

			<!-- Mobile menu button -->
			<div class="md:hidden flex items-center">
				<button on:click={toggleMenu} class="inline-flex items-center justify-center p-2 rounded-md hover:bg-amber-700 focus:outline-none">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						{#if isMenuOpen}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						{:else}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						{/if}
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Navigation -->
	{#if isMenuOpen}
		<div class="md:hidden">
			<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-amber-800">
				<a href="/" class="block px-3 py-2 rounded-md hover:bg-amber-700">Accueil</a>
				<a href="/bars" class="block px-3 py-2 rounded-md hover:bg-amber-700">Bars</a>
				<a href="/bieres" class="block px-3 py-2 rounded-md hover:bg-amber-700">Bières</a>

				{#if $user}
					<a href="/commandes" class="block px-3 py-2 rounded-md hover:bg-amber-700">Commandes</a>
					<button on:click={logout} class="w-full text-left px-3 py-2 rounded-md bg-amber-900 hover:bg-amber-950">
						Déconnexion
					</button>
				{:else}
					<a href="/login" class="block px-3 py-2 rounded-md bg-amber-600 hover:bg-amber-700">
						Connexion
					</a>
					<a href="/register" class="block px-3 py-2 rounded-md bg-amber-900 hover:bg-amber-950">
						Inscription
					</a>
				{/if}
			</div>
		</div>
	{/if}
</header>
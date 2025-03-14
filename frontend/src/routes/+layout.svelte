<script lang="ts">
	import Header from '../Components/Header.svelte';
	import Footer from "../Components/Footer.svelte";

	let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
	<Header />

	<main class="flex-1 flex flex-col p-4 w-full max-w-4xl mx-auto box-border">
		{@render children()}
	</main>

	<Footer />
</div>

<style>
</style>
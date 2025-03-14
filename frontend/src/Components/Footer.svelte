<script lang="ts">
    import { onMount } from 'svelte';

    const currentYear = new Date().getFullYear();
    const contributors = [
        "MABUSO Pierre",
        "KHLFI Wissem",
        "MORTREUX Chloe"
    ];

    let isExpanded = false;
    const toggleContributors = () => isExpanded = !isExpanded;
</script>

<footer class="bg-amber-800 text-white mt-auto">
    <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
            <!-- Brand -->
            <div class="flex items-center mb-4 md:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.309 48.309 0 0 1-8.135-1.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
                <span class="font-semibold text-lg">BeerApp</span>
            </div>

            <!-- Copyright -->
            <div class="mb-4 md:mb-0 text-sm">
                <p>&copy; 2025 - {currentYear} BeerApp - Bar Management API</p>
            </div>

            <!-- Contributor section -->
            <div class="relative">
                <button
                        on:click={toggleContributors}
                        class="flex items-center text-sm hover:text-amber-200 font-medium"
                >
                    <span>Contributors</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform transition-transform {isExpanded ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {#if isExpanded}
                    <div class="absolute right-0 bottom-full mb-2 text-sm bg-amber-900 p-2 rounded z-10">
                        {#each contributors as contributor}
                            <div>{contributor}</div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</footer>
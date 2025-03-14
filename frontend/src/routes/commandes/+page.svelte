<script lang="ts">
    import { onMount } from 'svelte';

    let clientName = '';
    let clientEmail = '';
    let orderDate = new Date().toISOString().split('T')[0];
    let orderStatus = 'pending';
    let orderItems: OrderItem[] = [{ beerId: '', quantity: 1, price: 0 }];
    let loading = false;
    let error: string | null = null;
    let successMessage: string | null = null;
    
    type OrderItem = {
        beerId: string;
        beerName?: string;
        quantity: number;
        price: number;
    };
    
    type Commande = {
        id: string;
        clientName: string;
        clientEmail: string;
        orderDate: string;
        orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
        orderItems: OrderItem[];
        totalAmount: number;
        createdAt: string;
        updatedAt: string;
    };
    
    type Beer = {
        id: string;
        name: string;
        price: number;
    };
    
    let beers: Beer[] = [];
    let commandes: Commande[] = [];
    let filteredCommandes: Commande[] = [];
    let currentPage = 1;
    let itemsPerPage = 5;
    let totalPages = 0;

    onMount(async () => {
        await fetchBeers();
        await fetchCommandes();
    });

    const fetchBeers = async () => {
        try {
            const response = await fetch('http://localhost:3000/beers');
            if (!response.ok) throw new Error('Erreur lors de la récupération des bières');
            beers = await response.json();
        } catch (err) {
            error = err instanceof Error ? err.message : 'Une erreur est survenue';
        }
    };

    const fetchCommandes = async () => {
        try {
            const response = await fetch('http://localhost:3000/commandes');
            if (!response.ok) throw new Error('Erreur lors de la récupération des commandes');
            commandes = await response.json();
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
            const orderData = {
                clientName,
                clientEmail,
                orderDate,
                orderStatus,
                orderItems,
                totalAmount: calculateTotal()
            };

            const response = await fetch('http://localhost:3000/commandes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) throw new Error('Échec de l\'ajout de la commande');
            successMessage = 'Commande ajoutée avec succès!';
            resetForm();
            await fetchCommandes();
        } catch (err) {
            error = err instanceof Error ? err.message : 'Une erreur est survenue';
        } finally {
            loading = false;
        }
    };

    const deleteCommande = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande?')) return;
        try {
            const response = await fetch(`http://localhost:3000/commandes/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Échec de la suppression');
            successMessage = 'Commande supprimée avec succès!';
            await fetchCommandes();
        } catch (err) {
            error = err instanceof Error ? err.message : 'Une erreur est survenue';
        }
    };

    const calculateTotal = (): number => {
        return orderItems.reduce((total, item) => total + item.price, 0);
    };

    const resetForm = () => {
        clientName = '';
        clientEmail = '';
        orderDate = new Date().toISOString().split('T')[0];
        orderStatus = 'pending';
        orderItems = [{ beerId: '', quantity: 1, price: 0 }];
    };
</script>

<section>
    <h1>Gestion des commandes</h1>
    <form on:submit={handleSubmit}>
        <input type="text" bind:value={clientName} placeholder="Nom du client" required />
        <input type="email" bind:value={clientEmail} placeholder="Email du client" required />
        <button type="submit" disabled={loading}>Ajouter</button>
    </form>
    
    {#if successMessage}<p>{successMessage}</p>{/if}
    {#if error}<p>{error}</p>{/if}
    
    <ul>
        {#each commandes as commande}
            <li>
                {commande.clientName} - {commande.orderDate} - {commande.totalAmount}€
                <button on:click={() => deleteCommande(commande.id)}>Supprimer</button>
            </li>
        {/each}
    </ul>
</section>
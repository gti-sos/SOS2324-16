<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    
    let player = [];

    onMount(async () => {
        player = await getData();
    });

    async function getData(){
        const url = 'https://gateway.marvel.com:443/v1/public/characters';
        const options = {
            method: 'GET',
            headers: {
                'apikey': 'd2dcbe61796e4bc64bbe06e46103ceb5',
                'hash': '294c820bf087a5c78d6d638ae97f92b50ad2079f'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            return result.results;
        } catch (error) {
            console.error(error);
        }
    }
    
   
</script>

<ul>

    {#each player as x}
        <li>{x.name}</li>
    {/each}
</ul>
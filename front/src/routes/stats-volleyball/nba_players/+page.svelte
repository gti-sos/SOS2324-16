<script>
    //@ts-nocheck
    import { onMount } from 'svelte';

    let jugadores=[];
    onMount(async () => {
        jugadores= await getData();
    });

    async function getData(){
        const url = 'https://tank01-fantasy-stats.p.rapidapi.com/getNBAPlayerList';
       
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '091e0bcec8msh63bb62660ef5b0cp134125jsn9307b8f17903',
                'X-RapidAPI-Host': 'tank01-fantasy-stats.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            return result.body;
        } catch (error) {
            console.error(error);
        }

    }

</script>
<ul>

    {#each jugadores as x}
        <li>{x.longName} - {x.team}</li>
    {/each}
</ul>
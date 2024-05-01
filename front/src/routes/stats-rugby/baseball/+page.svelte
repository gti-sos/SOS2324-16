<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    
    let player = [];

    onMount(async () => {
        player = await getData();
    });

    
    async function getData(){
        const url = 'https://live-golf-data.p.rapidapi.com/leaderboard?orgId=1&tournId=475&year=2023';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '46de8c89d2msh0c5dfe7dff19129p1701a5jsn2e7c3196f15b',
                'X-RapidAPI-Host': 'live-golf-data.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            let result = await response.json();
            console.log(result);
            return result.leaderboardRows;
        } catch (error) {
            console.error(error);
        }
    }
   
</script>

<ul>

    {#each player as x}
        <li>{x.firstName} {x.lastName}</li>
    {/each}
</ul>
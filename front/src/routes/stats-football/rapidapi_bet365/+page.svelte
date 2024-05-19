<script>
    import {onMount} from "svelte";

    let partidos=[];

    onMount(() => {
        getMatch();
    });

    async function getMatch(){
        const url = 'https://bet36528.p.rapidapi.com/matches_bet365?sport=soccer&country=england&competition=premier-league&match_urls=false';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '0ce0fceddamsh6c7a31cf44a49a9p10f399jsna366b1dbf9cf',
                'X-RapidAPI-Host': 'bet36528.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
           console.log(result);
            partidos = Object.values(result).map(item => ({
                home_team: item.home_team,
                away_team: item.away_team
            }));
            console.log(partidos);
            return partidos;
        } catch (error) {
            console.error(error);
        }
    }
</script>

<style>
    h1 {
        text-align: center;
        color: #007bff;
        margin-top: 30px;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    li {
        background-color: #fff;
        margin-bottom: 10px;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    li:hover {
        transform: translateY(-2px);
        transition: transform 0.3s ease;
    }

    .container {
        max-width: 600px;
        margin: auto;
        padding: 20px;
    }

    .loading {
        text-align: center;
        font-style: italic;
        margin-top: 20px;
    }
</style>

<div class="container">
    <h1>Partidos ofrecidos por Bet365</h1>

    {#if partidos.length > 0} 
      <ul>
        {#each partidos as p}
          <li>{p["home_team"]} vs {p["away_team"]} </li>
        {/each}
      </ul>

    {:else}
      <p class="loading">Cargando partidos...</p> 
    {/if}
</div>
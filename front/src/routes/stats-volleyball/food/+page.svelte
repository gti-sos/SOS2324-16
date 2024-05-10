
<script>

    //   https://rapidapi.com/rapihub-rapihub-default/api/the-vegan-recipes-db


    import { onMount } from 'svelte';

    import {dev} from "$app/environment";

    let DATAAPI = "/stats-volleyball/nba_player";
    if(dev){
        DATAAPI = "http://localhost:10000/stats-volleyball/nba_player";
        
    }

    let comidas=[];


    onMount(async () => {
        //jugadores= await getDataAPIExternaJugadores();
        comidas=await getVariosPlatos();
    });

    async function getDataAPIExterna(num){

        const url = `https://the-vegan-recipes-db.p.rapidapi.com/${num}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'ae855ceae1msh2840b2c00787f80p198e0bjsnbf6b6ed1fe06',
                'X-RapidAPI-Host': 'the-vegan-recipes-db.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log([result.title,result.image]);
            return [result.title,result.image];
        } catch (error) {
            console.error(error);
        }

    }


    async function getVariosPlatos(){
        let res=[];
        for(let i=1;i<11;i++){

            let e=await getDataAPIExterna(i);
            res.push(e);
        }

        
        return res;

    }

</script>

<h1>Algunos platos que contiene la API son: </h1>
<ul>
    {#each comidas as c}
        <li class="comida-item"> 
            <h2 class="comida-nombre"> {c[0]} </h2> 
            <img class="comida-imagen" src="{c[1]}" alt="">
        </li>

    {/each}

</ul>
<br>

<style>
    .comida-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
    }
  
    .comida-nombre {
      font-size: 18px; /* Tamaño de fuente para el nombre de la comida */
      margin-bottom: 10px;
    }
  
    .comida-imagen {
      width: 200px; /* Ancho de la imagen */
      height: auto; /* Altura automática para mantener la proporción */
    }
  </style>


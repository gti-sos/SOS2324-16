
<script>

    //   https://rapidapi.com/rapihub-rapihub-default/api/the-vegan-recipes-db


    import { onMount } from 'svelte';

    import {dev} from "$app/environment";

    let DATAAPI = "/DMC/proxy";
    if(dev){
        DATAAPI = "http://localhost:10000/DMC/proxy";
        
    }

    let comidas=[];


    onMount(async () => {
        comidas=await getData();
    });

    async function getData(){
        try{
            const res = await fetch(DATAAPI);
            const data = await res.json();
            console.log(`Data received: ${data}`);
            return data; 
        } catch (error){
            console.log( `Error fetching data: ${error}`);
        } 
    }

</script>

<h1>Algunos platos que contiene la API son: </h1>
<ul>
    {#each comidas as c}
        <li class="comida-item"> 
            <h2 class="comida-nombre"> {c["title"]} </h2> 
            <img class="comida-imagen" src="{c["image"]}" alt="">
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


<script>
  import { onMount } from 'svelte';

  import {dev} from "$app/environment";

  let DATAAPI = "/PSS/proxy";
  if(dev){
      DATAAPI = "http://localhost:10000/PSS/proxy";
  }

  let fotos = [];

  onMount(async () => {
      fotos = await getData();
  });
  
  async function getData(){
      try{
        const res = await fetch(DATAAPI);
        const data = await res.json();
        const nombre = data.name;
        const fotos = data.photos;
        return {nombre, fotos};
      } catch (error){
        console.error(error);
      } 
  }
</script>

{#if fotos && fotos.fotos && fotos.fotos.length > 0}
  <div class="lugar-container">
    <h2 class="lugar-nombre">{fotos.nombre}</h2>
    <div class="lugar-fotos">
      {#each fotos.fotos as foto, index}
        <div class="lugar-foto">
          <img src="{foto}" alt="{fotos.nombre}">
        </div>
        {#if (index + 1) % 2 === 0 && index !== fotos.fotos.length - 1}
          <div class="lugar-foto-separator"></div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <p>Cargando fotos...</p>
{/if}

<style>
  .lugar-container {
    margin-top: 20px;
  }

  .lugar-nombre {
    text-align: center;
    margin-bottom: 20px;
  }

  .lugar-fotos {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .lugar-foto {
    width: calc(50% - 20px); 
    margin: 10px;
  }

  .lugar-foto img {
    width: 100%;
    border-radius: 8px;
  }

  .lugar-foto-separator {
    width: 100%;
    height: 10px;
  }
</style>
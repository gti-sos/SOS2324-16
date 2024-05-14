
<script>

  //https://rapidapi.com/cricketapilive/api/cricbuzz-cricket

  import { onMount } from 'svelte';

  import {dev} from "$app/environment";

  let DATAAPI = "/PSS/proxy";
  if(dev){
      DATAAPI = "http://localhost:10000/PSS/proxy";
      
  }

  let lugares=[];


  onMount(async () => {
      lugares=await getData();
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

<h1>Lugares que aparecen en la API: </h1>

<ul>
  {#each lugares as l}
      <li class="lugar-item"> 
          <h2 class="lugar-nombre"> {l["name"]} </h2> 
          <img class="lugar-imagenes" src="{l["photos"]}" alt="">
      </li>

  {/each}

</ul>
<br>

<style>
  .lugar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }

  .lugar-nombre {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .lugar-imagenes {
    width: 200px;
    height: auto;
  }
</style>


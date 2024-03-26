<script>

    import { onMount } from "svelte";
    import {dev} from "$app/environment";

    let API="/api/v2/stats-volleyball";
    if(dev){
        API="http://localhost:10000/api/v2/stats-volleyball";
    }
    import {page} from '$app/stores';
    let pais=$page.params.nationality;
    let peso=$page.params.weight;
    let jElegida=[];

    onMount(()=>{
        getJugadoraElegida();
    })

    async function getJugadoraElegida(){
        let response=await fetch(API,{
                            method:"GET"
                        })

        let data=await response.json();
        data.forEach((j) => {
            console.log(j.nationality);
            console.log(pais);
            if(j.nationality==pais ){
                jElegida.push(j);
            }
            
        });
        
    }


</script>
Es {jElegida[0]}
<!-- <ul>
    {#each jElegida as volleyball_jj}
        <li><p>Nombre: {volleyball_jj.name}</p> </li>
        
    {/each}
</ul> -->
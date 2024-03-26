<script>

    import { onMount } from "svelte";
    import {dev} from "$app/environment";

    let API="/api/v1/stats-rugby";
    if(dev){
        API="http://localhost:10000/api/v1/stats-rugby";
    }
    import {page} from '$app/stores';
    let pais=$page.params.bplace;
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
            console.log(j.bplace);
            console.log(pais);
            if(j.bplace==pais ){
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
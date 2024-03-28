<script>

    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from "../../../Mensaje.svelte";

    let API="/api/v2/stats-volleyball";
    if(dev){
        API="http://localhost:10000/api/v2/stats-volleyball";
    }
    import {page} from '$app/stores';
    let pais=$page.params.nationality;
    let peso=$page.params.weight;
    let jElegida={};
    let misDatos=[];
    let errorMsg="";
    let msg="";
    let paisAnt=pais;
    let pesoAnt=peso;

    onMount(()=>{
        getVolleyball();
        getJugadoraElegida();
    })

    async function getVolleyball(){
        let response=await fetch(API,{
                            method:"GET"
                        })

        let data=await response.json();
        misDatos=data;
    }

    async function actualizaDatos(){
        paisAnt=jElegida.nationality;
        pesoAnt=jElegida.weight;
    }


    async function getJugadoraElegida(){
        let response=await fetch(API,{
                            method:"GET"
                        })

        let data=await response.json();
        misDatos=data
        misDatos.forEach((j) => {
            if(j.nationality===pais && j.weight===Number(peso)){
                jElegida=j;
            }
        });
        if(jElegida.name===undefined || jElegida===null ){
            errorMsg="code: "+404;
        }

        
    }


    async function updateVolleyball(n){

        try{
            let response=await fetch(API+"/"+n,{
                                method:"PUT",
                                headers:{
                                    "Content-Type":"application/json"
                                },
                                body:JSON.stringify(jElegida,null,2)
                            })

            let status=await response.status;
            console.log(`Creation response status ${status}`);
            if(status===200){
                getVolleyball();
                msg="Cambios actualizados correctamente";
            }else{
                errorMsg="code: "+status;
            }
        }catch(e){
            errorMsg=e;
        }

    }



</script>

{#if msg!=""}
<div>
    <Mensaje tipo="exito" mensaje={msg} />
</div>
{/if}
{#if errorMsg!=""}
<div>
    {#if errorMsg=="code: 400"}
        <Mensaje tipo="error" mensaje="La petición realizada es incorrecta" />
    {/if}
    {#if errorMsg=="code: 404"}
        <Mensaje tipo="error" mensaje={`No existe un contacto con nacionalidad ${pais} y peso ${peso}`}/>
    {/if}
</div>   
{/if}

<table>
    <thead>
        <tr>
            <th>
                Name
            </th>
            <th>
                Ranking
            </th>
            <th>
                Nationality
            </th>
            <th>
                Position
            </th>
            <th>
                Birthdate
            </th>
        </tr>

    </thead>
    <tbody>
        <tr>
            <td>
                <input bind:value={jElegida.name}>
            </td>
            <td>
                <input type="number" bind:value={jElegida.ranking}>
            </td>
            <td>
                <input bind:value={jElegida.nationality}>
            </td>
            <td>
                <input bind:value={jElegida.position}>
            </td>
            <td>
                <input bind:value={jElegida.birthdate}>
            </td>
        </tr>

    </tbody>
    <thead>
        <tr>
            <th>
                Height
            </th>
            <th>
                Weight
            </th>
            <th>
                Dominant Hand
            </th>
            <th>
                Promedio de puntos con su selección
            </th>
            <th>
                Promedio de puntos
            </th>

        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <input type="number" bind:value={jElegida.height}>
            </td>
            <td>
                <input type="number" bind:value={jElegida.weight}>
            </td>
            <td>
                <input bind:value={jElegida.dominant_hand}>
            </td>
            <td>
                <input type="number" bind:value={jElegida.country_point}>
            </td>
            <td>
                <input type="number" bind:value={jElegida.point}>
            </td>

        </tr>
    </tbody>

</table>
<br>
<form action="/stats-volleyball/{jElegida.nationality}/{jElegida.weight}">
    <button type="submit"  on:click="{updateVolleyball(`${paisAnt}/${pesoAnt}`)}" on:click="{actualizaDatos}"  >Actualiza los datos</button> 
</form>

<br>
{#if errorMsg!=""}
<hr>
ERROR: {errorMsg}    
{/if} 
<!-- <ul>
    {#each jElegida as volleyball_jj}
        <li><p>Nombre: {volleyball_jj.name}</p> </li>
        
    {/each}
</ul> -->
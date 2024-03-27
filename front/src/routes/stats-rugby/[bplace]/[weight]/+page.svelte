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
    let jElegido={};
    let errorMsg="";

    onMount(()=>{
        getJugadorElegido(pais,peso);
    })

    async function getJugadorElegido(pais,peso){
        let response=await fetch(API+"/"+pais+"/"+peso,{
                            method:"GET"
                        });

        let data=await response.json();
        jElegido=data;
        console.log(jElegido);
    }

    async function putRugby(){
        try{
            let response=await fetch(API+"/"+pais+"/"+peso,{
                                method:"PUT",
                                headers:{
                                    "Content-Type":"application/json"
                                },
                                body:JSON.stringify(jElegido,null,2)
                            });
            let status=await response.status;
            console.log(`Creation response status ${status}`);
            if(status===200){
                getJugadorElegido(jElegido.bplace,jElegido.weight);
            }else{
                errorMsg="code: "+status;
            }
        }catch(e){
            errorMsg=e;
        }
    }




</script>
Es {jElegido}

<table>
    <thead>
        <tr>
            <th>
                Equipo
            </th>
            <th>
                Posición
            </th>
            <th>
                Edad
            </th>
            <th>
                Altura (en cm)
            </th>
            <th>
                Peso (en kg)
            </th>
        </tr>

    </thead>
    <tbody>
        <tr>
            <td>
                <input bind:value={jElegido.team}>
            </td>
            <td>
                <input bind:value={jElegido.plabel}>
            </td>
            <td>
                <input bind:value={jElegido.age}>
            </td>
            <td>
                <input bind:value={jElegido.height}>
            </td>
            <td>
                <input bind:value={jElegido.weight}>
            </td>
        </tr>

    </tbody>
    <thead>
        <tr>
            <th>
                Nacionalidad
            </th>
            <th>
                Fecha de nacimiento
            </th>
            <th>
                Apellido
            </th>
            <th>
                Nombre
            </th>
            <th>
                Premios
            </th>

        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <input bind:value={jElegido.bplace}>
            </td>
            <td>
                <input bind:value={jElegido.bdate}>
            </td>
            <td>
                <input bind:value={jElegido.last}>
            </td>
            <td>
                <input bind:value={jElegido.first}>
            </td>
            <td>
                <input bind:value={jElegido.caps}>
            </td>

        </tr>
    </tbody>

</table>

<button on:click="{putRugby}">Guardar cambios</button>

{#if errorMsg!=""}
<hr>
ERROR: {errorMsg}    
{/if}
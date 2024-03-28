<script>

    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from "../../../Mensaje.svelte";

    let API="/api/v2/stats-rugby";
    if(dev){
        API="http://localhost:10000/api/v2/stats-rugby";
    }
    import {page} from '$app/stores';
    let pais=$page.params.bplace;
    let peso=$page.params.weight;
    let jElegido={};
    let misDatos=[];
    let errorMsg="";
    let paisAnt=pais;
    let pesoAnt=peso;
    let msg="";

    onMount(()=>{
        getRugby();
        getJugadorElegido();
    })

    async function getRugby(){
        let response=await fetch(API,{
                            method:"GET"
                        })

        let data=await response.json();
        misDatos=data;
    }

    async function getJugadorElegido(){
        let response=await fetch(API,{
                            method:"GET"
                        });
        let data=await response.json();
        misDatos=data
        misDatos.forEach((j) => {
            if(j.bplace===pais && j.weight===Number(peso)){
                jElegido=j;
            }
        });
        if(jElegido.first===undefined || jElegido===null ){
            errorMsg="code: "+404;
        }
    }

    
    async function putRugby(pais,peso){
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
                getRugby();
                msg="Cambios actualizados correctamente";
            }else{
                errorMsg="code: "+status;
            }
        }catch(e){
            errorMsg=e;
        }
    }
    
    async function actualizaDatos(){
        paisAnt=jElegido.bplace;
        pesoAnt=jElegido.weight;
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
                <input type="number" bind:value={jElegido.age}>
            </td>
            <td>
                <input type="number" bind:value={jElegido.height}>
            </td>
            <td>
                <input type="number" bind:value={jElegido.weight}>
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
                <input type="number" bind:value={jElegido.caps}>
            </td>

        </tr>
    </tbody>

</table>

<form action="/stats-rugby/{jElegido.bplace}/{jElegido.weight}">
    <button type="submit"  on:click="{putRugby(paisAnt,pesoAnt)}" on:click="{actualizaDatos}">Guardar cambios</button> 
</form>


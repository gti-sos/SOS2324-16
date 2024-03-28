<script>
    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from "../../../Mensaje.svelte";

    let API="/api/v2/stats-football";
    if(dev){
        API="http://localhost:10000/api/v2/stats-football";
    }
    import {page} from '$app/stores';
    let pais=$page.params.nationality;
    let altura=$page.params.height_cm;
    let jElegido={};
    let misDatos=[];
    let paisAnt=pais;
    let alturaAnt=altura;
    let msg="";
    let errorMsg="";

    onMount(()=>{
        getFootball();
        getJugadorElegido();
    })

    async function getFootball(){
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
            if(j.nationality===pais && j.height_cm===Number(altura)){
                jElegido=j;
            }
        });
        if(jElegido.short_name===undefined || jElegido===null ){
            errorMsg="code: "+404;
        }
    }

    
    async function putFootball(pais,altura){
        try{
            let response=await fetch(API+"/"+pais+"/"+altura,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(jElegido,null,2)
            });
            let status=await response.status;
            console.log(`Creation response status ${status}`);
            if(status===200){
                getFootball();
                msg="Cambios actualizados correctamente";
            }else{
                errorMsg="code: "+status;
            }
        }catch(e){
            errorMsg=e;
        }
    }
    
    async function actualizaDatos(){
        paisAnt=jElegido.nationality;
        pesoAnt=jElegido.height_cm;
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
        <Mensaje tipo="error" mensaje={`No existe un contacto con nacionalidad ${pais} y altura ${altura}`}/>
    {/if}
</div>
{/if}

<table>
    <thead>
        <tr>
            <th>
                Nombre
            </th>
            <th>
                Nombre completo
            </th>
            <th>
                Edad
            </th>
            <th>
                Fecha de nacimiento
            </th>
            <th>
                Altura (en cm)
            </th>
        </tr>

    </thead>
    <tbody>
        <tr>
            <td>
                <input bind:value={jElegido.short_name}>
            </td>
            <td>
                <input bind:value={jElegido.long_name}>
            </td>
            <td>
                <input type="number" bind:value={jElegido.age}>
            </td>
            <td>
                <input bind:value={jElegido.dob}>
            </td>
            <td>
                <input type="number" bind:value={jElegido.height_cm}>
            </td>
        </tr>

    </tbody>
    <thead>
        <tr>
            <th>
                Peso (en kg)
            </th>
            <th>
                Nacionalidad
            </th>
            <th>
                Club
            </th>
            <th>
                Pie dominante
            </th>
            <th>
                Posición 
            </th>

        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <input type="number" bind:value={jElegido.weight_kg}>
            </td>
            <td>
                <input bind:value={jElegido.nationality}>
            </td>
            <td>
                <input bind:value={jElegido.club}>
            </td>
            <td>
                <input bind:value={jElegido.preferred_foot}>
            </td>
            <td>
                <input bind:value={jElegido.team_position}>
            </td>

        </tr>
    </tbody>

</table>

<form action="/stats-football/{jElegido.nationality}/{jElegido.height_cm}">
    <button type="submit"  on:click="{putFootball(paisAnt,alturaAnt)}" on:click="{actualizaDatos}">Guardar cambios</button> 
</form>


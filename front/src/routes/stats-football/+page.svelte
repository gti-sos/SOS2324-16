<script>
    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from "../Mensaje.svelte";

     
    let API="/api/v2/stats-football";
    if(dev){
        API="http://localhost:10000/api/v2/stats-football";
    }

    let Football=[];
    let errorMsg="";
    let msg="";
    let newFootball={
                    "short_name": "I. Casillas", 
                    "long_name": "Iker Casillas", 
                    "age": 27, 
                    "dob": "24/06/1987", 
                    "height_cm": 169, 
                    "weight_kg": 67, 
                    "nationality": "España", 
                    "club": "Real Madrid", 
                    "preferred_foot": "Left", 
                    "team_position": "CF"
                };

    onMount(()=>{
        getFootball();
    })

    async function getFootball(){
        let response=await fetch(API,{
                            method:"GET"
                        })

        let data=await response.json();
        Football=data;
        console.log(data);
    }

    async function deleteFootball(nom,n){
        console.log(`Deleting ${nom}`);

        try{
            let response=await fetch(API+"/"+n,{
                                method:"DELETE"
                            })

            if(response.status===200){
                getFootball();
                msg="Jugador borrado correctamente";
            }else{
                errorMsg="code: "+response.status;
            }
        }catch(e){
            errorMsg=e;
        }
    }

    async function deleteAllFootball(){
        console.log(`Deleting all`);

        try{
            let response=await fetch(API+"/",{
                                method:"DELETE"
                            })

            if(response.status===200){
                getFootball();
                msg="Todos los jugadores borrados correctamente";
            }else{
                errorMsg="code: "+response.status;
            }
        }catch(e){
            errorMsg=e;
        }
    }

    async function createFootball(){

        try{
            let response=await fetch(API,{
                                method:"POST",
                                headers:{
                                    "Content-Type":"application/json"
                                },
                                body:JSON.stringify(newFootball,null,2)
                            })

            let status=await response.status;
            console.log(`Creation response status ${status}`);
            if(status===201){
                getFootball();
                msg="Jugador creado correctamente";
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
    {#if errorMsg=="code: 409"}
        <Mensaje tipo="error" mensaje={`Existe un contacto con nombre ${newFootball.short_name}`}/>
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
                <input bind:value={newFootball.short_name}>
            </td>
            <td>
                <input bind:value={newFootball.long_name}>
            </td>
            <td>
                <input type="number" bind:value={newFootball.age}>
            </td>
            <td>
                <input bind:value={newFootball.dob}>
            </td>
            <td>
                <input type="number" bind:value={newFootball.height_cm}>
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
                <input type="number" bind:value={newFootball.weight_kg}>
            </td>
            <td>
                <input bind:value={newFootball.nationality}>
            </td>
            <td>
                <input bind:value={newFootball.club}>
            </td>
            <td>
                <input bind:value={newFootball.preferred_foot}>
            </td>
            <td>
                <input bind:value={newFootball.team_position}>
            </td>

        </tr>
    </tbody>

</table>

<ul>
    {#each Football as football_j}
        <li> <a href="/stats-football/{football_j.nationality}/{football_j.height_cm}">{football_j.short_name} - {football_j.nationality}</a>  <button on:click="{deleteFootball(football_j.short_name,football_j.nationality+"/"+football_j.height_cm)}">Delete</button> </li>
        
    {/each}
    <br>
    <br>
    <button on:click="{createFootball}">Crear jugador de fútbol</button> <button on:click="{deleteAllFootball}">Limpiar lista</button>
</ul>
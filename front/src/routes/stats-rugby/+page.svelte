<script>
    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    //Muestra si está en desarrollo  
    let API="/api/v1/stats-rugby";
    if(dev){
        API="http://localhost:10000/api/v1/stats-rugby";
    }

    let Rugby=[];
    let errorMsg="";
    let newRugby={
                    "team": "ARG",
                    "plabel": "Scrum Half",
                    "age": 26,
                    "height": 179,
                    "weight": 85,
                    "bplace": "Argentina",
                    "bdate": "15/04/1993",
                    "last": "Ezcurra",
                    "first": "Felipe",
                    "caps": 5
                };

    onMount(()=>{
        getRugby();
    })

    async function getRugby(){
        let response=await fetch(API,{
                            method:"GET"
                        })

        let data=await response.json();
        Rugby=data;
        console.log(data);
    }

    async function deleteRugby(nom,n){
        console.log(`Deleting ${nom}`);

        try{
            let response=await fetch(API+"/"+n,{
                                method:"DELETE"
                            })

            if(response.status===200){
                getRugby();
            }else{
                errorMsg="code: "+response.status;
            }
        }catch(e){
            errorMsg=e;
        }
    }

    async function deleteAllRugby(){
        console.log(`Deleting all`);

        try{
            let response=await fetch(API+"/",{
                                method:"DELETE"
                            })

            if(response.status===200){
                getRugby();
            }else{
                errorMsg="code: "+response.status;
            }
        }catch(e){
            errorMsg=e;
        }
    }

    async function createRugby(){

        try{
            let response=await fetch(API,{
                                method:"POST",
                                headers:{
                                    "Content-Type":"application/json"
                                },
                                body:JSON.stringify(newRugby,null,2)
                            })

            let status=await response.status;
            console.log(`Creation response status ${status}`);
            if(status===201){
                getRugby();
            }else{
                errorMsg="code: "+status;
            }
        }catch(e){
            errorMsg=e;
        }

    }
//export default Rugby;
</script>

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
                <input bind:value={newRugby.team}>
            </td>
            <td>
                <input bind:value={newRugby.plabel}>
            </td>
            <td>
                <input bind:value={newRugby.age}>
            </td>
            <td>
                <input bind:value={newRugby.height}>
            </td>
            <td>
                <input bind:value={newRugby.weight}>
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
                <input bind:value={newRugby.bplace}>
            </td>
            <td>
                <input bind:value={newRugby.bdate}>
            </td>
            <td>
                <input bind:value={newRugby.last}>
            </td>
            <td>
                <input bind:value={newRugby.first}>
            </td>
            <td>
                <input bind:value={newRugby.caps}>
            </td>

        </tr>
    </tbody>

</table>

<ul>
    {#each Rugby as rugby_j}
        <li> <a href="/stats-rugby/{rugby_j.bplace}/{rugby_j.weight}">{rugby_j.first} - {rugby_j.bplace}</a>  <button on:click="{deleteRugby(rugby_j.first,rugby_j.bplace+"/"+rugby_j.weight)}">Delete</button> </li>
        
    {/each}
    <br>
    <br>
    <button on:click="{createRugby}">Crear jugador Rugby</button> <button on:click="{deleteAllRugby}">Limpiar lista</button>
</ul>
{#if errorMsg!=""}
<hr>
ERROR: {errorMsg}    
{/if}
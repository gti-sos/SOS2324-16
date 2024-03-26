<script>
    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    //Muestra si está en desarrollo  
    let API="/api/v2/stats-volleyball";
    if(dev){
        API="http://localhost:10000/api/v2/stats-volleyball";
    }

    let volleyball=[];
    let errorMsg="";
    let newVolleyball={name:"nombreJugadora",ranking:11,nationality:"Spain",position:"Outside Hitter",birthdate:"19/06/2006",height:188,weight:89,dominant_hand:"Right",country_point:221.0,point:666.0};

    onMount(()=>{
        getVolleyball();
    })

    async function getVolleyball(){
        let response=await fetch(API,{
                            method:"GET"
                        })

        let data=await response.json();
        volleyball=data;
        console.log(data);
    }

    async function deleteVolleyball(nom,n){
        console.log(`Deleting ${nom}`);

        try{
            let response=await fetch(API+"/"+n,{
                                method:"DELETE"
                            })

            if(response.status===200){
                getVolleyball();
            }else{
                errorMsg="code: "+response.status;
            }
        }catch(e){
            errorMsg=e;
        }
    }

    async function deleteTodasVolleyball(){
        console.log(`Deleting all`);

        try{
            let response=await fetch(API+"/",{
                                method:"DELETE"
                            })

            if(response.status===200){
                getVolleyball();
            }else{
                errorMsg="code: "+response.status;
            }
        }catch(e){
            errorMsg=e;
        }
    }

    async function createVolleyball(){

        try{
            let response=await fetch(API,{
                                method:"POST",
                                headers:{
                                    "Content-Type":"application/json"
                                },
                                body:JSON.stringify(newVolleyball,null,2)
                            })

            let status=await response.status;
            console.log(`Creation response status ${status}`);
            if(status===201){
                getVolleyball();
            }else{
                errorMsg="code: "+status;
            }
        }catch(e){
            errorMsg=e;
        }

    }
//export default volleyball;
</script>

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
                <input bind:value={newVolleyball.name}>
            </td>
            <td>
                <input bind:value={newVolleyball.ranking}>
            </td>
            <td>
                <input bind:value={newVolleyball.nationality}>
            </td>
            <td>
                <input bind:value={newVolleyball.position}>
            </td>
            <td>
                <input bind:value={newVolleyball.birthdate}>
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
                <input bind:value={newVolleyball.height}>
            </td>
            <td>
                <input bind:value={newVolleyball.weight}>
            </td>
            <td>
                <input bind:value={newVolleyball.dominant_hand}>
            </td>
            <td>
                <input bind:value={newVolleyball.country_point}>
            </td>
            <td>
                <input bind:value={newVolleyball.point}>
            </td>

        </tr>
    </tbody>

</table>

<ul>
    {#each volleyball as volleyball_j}
        <li> <a href="/stats-volleyball/{volleyball_j.nationality}/{volleyball_j.weight}">{volleyball_j.name} - {volleyball_j.nationality}</a>  <button on:click="{deleteVolleyball(volleyball_j.name,volleyball_j.nationality+"/"+volleyball_j.weight)}">Delete</button> </li>
        
    {/each}
    <br>
    <br>
    <button on:click="{createVolleyball}">Crear jugadora volleyball</button> <button on:click="{deleteTodasVolleyball}">Limpiar lista</button>
</ul>
{#if errorMsg!=""}
<hr>
ERROR: {errorMsg}    
{/if}
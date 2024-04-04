<script>
    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from "../Mensaje.svelte";
	import { slide } from "svelte/transition";
     
    let API="/api/v2/stats-volleyball";
    if(dev){
        API="http://localhost:10000/api/v2/stats-volleyball";
    }

    let volleyball=[];
    let errorMsg="";
    let msg="";
    let newVolleyball={name:"nombreJugadora",ranking:11,nationality:"Spain",position:"Outside Hitter",birthdate:"19/06/2006",height:188,weight:89,dominant_hand:"Right",country_point:221.0,point:666.0};
    let param="";
    let busqueda="";
    let from="";
    let to="";
    let offset=0;
    let limit=4;
    //pa no liarme yo
    let opcionSeleccionada="name";

    function handleSeleccion(event) {
        opcionSeleccionada = event.target.value;
    }

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

    async function actualizaP(){
            // Obtenemos el elemento select
            var selectElement = document.getElementById('opciones');
            
            // Obtenemos el valor seleccionado
            var valorSeleccionado = selectElement.value;
            param=valorSeleccionado;
            
            // Hacer lo que necesites con el valor seleccionado, por ejemplo, imprimirlo en la consola
            console.log("El usuario seleccionó: " + param);

            if(param==="from-to"){
                var selectElementFrom = document.getElementById('from');
                
                // Obtenemos el valor seleccionado
                var valorSeleccionadoFrom = selectElementFrom.value;
                from=valorSeleccionadoFrom;

                var selectElementTo = document.getElementById('to');
                
                // Obtenemos el valor seleccionado
                var valorSeleccionadoTo = selectElementTo.value;
                to=valorSeleccionadoTo;

            }else{
                var selectElement2 = document.getElementById('entrada');
            
                // Obtenemos el valor seleccionado
                
                var valorSeleccionado2 = selectElement2.value;
                busqueda=valorSeleccionado2;
                
                // Hacer lo que necesites con el valor seleccionado, por ejemplo, imprimirlo en la consola
                console.log("El usuario seleccionó: " + busqueda);

            }

    }

  

    async function getVolleyballBusquedas(){

        try{

            let API2=API+"?"+param+"="+busqueda;
            if(param==="from-to"){
                API2=API+"?from="+from+"&to="+to;
            }
        
            console.log(API2);
            let response=await fetch(API2,{
                            method:"GET"
                        });

            
            let status = await response.status;
            
            if(status===200){
                msg="Filtrado realizado correctamente";
                let data= await response.json();
                volleyball=data;
            }else{
                errorMsg="code: "+status;
            }
      
        }catch(e){
            errorMsg=e;
        }
        
        console.log(volleyball);

    
    }

    async function ejecutaOrden(){
        console.log(param);
        await actualizaP();
        console.log(param);
        await getVolleyballBusquedas();
    }



    async function getVolleyballPaginacion(){

        try{

            API2=API+"?limit="+limit+"&offset="+offset;
            let response=await fetch(API2,{
                            method:"GET"
                        });

            
            let status = await response.status;
            
            if(status===200){
                msg="Filtrado realizado correctamente";
                let data= await response.json();
                volleyball=data;
            }else{
                errorMsg="code: "+status;
            }

        }catch(e){
            errorMsg=e;
        }

        console.log(volleyball);


    }


    async function deleteVolleyball(nom,n){
        console.log(`Deleting ${nom}`);

        try{
            let response=await fetch(API+"/"+n,{
                                method:"DELETE"
                            })

            if(response.status===200){
                getVolleyball();
                msg="Jugadora borrada correctamente";
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
                msg="Todas las jugadoras borradas correctamente";
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
                msg="Jugadora creada correctamente";
            }else{
                errorMsg="code: "+status;
            }
        }catch(e){
            errorMsg=e;
        }

    }
//export default volleyball;
</script>

{#if msg!=""}
<div>
    <Mensaje tipo="exito" mensaje={msg} />
</div>
{/if}
{#if errorMsg!=""}
    <div>
    {#if errorMsg=="code: 409"}
        <Mensaje tipo="error" mensaje={`Existe un contacto con nombre ${newVolleyball.name}`}/>
    {/if}
    {#if errorMsg=="code: 404"}
        <Mensaje tipo="error" mensaje={`No existen jugadores con estos filtros`}/>
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
                Clasificación
            </th>
            <th>
                Nacionalidad
            </th>
            <th>
                Posición
            </th>
            <th>
                Fecha de nacimiento
            </th>
        </tr>

    </thead>
    <tbody>
        <tr>
            <td>
                <input bind:value={newVolleyball.name}>
            </td>
            <td>
                <input type="number" bind:value={newVolleyball.ranking}>
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
                Altura
            </th>
            <th>
                Peso
            </th>
            <th>
                Mano dominante
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
                <input type="number" bind:value={newVolleyball.height}>
            </td>
            <td>
                <input type="number" bind:value={newVolleyball.weight}>
            </td>
            <td>
                <input bind:value={newVolleyball.dominant_hand}>
            </td>
            <td>
                <input type="number" bind:value={newVolleyball.country_point}>
            </td>
            <td>
                <input type="number" bind:value={newVolleyball.point}>
            </td>

        </tr>
    </tbody>

</table>

<br>
<br>
<form id="FormularioBusqueda" style="display: block;">
    <label for="opciones">Búsqueda por:</label>
    <select id="opciones" name="opciones" on:change={handleSeleccion}>
        <option value="name">Nombre</option>
        <option value="ranking">Ranking</option>
        <option value="nationality">Nacionalidad</option>
        <option value="position">Posición</option>
        <option value="birthdate">Fecha de nacimiento</option>
        <option value="height">Altura</option>
        <option value="weight">Peso</option>
        <option value="dominant_hand">Mano dominante</option>
        <option value="country_point">Puntos realizados con su país</option>
        <option value="point">Puntos conseguidos</option>
        <option value="from-to">Rango de años</option>
    </select>
    <br>
    <br>
    
    {#if opcionSeleccionada === 'from-to'}
        <!-- Campos del formulario 2 -->
        <label for="from">Desde:</label>
        <input type="text" id="from" name="from">
        <label for="to">Hasta:</label>
        <input type="text" id="to" name="to">
    {:else}
        <label for="entrada">Introduzca el valor de la búsqueda</label>
        <input type="text" id="entrada" name="texto">    
    {/if}
    <br>
    <br>
    <button type="button" id="Filtrar"  on:click={ejecutaOrden}> Filtrar </button>
</form>

<ul>
    {#each volleyball.slice(offset,limit) as volleyball_j}
        <li> <a href="/stats-volleyball/{volleyball_j.nationality}/{volleyball_j.weight}">{volleyball_j.name} - {volleyball_j.nationality}</a>  <button on:click="{deleteVolleyball(volleyball_j.name,volleyball_j.nationality+"/"+volleyball_j.weight)}">Borrar</button> </li>
        
    {/each}
    <br>
    <br>
    <button on:click="{createVolleyball}">Crear jugadora volleyball</button> <button on:click="{deleteTodasVolleyball}">Limpiar lista</button>
</ul>
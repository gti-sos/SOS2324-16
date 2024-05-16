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
                let param=[];
    let busqueda=[];
    let from="";
    let to="";
    let numFormularios=1;
    let API22="";
    let numero=10;
    let n2=0;
    let limit=false;
    let rest = false;
    let opcionSeleccionada=Array.from({ length: numFormularios }, () => 'short_name');

    function handleSeleccion(event, nn) {
        opcionSeleccionada[nn] = event.target.value;
    }

    onMount(async()=>{
        await getFootball();
    })

    async function getFootball(numPag=1){
        try{
            let offset=numero*(numPag-1);
            API22=API;
            let response="";

            console.log(param.length);
            if(limit===true){
                console.log("API22 es "+API22);
                API22=API+"?limit="+numero+"&offset="+offset;
                // if(API22===API){
                //     API22=API+"?limit="+numero+"&offset="+offset;
                // }else{
                //     API22=API22+"&limit="+numero+"&offset="+offset;
                // }

            }
            if(param.length===0){
                response=await fetch(API22,{
                                method:"GET"
                            });
            }
            else{

                let i=0;
                while(i<param.length){
                    if(API22===API){
                        if(param[i]==="from-to"){
                            API22=API+"?from="+from+"&to="+to;
                        }else{
                            API22=API+"?"+param[i]+"="+busqueda[i];
                        }

                    }else{
                        if(param[i]==="from-to"){
                            API22=API22+"&from="+from+"&to="+to;
                        }else{
                            API22=API22+"&"+param[i]+"="+busqueda[i];
                        }
                        

                    }
                    i=i+1;
                }
                response=await fetch(API22,{
                                method:"GET"
                            });
                
            }

            console.log(API22);
            let status = await response.status;
            
            if(status===200 ){
                if(API22!==API){
                    console.log("entra en lo del filtrado realizado correctamente");
                    msg="Filtrado realizado correctamente";
                }
                
                let data= await response.json();
                Football=data;
            }else{
                errorMsg="code: "+status;
            }
                
        }catch(e){
            errorMsg=e;
        }
    }

    async function actualizaP(){

        param=[];
        busqueda=[];
        for(let i=0;i<numFormularios;i++){
            var selectElement = document.getElementById('opciones '+i);

            var valorSeleccionado = selectElement.value;
            
            param.push(valorSeleccionado);

            if(param[i]==="from-to"){
                var selectElementFrom = document.getElementById('from '+i);
                
                var valorSeleccionadoFrom = selectElementFrom.value;
                from=valorSeleccionadoFrom;

                var selectElementTo = document.getElementById('to '+i);
                
                var valorSeleccionadoTo = selectElementTo.value;
                to=valorSeleccionadoTo;
                busqueda.push("");

            }else{
                var selectElement2 = document.getElementById('entrada '+i);    
                var valorSeleccionado2 = selectElement2.value;
                busqueda.push(valorSeleccionado2) ;

            }
        }
    }


    async function ejecutaOrden(){
        await actualizaP();
        rest=false
        await actualizaLO();
        //await getFootball();
    }


    async function actualizaLO(){
        limit=false;
        rest=false;
        await getFootball(1);
        let numElems=Football.length;
        if(numElems>0){
            n2=Math.ceil(numElems/numero) ;
        }
        limit=true;
        rest=false;
        await getFootball(1);

    }

    async function aumentarf(){
        numFormularios=numFormularios+1;
    }

    async function disminuirF(){
        if (numFormularios > 0) {
            numFormularios -= 1;
        }
    }

    async function restauraValores(){
        console.log(`Restaurando a valores por defecto`);

        try{
            let response=await fetch(API+"-restore",{
                                method:"GET"
                            })

            let status = await response.status;
            
            if(status===200 ){
                if(API22!==API){
                    //
                    //actualizaLO();
                    msg="Se han establecido correctamente los valores por defecto";
                }
                
                let data= await response.json();
                Football=data;
                console.log("llega?");
                actualizaLO();
                param=[];
                busqueda=[];
                rest=true;
            }else{
                errorMsg="code: "+status;
            }

        }catch(e){
            errorMsg=e;
        }
    }

    async function deleteFootball(nom,n){
        console.log(`Deleting ${nom}`);

        try{
            let response=await fetch(API+"/"+n,{
                                method:"DELETE"
                            })

            if(response.status===200){
                rest=false;
                await actualizaLO();
                //getFootball();
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
                rest=false;
                param=[];
                busqueda=[];
                await getFootball();
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
                rest=false;
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

<br>
<br>

<span>
    
    <h5>Filtrar</h5>
    <button on:click={aumentarf}> Añadir filtro </button>
    <button  on:click={disminuirF}> Quitar filtro </button>
   <br>
</span>
<br>

 {#each Array.from({ length: numFormularios }, (_, i) => i) as nn}
    {#if opcionSeleccionada[nn] === 'from-to'}
        <form id='FormularioBusqueda {nn}' style="display: block;">
            <label for="opciones">Búsqueda por:</label>
            <select class="inpututil" id='opciones {nn}' name="opciones" on:change={e => handleSeleccion(e, nn)}>
                <option class="inpututil" value="short_name">Nombre</option>
                <option class="inpututil" value="long_name">Nombre largo</option>
                <option class="inpututil" value="age">Edad</option>
                <option class="inpututil" value="club">Club</option>
                <option class="inpututil" value="dob">Fecha de nacimiento</option>
                <option class="inpututil" value="height_cm">Altura</option>
                <option class="inpututil" value="weight_kg">Peso</option>
                <option class="inpututil" value="preferred_foot">Pie dominante</option>
                <option class="inpututil" value="nationality">Nacionalidad</option>
                <option class="inpututil" value="team_position">Posicion</option>
                <option class="inpututil" value="from-to" selected>Rango de años</option>
            </select>
            <br>
            <br>
            <label for='from'>Desde:</label>
            <input type="text" id='from {nn}' name="from">
            <label for='to'>Hasta:</label>
            <input type="text" id='to {nn}' name="to">
            <br>
            <br>
        </form>
    {:else}
        <form id='FormularioBusqueda {nn}' style="display: block;">
            <label for="opciones">Búsqueda por:</label>
            <select class="inpututil" id='opciones {nn}' name="opciones" on:change={e => handleSeleccion(e, nn)}>
                <option class="inpututil" value="short_name">Nombre</option>
                <option class="inpututil" value="long_name">Nombre largo</option>
                <option class="inpututil" value="age">Edad</option>
                <option class="inpututil" value="club">Club</option>
                <option class="inpututil" value="dob">Fecha de nacimiento</option>
                <option class="inpututil" value="height_cm">Altura</option>
                <option class="inpututil" value="weight_kg">Peso</option>
                <option class="inpututil" value="preferred_foot">Pie dominante</option>
                <option class="inpututil" value="nationality">Nacionalidad</option>
                <option class="inpututil" value="team_position">Posicion</option>
                <option class="inpututil" value="from-to">Rango de años</option>
            </select>
            <br>
            <br>
            <label for='entrada'>Introduzca el valor de la búsqueda</label>
            <input type="text" id='entrada {nn}' name="texto">       
            <br>
            <br>
        </form>
    {/if}
{/each}
<button type="button" id="Filtrar"  on:click={ejecutaOrden}> Filtrar </button>


<br>
<br>
<form>
    <label for="paginar">Introduzca el numero de elementos que deseas </label>
    <input type="number" id="paginar" name="number" bind:value={numero}> 
    <button type="button" id="Paginar" on:click={actualizaLO}> Paginar </button>
</form>

<br>
<br>

<ul>
    {#each Football as football_j}
        <li> <a href="/stats-football/{football_j.nationality}/{football_j.height_cm}">{football_j.short_name} - {football_j.nationality}</a>  <button on:click="{deleteFootball(football_j.short_name,football_j.nationality+"/"+football_j.height_cm)}">Borrar</button> </li>
        
    {/each}
    <br>
    <div id="container" style="display: block;">
        {#each Array.from({ length: n2 }, (_, i) => i) as nn}
            <button on:click={getFootball(nn+1)}> {nn + 1}</button>
        {/each}

    </div>
    <br>
    <button on:click="{createFootball}">Crear jugador de fútbol</button> <button on:click="{deleteAllFootball}">Limpiar lista</button> <button on:click="{restauraValores}">Volver a la lista inicial</button>
    <p><a href="/stats-football/graph" class="nav-link">Ver las gráficas</a></p>
</ul>
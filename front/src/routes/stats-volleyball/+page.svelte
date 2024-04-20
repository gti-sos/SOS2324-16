<script>
    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from "../Mensaje.svelte";
     
    let API="/api/v2/stats-volleyball";
    if(dev){
        API="http://localhost:10000/api/v2/stats-volleyball";
    }

    let volleyball=[];
    let errorMsg="";
    let msg="";
    let newVolleyball={name:"nombreJugadora",ranking:11,nationality:"Spain",position:"Outside Hitter",birthdate:"19/06/2006",height:188,weight:89,dominant_hand:"Right",country_point:221.0,point:666.0};
    let param=[];
    let busqueda=[];
    let from="";
    let to="";
    let numFormularios=1;
    let API22="";
    let numero=10;
    let n2=0;
    let limit=false;
    let opcionSeleccionada=Array.from({ length: numFormularios }, () => 'name');;

    function handleSeleccion(event, nn) {
        opcionSeleccionada[nn] = event.target.value;
    }

    onMount(()=>{
        getVolleyball();
    })

    async function getVolleyball(numPag=1){

        try{
            let offset=numero*(numPag-1);
            API22=API;
            let response="";

            console.log(param.length);
            if(limit===true){
                if(API22===API){
                    console.log("ll");
                    API22=API+"?limit="+numero+"&offset="+offset;
                    
                }else{
                    API22=API22+"&limit="+numero+"&offset="+offset;
                }

            }
            if(param.length===0){
                response=await fetch(API22,{
                                method:"GET"
                            });
            }
            else{

                console.log("entra?"+API22);
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
                    msg="Filtrado realizado correctamente";
                }
                
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
        console.log(param);
        console.log(busqueda);

    }


    async function ejecutaOrden(){
        await actualizaP();
        await getVolleyball();
    }


    async function actualizaLO(){
        limit=false;
        await getVolleyball(1);
        let numElems=volleyball.length;
        if(numElems>0){
            n2=Math.ceil(numElems/numero) ;
        }
        limit=true;
        await getVolleyball(1);
        
    }
    
    async function aumentarf(){
        numFormularios=numFormularios+1;
    }

    async function disminuirF(){
        if (numFormularios > 0) {
            numFormularios -= 1;
        }
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

<span>
    <button on:click={aumentarf}> + </button>
    <h5>Filtrar</h5>
    <button  on:click={disminuirF}> - </button>
</span>

 {#each Array.from({ length: numFormularios }, (_, i) => i) as nn}
    {#if opcionSeleccionada[nn] === 'from-to'}
        <form id='FormularioBusqueda {nn}' style="display: block;">
            <label for="opciones">Búsqueda por:</label>
            <select class="inpututil" id='opciones {nn}' name="opciones" on:change={e => handleSeleccion(e, nn)}>
                <option class="inpututil" value="name">Nombre</option>
                <option class="inpututil" value="ranking">Ranking</option>
                <option class="inpututil" value="nationality">Nacionalidad</option>
                <option class="inpututil" value="position">Posición</option>
                <option class="inpututil" value="birthdate">Fecha de nacimiento</option>
                <option class="inpututil" value="height">Altura</option>
                <option class="inpututil" value="weight">Peso</option>
                <option class="inpututil" value="dominant_hand">Mano dominante</option>
                <option class="inpututil" value="country_point">Puntos realizados con su país</option>
                <option class="inpututil" value="point">Puntos conseguidos</option>
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
                <option class="inpututil" value="name">Nombre</option>
                <option class="inpututil" value="ranking">Ranking</option>
                <option class="inpututil" value="nationality">Nacionalidad</option>
                <option class="inpututil" value="position">Posición</option>
                <option class="inpututil" value="birthdate">Fecha de nacimiento</option>
                <option class="inpututil" value="height">Altura</option>
                <option class="inpututil" value="weight">Peso</option>
                <option class="inpututil" value="dominant_hand">Mano dominante</option>
                <option class="inpututil" value="country_point">Puntos realizados con su país</option>
                <option class="inpututil" value="point">Puntos conseguidos</option>
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
    {#each volleyball as volleyball_j}
        <li> <a href="/stats-volleyball/{volleyball_j.nationality}/{volleyball_j.weight}">{volleyball_j.name} - {volleyball_j.nationality}</a>  <button on:click="{deleteVolleyball(volleyball_j.name,volleyball_j.nationality+"/"+volleyball_j.weight)}">Borrar</button> </li>
        
    {/each}
    <br>
    <div id="container" style="display: block;">
        {#each Array.from({ length: n2 }, (_, i) => i) as nn}
            <button on:click={getVolleyball(nn+1)}> {nn + 1}</button>
        {/each}

    </div>
    <br>
    <button on:click="{createVolleyball}">Crear jugadora volleyball</button> <button on:click="{deleteTodasVolleyball}">Limpiar lista</button>
    <p> <a href="/stats-volleyball/graph" class="nav-link">Ver las gráficas</a></p>
</ul>
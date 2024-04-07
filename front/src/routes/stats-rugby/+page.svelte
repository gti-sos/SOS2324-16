<script>
    import { onMount } from "svelte";
    import {dev} from "$app/environment";
    import Mensaje from "../Mensaje.svelte";
    //Muestra si está en desarrollo  
    let API="/api/v2/stats-rugby";
    if(dev){
        API="http://localhost:10000/api/v2/stats-rugby";
    }

    let Rugby=[];
    let errorMsg="";
    let msg="";
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
                let param=[];
    let busqueda=[];
    let from="";
    let to="";
    let numFormularios=1;
    let API22="";
    let numero=10;
    let n2=0;
    let limit=false;
    let opcionSeleccionada=Array.from({ length: numFormularios }, () => 'first');;

    function handleSeleccion(event, nn) {
        opcionSeleccionada[nn] = event.target.value;
    }

    onMount(()=>{
        getRugby();
    })

    async function getRugby(numPag=1){
        try{
            let offset=numero*(numPag-1);
            API22=API;
            let response="";

            if(limit===true){
                if(API22===API){
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

            let status = await response.status;
            
            if(status===200 ){
                if(API22!==API){
                    msg="Filtrado realizado correctamente";
                }
                
                let data= await response.json();
                Rugby=data;
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
        await getRugby();
    }
    async function actualizaLO(){
        limit=false;
        await getRugby(1);
        let numElems=Rugby.length;
        if(numElems>0){
            n2=Math.ceil(numElems/numero) ;
        }
        limit=true;
        await getRugby(1);
        
    }

    
    async function aumentarf(){
        numFormularios=numFormularios+1;
    }

    async function disminuirF(){
        if (numFormularios > 0) {
            numFormularios -= 1;
        }
    }

    async function deleteRugby(nom,n){
        console.log(`Deleting ${nom}`);

        try{
            let response=await fetch(API+"/"+n,{
                                method:"DELETE"
                            })

            if(response.status===200){
                getRugby();
                msg="Jugador borrado correctamente";
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
                msg="Todos los jugadores borrados correctamente";
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
        <Mensaje tipo="error" mensaje={`Existe un contacto con nombre ${newRugby.first}`}/>
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
                <input type="number" bind:value={newRugby.age}>
            </td>
            <td>
                <input type="number" bind:value={newRugby.height}>
            </td>
            <td>
                <input type="number" bind:value={newRugby.weight}>
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
                <input type="number" bind:value={newRugby.caps}>
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
                <option class="inpututil" value="team">Equipo</option>
                <option class="inpututil" value="plabel">Posición</option>
                <option class="inpututil" value="age">Edad</option>
                <option class="inpututil" value="height">Altura</option>
                <option class="inpututil" value="weight">Peso</option>
                <option class="inpututil" value="bplace">Nacionalidad</option>
                <option class="inpututil" value="bdate">Fecha de nacimiento</option>
                <option class="inpututil" value="last">Apellido</option>
                <option class="inpututil" value="first">Nombre</option>
                <option class="inpututil" value="caps">Premios</option>
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
                <option class="inpututil" value="team">Equipo</option>
                <option class="inpututil" value="plabel">Posición</option>
                <option class="inpututil" value="age">Edad</option>
                <option class="inpututil" value="height">Altura</option>
                <option class="inpututil" value="weight">Peso</option>
                <option class="inpututil" value="bplace">Nacionalidad</option>
                <option class="inpututil" value="bdate">Fecha de nacimiento</option>
                <option class="inpututil" value="last">Apellido</option>
                <option class="inpututil" value="first">Nombre</option>
                <option class="inpututil" value="caps">Premios</option>
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
    {#each Rugby as rugby_j}
        <li> <a href="/stats-rugby/{rugby_j.bplace}/{rugby_j.weight}">{rugby_j.first} - {rugby_j.bplace}</a>  <button on:click="{deleteRugby(rugby_j.first,rugby_j.bplace+"/"+rugby_j.weight)}">Borrar</button> </li>
        
    {/each}
    <br>
    <div id="container" style="display: block;">
        {#each Array.from({ length: n2 }, (_, i) => i) as nn}
            <button on:click={getRugby(nn+1)}> {nn + 1}</button>
        {/each}

    </div>
    <br>
    <button on:click="{createRugby}">Crear jugador Rugby</button> <button on:click="{deleteAllRugby}">Limpiar lista</button>
</ul>
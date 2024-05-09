<svelte:head>
    <script src="https://bossanova.uk/jspreadsheet/v4/jexcel.js"></script> 
    <script src="https://jsuites.net/v4/jsuites.js"></script>

</svelte:head>

<script>
    import { onMount } from 'svelte';
    import {dev} from "$app/environment";

    onMount(() =>{
        getDataTable();

    });

    let DATAAPI1 = "/stats-volleyball/paises_serv";
    if(dev){
        DATAAPI1 = "http://localhost:10000/stats-volleyball/paises_serv";
        
    }

    // https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability/
    async function getListaServicios(){
        const url = 'https://streaming-availability.p.rapidapi.com/services';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '091e0bcec8msh63bb62660ef5b0cp134125jsn9307b8f17903',
                'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            //console.log(result.result['all4'])
            let aux=result.result;
            let claves=Object.keys(aux);
            //console.log(claves);
            return claves;
        } catch (error) {
            console.error(error);
        }

    }


    async function getPaisesServicios(){
        const url = 'https://streaming-availability.p.rapidapi.com/countries';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '091e0bcec8msh63bb62660ef5b0cp134125jsn9307b8f17903',
                'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            let aux2=result.result;
            console.log(aux2);
            return aux2;
        } catch (error) {
            console.error(error);
        }
    }


    async function getDataTable(){
        let paises_api_propia=[]

        try{
            const res4 = await fetch(DATAAPI1);
            const data4 = await res4.json();
            console.log(`Data received: ${JSON.stringify(data4,null,2)}'`);
            paises_api_propia=data4; 
        } catch (error){
            console.log( `Error fetching data: ${error}`);
        } 

        let l_servicios=await getListaServicios();
        let paises_serv=await getPaisesServicios();
        let columnas=[];
        let data=[]
        columnas.push({
                    type: 'text',
                    title:'Nacionalidad',
                    width:90
                });

        //Por cada pais fory dentro otro for con todos los servicios a ver si coincide o non

        for (let i=0;i<l_servicios.length;i++){
            let n=l_servicios[i];
            columnas.push({type: 'checkbox', title:n, width:90});
        }
        let nombre_corto_paises=Object.keys(paises_serv);


        for(let i=0;i<paises_api_propia.length;i++){
            let pais=paises_api_propia[i];
            if (pais==="USA"){
                pais='United States';
            }
            let sublista_pais=[];
            sublista_pais.push(pais);

            for(let j=0;j<nombre_corto_paises.length;j++){
                let id=nombre_corto_paises[j];
                let pais2_conj=paises_serv[id];
                if(pais2_conj["name"]===pais){
                    let servicios_de_ese_pais=Object.keys(pais2_conj["services"]) ;
                    for(let k=0;k<l_servicios.length;k++){
                        let serv_actual=l_servicios[k];
                        if(servicios_de_ese_pais.includes(serv_actual)){
                            sublista_pais.push(true);
                        }else{
                            sublista_pais.push(false);

                        }

                    }

                }
                
            }

            data.push(sublista_pais);

        }

        getTabla(data,columnas);

    }

    async function getTabla(dat,colum){

        var data = dat;

        jspreadsheet(document.getElementById('spreadsheet'), {
            data:data,
            columns: colum
        });

        }

</script>


<h3>Tabla con los países de las jugadoras de volleyball y los servicios de streaming disponibles en cada uno de ellos</h3>
<div id="spreadsheet"></div>
<svelte:head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.7.0/canvasjs.min.js"></script>
</svelte:head>


<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    import {dev} from "$app/environment";

    let DATAAPI = "/api/v2/stats-rugby-integrations/data4";
    if(dev){
        DATAAPI="http://localhost:10000/api/v2/stats-rugby-integrations/data4";
    }
    
    let externalApi = [];
    let miapi = []
    let chartData = []; 

    onMount(async () => {
        externalApi = await getData();
        miapi = await getDataAPI();

        chartData = await datosGraph(); 
        renderChart(); 
    });

    async function getDataAPI(){
        try{
            const res = await fetch(DATAAPI);
            const data = await res.json();
            // console.log(`Data received: ${JSON.stringify(data,null,2)}'`);
            return data;
        } catch (error){
            console.log( `Error fetching data: ${error}`);
        } 
    }

    async function getData(){
        const url = 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLPlayerList';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '46de8c89d2msh0c5dfe7dff19129p1701a5jsn2e7c3196f15b',
                'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result.body);
            return result.body;
        } catch (error) {
            console.error(error);
        }
    }

    async function datosGraph(){
        let data=[];
        let l1=externalApi.length;
        let l2=miapi.length;
        for(let i=0; i< l1; i++){
            let peso = Math.round(externalApi[i].weight * 0.453592);
            let altura=externalApi[i].height.split("'");
            let pies = parseInt(altura[0]);
            let pulgadas = parseInt(altura[1]);
            let alturaEnCm = Math.round(pies * 30.48 + pulgadas * 2.54);
            data.push([peso,alturaEnCm]);
        }
        for (let i=0; i< l2; i++){
            data.push([miapi[i][0], miapi[i][1]]);
        }
        console.log(Array.isArray(data));
        return data;
    }

    function renderChart() {
        const minHeight = Math.min(...chartData.map(([peso, altura]) => altura));
        const maxHeight = Math.max(...chartData.map(([peso, altura]) => altura));

        var chart = new CanvasJS.Chart("chartContainer", {
            title: {
                text: "Peso vs Altura"
            },
            axisX: {
                title: "Peso en kg"
            },
            axisY: {
                title: "Altura en cm",
                minimum: minHeight, 
                maximum: maxHeight 
            },
            data: [{
                type: "scatter",
                dataPoints: chartData.map(([peso, altura]) => ({ x: peso, y: altura }))
            }]
        });
        
        chart.render();
    }
    
   
</script>

<ul>

    <div id="chartContainer" style="height: 300px; width: 100%;"></div>

</ul>
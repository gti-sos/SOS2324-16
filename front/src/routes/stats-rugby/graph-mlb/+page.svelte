<svelte:head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.7.0/canvasjs.min.js"></script>
</svelte:head>

<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    import {dev} from "$app/environment";

    let DATAAPI = "/api/v2/stats-rugby-integrations/data5";
    if(dev){
        DATAAPI="http://localhost:10000/api/v2/stats-rugby-integrations/data5";
    }
    
    let teams = [];
    let miapi = [];
    let chart;

    onMount(async () => {
        teams = await getTeamData();
        teams.map((x) => {
            return [x.teamCity, x.wins];
        });
        
        miapi = await getDataAPI();
        teams = teams.concat(miapi)

        teams = teams.reduce((unique, item) => {
            return unique.some(i => i[0] === item[0]) ? unique : [...unique, item];
        }, []);
    
        teams = teams.map((item, index) => ({ label: item[0], y: index }));

        let total = teams.reduce((acc, curr) => acc + curr.y, 0);
        teams.forEach((t) => {
            t.y = (t.y / total) * 100;
        });
        console.log(teams);
        fillChart(teams);
    });

    async function getDataAPI(){
        try{
            const res = await fetch(DATAAPI);
            const data = await res.json();
            return data;
        } catch (error){
            console.log( `Error fetching data: ${error}`);
        } 
    }

    async function getTeamData(){
        const url = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBTeams?teamStats=true&topPerformers=true';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'ca542eb6dbmsha5edf4ea0fd0f32p146eb2jsn67517c3e59d5',
                'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            let res = [];
            for(let elem of result.body){
                res.push([elem.teamCity, elem.wins]);
            }
            return res;

        } catch (error) {
            console.error(error);
        }
    }

    function fillChart(d){
        chart = new CanvasJS.Chart("chartContainer", {
        theme: "light2",
        animationEnabled: true,
        title: {
            text: "Porcentaje de victorias por país"
        },
        data: [{
            type: "pie",
            showInLegend: true,
            legendText: "{label}",
            indexLabel: "{label}: {y}%",
            dataPoints: d
        }]
        });

        chart.render();

        return () => {
            chart.destroy();
        };
    }
    
   
</script>

<div id="chartContainer" style="height: 370px; width: 100%;"></div>

<style>
  /* Estilos opcionales para el contenedor del gráfico */
  #chartContainer {
    height: 370px;
    width: 100%;
  }
</style>
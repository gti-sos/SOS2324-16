<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';
    import {dev} from "$app/environment";

    let DATAAPI = "/stats-football/data4";
    if(dev){
        DATAAPI = "http://localhost:10000/stats-football/data4";
    }

    //let countries = [];
    
    async function getData1(data) {
        const url = 'https://transfermarkt-db.p.rapidapi.com/v1/static/countries?locale=DE';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '0ce0fceddamsh6c7a31cf44a49a9p10f399jsna366b1dbf9cf',
                'X-RapidAPI-Host': 'transfermarkt-db.p.rapidapi.com'
            }
        };
        
        try{
            const response = await fetch(url, options);
            const result = await response.json();
            const jugadores = result.de.slice(0,10);

            let paisesSet = []
            const jgpais = [];

            jugadores.forEach(jg => {
                if (!(paisesSet.includes(jg.name))){
                    paisesSet.push(jg.name);
                }
            });

            for(let i=0;i<paisesSet.length;i++){
                let pais = paisesSet[i];
                let array = jugadores.filter(jg => jg.name === pais).map(jg => jg.id);
                let porcentaje = array.length/jugadores.length * 100.0;
                jgpais.push([pais, porcentaje]);
            }
            return jgpais;
        } catch (error){
            console.error(error);
        }
    }
    
    async function getData2(){
        try{
            const res = await fetch(DATAAPI);
            const data = await res.json();
            return data; 
        } catch (error){
            console.error(error);
        } 
    }

    async function getData3(){
        try {
            const data1 = await getData1();
            const data2 = await getData2();
            let mezcla = data1;
            let totalPorcentaje = 0.;

            data2.forEach(([pais, porcentaje]) => {
                if (mezcla.includes(pais)) {
                    const porcAct = mezcla.get(pais);
                    mezcla.push([pais, porcAct + porcentaje]);
                } else {
                    mezcla.push([pais, porcentaje]);
                }
            });
            
            for(let i=0; i<mezcla.length; i++){
                totalPorcentaje += mezcla[i][1];
            }

            mezcla = mezcla.map(([pais, porcentaje]) => [pais, (porcentaje / totalPorcentaje) * 100.]);

            fillChart(mezcla);
        } catch (error) {
            console.error(error);
        }
    }

    async function fillChart(d){
        Highcharts.chart('container', {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: 'Porcentaje de jugadores en un país'
                },
                tooltip: {
                    valueSuffix: '%'
                },
                plotOptions: {
                    series: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: [{
                            enabled: true,
                            distance: 20
                        }, {
                            enabled: true,
                            distance: -40,
                            format: '{point.percentage:.1f}%',
                            style: {
                                fontSize: '1.2em',
                                textOutline: 'none',
                                opacity: 0.7
                            },
                            filter: {
                                operator: '>',
                                property: 'percentage',
                                value: 10
                            }
                        }]
                    }
                },
                series: [
                    {
                        name: 'Percentage',
                        colorByPoint: true,
                        data: d.map(([pais, porcentaje]) => ({ name: pais, y: porcentaje }))
                    }
                ]        
        });
    }

    onMount(() => {
        getData3();
    });
    
</script>

<!-- <ul>
    {#each countries as country}
        <li>{country.name} - {country.iso3166a3}</li>
    {/each}
</ul> -->

<div id="container" style="width:100%; height:400px;"></div>
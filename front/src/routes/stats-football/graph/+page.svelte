<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>

    <script src="https://code.highcharts.com/highcharts-3d.js"></script>
    <script src="https://code.highcharts.com/modules/cylinder.js"></script>
    <script src="https://code.highcharts.com/modules/funnel3d.js"></script>
    <script src="https://code.highcharts.com/modules/pyramid3d.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    import {onMount} from "svelte";
    import {dev} from "$app/environment";

    let DATAAPI1 = "/api/v2/stats-football-integrations/data1";
    let DATAAPI2 = "/api/v2/stats-football-integrations/data2";
    if(dev){
        DATAAPI1="http://localhost:10000/api/v2stats-football-integrations/data1";
        DATAAPI2="http://localhost:10000/api/v2/stats-football-integrations/data2";
    }
    
    async function getData1(){
        try{
            const res = await fetch(DATAAPI1);
            const data = await res.json();
            console.log(`Data received: ${JSON.stringify(data,null,2)}'`);
            fillChart1(data); 
        } catch (error){
            console.log( `Error fetching data: ${error}`);
        } 
    }


    async function fillChart1(d){
        const chart = Highcharts.chart('container', {
                            chart: {
                                type: 'pyramid3d',
                                options3d: {
                                    enabled: true,
                                    alpha: 10,
                                    depth: 50,
                                    viewDistance: 50
                                }
                            },
                            title: {
                                text: 'Gráfica pirámide de clubes'
                            },
                            plotOptions: {
                                series: {
                                    dataLabels: {
                                        enabled: true,
                                        format: '<b>{point.name}</b> ({point.y:,.0f})',
                                        allowOverlap: true,
                                        x: 10,
                                        y: -5
                                    },
                                    width: '60%',
                                    height: '80%',
                                    center: ['50%', '45%']
                                }
                            },
                            series: [{
                                name: 'My data',
                                data: d}
                            ]
                        });
    }

    async function getData2(){
        try{
            const res = await fetch(DATAAPI2);
            const data = await res.json();
            console.log(`Data received: ${JSON.stringify(data,null,2)}'`);
            fillChart2(data); 
        } catch (error){
            console.log( `Error fetching data: ${error}`);
        } 
    }

    async function fillChart2(d){
        const chart = Highcharts.chart('container2', {
                        chart: {
                            type: 'area'
                        },
                        title: {
                            text: 'Edades en Europa y resto del mundo'
                        },
                        xAxis: {
                            allowDecimals: false,
                            accessibility: {
                                rangeDescription: 'Range: 1980 to 1995.'
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Edades'
                            }
                        },
                        tooltip: {
                            pointFormat: '{series.name} tiene un jugador con <b>{point.y:,.0f}</b><br/>años de edad en {point.x}'
                        },
                        plotOptions: {
                            area: {
                                pointStart: 1980,
                                marker: {
                                    enabled: false,
                                    symbol: 'circle',
                                    radius: 2,
                                    states: {
                                        hover: {
                                            enabled: true
                                        }
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Europa',
                            data: d["europa"]
                        }, {
                            name: 'Resto del mundo',
                            data: d["resto"]
                        }]
                    });
    }

    onMount(()=>{
        getData1();
        getData2();
    })


</script>


<div id="container" style="width:100%; height:400px;"></div>
<div id="container2" style="width:100%; height:400px;"></div>
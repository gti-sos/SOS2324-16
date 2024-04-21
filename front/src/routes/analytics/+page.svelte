<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    import {onMount} from "svelte";
    import {dev} from "$app/environment";

    let DATAAPI1 = "/data";
    if(dev){
        DATAAPI1="http://localhost:10000/data";
    }
    
    async function getData1(){
        try{
            const res = await fetch(DATAAPI1);
            const data = await res.json();
            console.log(`Data received: ${JSON.stringify(data,null,2)}'`);
            fillChart(data); 
        } catch (error){
            console.log( `Error fetching data: ${error}`);
        } 
    }


    async function fillChart(d){
        const chart = Highcharts.chart('container', {

                        chart: {
                            type: 'bubble',
                            plotBorderWidth: 1,
                            zoomType: 'xy'
                        },

                        legend: {
                            enabled: false
                        },

                        title: {
                            text: 'Sugar and fat intake per country'
                        },

                        subtitle: {
                            text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>'
                        },

                        accessibility: {
                            point: {
                                valueDescriptionFormat: '{index}. {point.name}, peso: {point.x}g, altura: {point.y}g, tamaño: {point.z}%.'
                            }
                        },

                        xAxis: {
        
                            labels: {
                                format: '{value} kg'
                            },
                        },

                        yAxis: {
        
                            labels: {
                                format: '{value} cm'
                            },
                        },


                        tooltip: {
                            useHTML: true,
                            headerFormat: '<table>',
                            pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                                '<tr><th>Peso:</th><td>{point.x}kg</td></tr>' +
                                '<tr><th>Altura:</th><td>{point.y}cm</td></tr>' +
                                '<tr><th>Tamaño (adults):</th><td>{point.z}%</td></tr>',
                            footerFormat: '</table>',
                            followPointer: true
                        },

                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}'
                                }
                            }
                        },

                        series: [{
                            data: d,
                            colorByPoint: true
                        }]

                        });

    }

    

    onMount(()=>{
        getData1();
    })


</script>


<div id="container" style="width:100%; height:400px;"></div>
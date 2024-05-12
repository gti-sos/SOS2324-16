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

    let DATAAPI1 = "/stats-volleyball/data3";
    let DATAAPI2 = "/stats-football/data3";
    let DATAAPI3 = "/stats-rugby/data3";
    if(dev){
        DATAAPI1 = "http://localhost:10000/stats-volleyball/data3";
        DATAAPI2 = "http://localhost:10000/stats-football/data3";
        DATAAPI3 = "http://localhost:10000/stats-rugby/data3";
    }
    
    //Unimos las 3 APIs para integrarlas
    async function getData1(){
        try{

            let data=[]
            const res1 = await fetch(DATAAPI1);
            const data1 = await res1.json();
            console.log(`Data received: ${JSON.stringify(data1,null,2)}'`);

            const res2 = await fetch(DATAAPI2);
            const data2 = await res2.json();
            console.log(`Data received: ${JSON.stringify(data2,null,2)}'`);

            const res3 = await fetch(DATAAPI3);
            const data3 = await res3.json();
            console.log(`Data received: ${JSON.stringify(data3,null,2)}'`);

            for(let i=0;i<data1.length;i++){
                let elem=data1[i];
                data.push(elem);
            }

            for(let i=0;i<data2.length;i++){
                let elem=data2[i];
                data.push(elem);
            }

            for(let i=0;i<data3.length;i++){
                let elem=data3[i];
                data.push(elem);
            }


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
                            text: 'Altura y peso de los deportistas'
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
                            title: {
                                    text: 'Peso'
                                }
                        },

                        yAxis: {
        
                            labels: {
                                format: '{value} cm'
                            },
                            title: {
                                    text: 'Altura'
                                }
                        },


                        tooltip: {
                            useHTML: true,
                            headerFormat: '<table>',
                            pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                                '<tr><th>Peso:</th><td>{point.x}kg</td></tr>' +
                                '<tr><th>Altura:</th><td>{point.y}cm</td></tr>', 
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
<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>

</svelte:head>

<script>
    import {onMount} from "svelte";
    import {dev} from "$app/environment";

    let DATAAPI1 = "/stats-volleyball/data1";
    let DATAAPI2 = "/stats-volleyball/data2";
    if(dev){
        DATAAPI1="http://localhost:10000/stats-volleyball/data1";
        DATAAPI2="http://localhost:10000/stats-volleyball/data2";
    }
    
    async function getData1(){
        try{
            const res = await fetch(DATAAPI1);
            const data = await res.json();
            console.log(`Data received: ${JSON.stringify(data,null,2)}'`);
            fillChart(data.map((o)=> o.alt)); 
        } catch (error){
            console.log( `Error fetching data: ${error}`);
        } 
    }


    async function fillChart(d){
        const chart = Highcharts.chart('container', {
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: 'Gráfica altura jugadoras'
                            },
                            yAxis: {
                                title: {
                                    text: 'Centímetros'
                                }
                            },
                            plotOptions: {
                                line: {
                                    dataLabels: {
                                        enabled: true
                                    },
                                    enableMouseTracking: false
                                }
                            },
                            series: [{
                                name: 'Jugadoras',
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
        Highcharts.chart('container2', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Porcentaje de paises en la base de datos'
    },
    tooltip: {
        valueSuffix: '%'
    },
    subtitle: {
        text:
        'Source:<a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">MDPI</a>'
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
            data:d
        }
    ]
});


    }

    onMount(()=>{
        getData1();
        getData2();
    })


</script>


<div id="container" style="width:100%; height:400px;"></div>
<div id="container2" style="width:100%; height:400px;"></div>
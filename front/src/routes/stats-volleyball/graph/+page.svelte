<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://cdn.zingchart.com/zingchart.min.js"></script>

</svelte:head>

<script>
    import {onMount} from "svelte";
    import {dev} from "$app/environment";

    let DATAAPI1 = "/api/v2/stats-volleyball-integrations/data1";
    let DATAAPI2 = "/api/v2/stats-volleyball-integrations/data2";
    let DATAAPI4 = "/api/v2/stats-volleyball-integrations/data4";
    if(dev){
        DATAAPI1="http://localhost:10000/api/v2/stats-volleyball-integrations/data1";
        DATAAPI2="http://localhost:10000/api/v2/stats-volleyball-integrations/data2";
        DATAAPI4="http://localhost:10000/api/v2/stats-volleyball-integrations/data4";
    }
    
    //Obtenemos las alturas de las jugadoras
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


    //Como parámetro de entrada le pasamos una lista con las alturas de las jugadoras
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


    //El parámetro de entrada es una lista de objetos. Cada objeto contiene el nombre del país y el porcentaje de jugadoras de dicho país
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
    // subtitle: {
    //     text:
    //     'Source:<a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">MDPI</a>'
    // },
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
            name: 'Porcentaje',
            colorByPoint: true,
            data:d
        }
    ]
});


    }

    async function getData4(){
        try{
            const res = await fetch(DATAAPI4);
            const data = await res.json();
            fillChart4(data); 
            
        } catch (error){
            console.log( `Error fetching data: ${error}`);
        } 
    }

    //Recibe una lista con el número de jugadoras que pertenecen a cada intervalo
    async function fillChart4(d){

        //ZC.LICENSE = ["569d52cefae586f634c54f86dc99e6a9", "b55b025e438fa8a98e32482b5f768ff5"]; // CHART CONFIG
    // -----------------------------
        let chartConfig = {
        type: 'hfunnel',
        theme: 'classic',
        backgroundColor: '#fff',
        backgroundColor2: '#f1f1f1',
        plot: {
            tooltip: {
            shadow: false,
            },
            tooltipText: '%v jugadoras',
            offset: '40px',
            scales: 'scale-x,scale-y-2',
        },
        plotarea: {
            margin: '75px 25px 50px 80px',
        },
        scaleX: {
            values: ['Jugadoras<br> de <br>Volleyball'],
            item: {
            fontSize: '14px',
            offsetY: '-20px',
            },
        },
        scaleY: {
            visible: false,
        },
        scaleY2: {
            values: [
            'Jugadoras con más de 550 puntos',
            'Jugadoras con más de 575 puntos',
            'Jugadoras con más de 600 puntos',
            'Jugadoras con más de 800 puntos',
            'Jugadoras con más de 900 puntos',
            ],
            guide: {
            items: [{
                backgroundColor: '#fff',
                },
                {
                backgroundColor: '#eee',
                },
                {
                backgroundColor: '#ddd',
                },
                {
                backgroundColor: '#ccc',
                },
                {
                alpha: 0.2,
                backgroundColor: 'green',
                },
            ],
            },
        },
        series: [{
            values: [d[0]],
            backgroundColor: '#5FB4E8',
            borderColor: '#000000',
            shadow: false,
            },
            {
            values: [d[1]],
            backgroundColor: '#EBC765',
            borderColor: '#000000',
            shadow: false,
            },
            {
            values: [d[2]],
            backgroundColor: '#8FB550',
            borderColor: '#000000',
            shadow: false,
            },
            {
            values: [d[3]],
            backgroundColor: '#D17549',
            borderColor: '#000000',
            shadow: false,
            },
            {
            values: [d[4]],
            backgroundColor: '#8E468E',
            borderColor: '#000000',
            shadow: false,
            },
        ],
        };

        // RENDER CHARTS
        // -----------------------------
        zingchart.render({
                id: 'myChart',
                data: chartConfig,
                });
        
    }



    onMount(()=>{
        getData1();
        getData2();
        getData4();
    })


</script>

<h2>Las dos primeras gráficas con Highcharts</h2>
<div id="container" style="width:100%; height:400px;"></div>
<div id="container2" style="width:100%; height:400px;"></div>
<br>
<h2>La gráfica de Zingchart</h2>
<div id="myChart" ></div>
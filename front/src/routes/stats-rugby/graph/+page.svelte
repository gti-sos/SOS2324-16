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

    let DATAAPI1 = "/api/v2/stats-rugby-integrations/data1";
    let DATAAPI2 = "/api/v2/stats-rugby-integrations/data2";
    if(dev){
        DATAAPI1="http://localhost:10000/api/v2/stats-rugby-integrations/data1";
        DATAAPI2="http://localhost:10000/api/v2/stats-rugby-integrations/data2";
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
                                type: 'bar'
                            },
                            title: {
                                text: 'Gráfica premios conseguidos'
                            },
                            xAxis: {
                                type: 'category'
                            },
                            yAxis: {
                                title: {
                                    text: 'Premios'
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
                                name: 'Premios',
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
    type: 'bubble',
    plotBorderWidth: 1,
    zoomType: 'xy'
},

title: {
    text: 'Peso y altura de jugadores',
    align: 'left'
},

xAxis: {
    gridLineWidth: 1,
    accessibility: {
        rangeDescription: 'Range: 0 to 100.'
    }
},

yAxis: {
    startOnTick: false,
    endOnTick: false,
    accessibility: {
        rangeDescription: 'Range: 0 to 100.'
    }
},

series: [{
    data: d,
    marker: {
        fillColor: {
            radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
            stops: [
                [0, 'rgba(255,255,255,0.5)'],
                [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
            ]
        }
    }
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
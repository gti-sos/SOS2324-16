<svelte:head>
    <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/locales/de_DE.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/geodata/germanyLow.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/fonts/notosans-sc.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/percent.js"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';
    import {dev} from "$app/environment";

    let DATAAPI = "api/v2/stats-football-integrations/data5";
    if(dev){
        DATAAPI = "http://localhost:10000/api/v2/stats-football-integrations/data5";
    }
    
    async function getData1(){
        const url = 'https://basketapi1.p.rapidapi.com/api/basketball/team/3436/players';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b0f281d7f3msh13de4455d1b8a25p1c2a06jsn2bd53ab1a197',
                'X-RapidAPI-Host': 'basketapi1.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const players = result.players.slice(0,10);
            
            let res = [];

            for(let i of players){
               res.push(i.player.height);
            }
            return res;
        } catch (error) {
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
    
    

    onMount(async () => {
        
        am5.ready(async function() {

            var root = am5.Root.new("chartdiv");

            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            try {
                const alturas = await getData1();
                const data2 = await getData2();
                let mezcla = alturas.concat(data2);

                const rangos = [
                    { nombre: '160cm - 170cm', min: 160, max: 170, conteo: 0 },
                    { nombre: '171cm - 180cm', min: 171, max: 180, conteo: 0 },
                    { nombre: '181cm - 190cm', min: 181, max: 190, conteo: 0 },
                    { nombre: '191cm - 200cm', min: 191, max: 200, conteo: 0 },
                    { nombre: '201cm - 210cm', min: 201, max: 210, conteo: 0 },
                    { nombre: '211cm - 220cm', min: 211, max: 220, conteo: 0 },
                ];

                mezcla.forEach(altura => {
                    rangos.forEach(rango => {
                        if (altura >= rango.min && altura <= rango.max) {
                            rango.conteo++;
                        }
                    });
                });

                mezcla = rangos.map(rango => ({height: rango.nombre, value: rango.conteo}));

                var chart = root.container.children.push(
                    am5xy.XYChart.new(root, {
                        panX: true,
                        panY: true,
                        wheelX: "panX",
                        wheelY: "zoomX",
                        pinchZoomX: true,
                        paddingLeft:0,
                        paddingRight:1
                    })
                );

                var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
                cursor.lineY.set("visible", false);

                var xRenderer = am5xy.AxisRendererX.new(root, { 
                    minGridDistance: 30, 
                    minorGridEnabled: true
                });

                xRenderer.labels.template.setAll({
                    rotation: -90,
                    centerY: am5.p50,
                    centerX: am5.p100,
                    paddingRight: 15
                });

                xRenderer.grid.template.setAll({
                    location: 1
                })

                var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
                    maxDeviation: 0.3,
                    categoryField: "height",
                    renderer: xRenderer,
                    tooltip: am5.Tooltip.new(root, {})
                }));

                var yRenderer = am5xy.AxisRendererY.new(root, {
                    strokeOpacity: 0.1
                })

                var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                    maxDeviation: 0.3,
                    renderer: yRenderer
                }));

                var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    name: "Series 1",
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: "value",
                    sequencedInterpolation: true,
                    categoryXField: "height",
                    tooltip: am5.Tooltip.new(root, {
                        labelText: "{valueY}"
                    })
                }));

                series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
                series.columns.template.adapters.add("fill", function (fill, target) {
                    return chart.get("colors").getIndex(series.columns.indexOf(target));
                });

                series.columns.template.adapters.add("stroke", function (stroke, target) {
                    return chart.get("colors").getIndex(series.columns.indexOf(target));
                });

                xAxis.data.setAll(mezcla);
                series.data.setAll(mezcla);

                series.appear(1000);
                chart.appear(1000, 100);
            } catch (error){
                console.error(error);
            }
        });
    });
    
</script>

<style>
    #chartdiv {
      width: 100%;
      height: 500px;
    }
</style>

<div id="chartdiv"></div>
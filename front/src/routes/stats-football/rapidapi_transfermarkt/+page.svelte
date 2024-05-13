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
    import { dev } from "$app/environment";
    
    let DATAAPI = "api/v2/stats-football-integrations/data4";
    if (dev) {
        DATAAPI = "http://localhost:10000/api/v2/stats-football-integrations/data4";
    }

    //let countries = [];
    
    async function getData1() {
        const url = 'https://transfermarkt-db.p.rapidapi.com/v1/static/countries?locale=DE';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '0ce0fceddamsh6c7a31cf44a49a9p10f399jsna366b1dbf9cf',
                'X-RapidAPI-Host': 'transfermarkt-db.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const jugadores = result.de.slice(0, 10);

            let paisesSet = []
            const jgpais = [];

            jugadores.forEach(jg => {
                if (!(paisesSet.includes(jg.name))) {
                    paisesSet.push(jg.name);
                }
            });

            for (let i = 0; i < paisesSet.length; i++) {
                let pais = paisesSet[i];
                let array = jugadores.filter(jg => jg.name === pais).map(jg => jg.id);
                let porcentaje = array.length / jugadores.length * 100.0;
                jgpais.push([pais, porcentaje]);
            }

            return jgpais;
        } catch (error) {
            console.error(error);
        }
    }

    async function getData2() {
        try {
            const res = await fetch(DATAAPI);
            const data = await res.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    onMount(() => {
        am5.ready(async function() {
            var root = am5.Root.new("chartdiv");

            root.setThemes([
                am5themes_Animated.new(root)
            ]);
            
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
                })
                

                for (let i = 0; i < mezcla.length; i++) {
                    totalPorcentaje += mezcla[i][1];
                }

                mezcla = mezcla.map(([pais, porcentaje]) => ({
                    category: pais,
                    value: (porcentaje / totalPorcentaje) * 100
                }));

                var chart = root.container.children.push(
                    am5percent.PieChart.new(root, {
                        endAngle: 270
                    })
                );

                var series = chart.series.push(
                    am5percent.PieSeries.new(root, {
                        valueField: "value",
                        categoryField: "category",
                        endAngle: 270
                    })
                );

                series.states.create("hidden", {
                    endAngle: -90
                });
                console.log(mezcla);
                series.data.setAll(mezcla);

                series.appear(1000, 100);
            } catch (error) {
                console.error(error);
            }
            
            // <ul>
            //     {#each countries as country}
            //         <li>{country.name} - {country.iso3166a3}</li>
            //     {/each}
            // </ul>

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
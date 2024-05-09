<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';

    import {dev} from "$app/environment";

    let DATAAPI1 = "/stats-volleyball/nba_players";
    if(dev){
        DATAAPI1 = "http://localhost:10000/stats-volleyball/nba_players";
        
    }

    let jugadores=[];
    onMount(async () => {
        //jugadores= await getDataAPIExternaJugadores();
        preparaChat();
    });

 
    // https://rapidapi.com/tank01/api/tank01-fantasy-stats/

    async function getDataAPIExternaJugadores(){
        const url = 'https://tank01-fantasy-stats.p.rapidapi.com/getNBAPlayerList';
       
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '091e0bcec8msh63bb62660ef5b0cp134125jsn9307b8f17903',
                'X-RapidAPI-Host': 'tank01-fantasy-stats.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            return result.body.slice(0,10);
        } catch (error) {
            console.error(error);
        }

    }

    async function preparaChat(){
        try{

            let data_m=[]
            const res1 = await fetch(DATAAPI1);
            data_m= await res1.json();
            console.log(`Data received: ${JSON.stringify(data_m,null,2)}'`);

            let d_h=await getListaAlturaJugadores();

            //Falta copiar lo de la api propia y cambiar DMC por d_h

            let data_h=[];
            let ar1=d_h.filter(el => el<=180)
            let p1= ar1.length/d_h.length;
            data_h.push(p1*100);

            let ar2=d_h.filter(el => el>180 && el<=190)
            let p2= ar2.length/d_h.length;
            data_h.push(p2*100);

            let ar3=d_h.filter(el => el>190 && el<=200)
            let p3= ar3.length/d_h.length;
            data_h.push(p3*100);

            let ar4=d_h.filter(el => el>200 && el<=210)
            let p4= ar4.length/d_h.length;
            data_h.push(p4*100);

            let ar5=d_h.filter(el => el>210 && el<=220)
            let p5= ar5.length/d_h.length;
            data_h.push(p5*100);

            let ar6=d_h.filter(el => el>220)
            let p6= ar6.length/data_h.length;
            data_h.push(p6*100);


            fillChart(data_m,data_h); 
        } catch (error){
            console.log( `Error fetching data: ${error}`);
        } 
    }

    async function getListaAlturaJugadores(){

        let jugadores2=[]
        jugadores2=await getDataAPIExternaJugadores();

        let res=[];
        for(let i=0;i<jugadores2.length; i++){
            let jg=jugadores2[i];
            let jg_id=Number(jg.playerID);

            const url = `https://tank01-fantasy-stats.p.rapidapi.com/getNBAPlayerInfo?playerID=${jg_id}`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '091e0bcec8msh63bb62660ef5b0cp134125jsn9307b8f17903',
                    'X-RapidAPI-Host': 'tank01-fantasy-stats.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.json();
                let alt=Number( result.body.height.replace("-", "."));
                res.push(alt*30.48); 
            } catch (error) {
                console.error(error);
            }

        }

        console.log(res);

        return res;
    }


    async function fillChart(d_m,d_h){

        Highcharts.Templating.helpers.abs = value => Math.abs(value);

// Age altura 170-180-190-200-210-220 [tia:alt,tio:alt],tio 
        const alturas= ['-180','180-190','190-200','200-210','210-220','220+']

        const categories = [
            '0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-40', '40-45',
            '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+'
        ];


        Highcharts.chart('container', {
                        chart: {
                            type: 'bar'
                        },
                        title: {
                            text: 'Altura de jugador@s por intervalos',
                            align: 'left'
                        },
                        accessibility: {
                            point: {
                                valueDescriptionFormat: '{index}. Altura {xDescription}, {value}%.'
                            }
                        },
                        xAxis: [{
                            categories: alturas,
                            reversed: false,
                            labels: {
                                step: 1
                            },
                            accessibility: {
                                description: 'Height (male)'
                            }
                        }, { // mirror axis on right side
                            opposite: true,
                            reversed: false,
                            categories: alturas,
                            linkedTo: 0,
                            labels: {
                                step: 1
                            },
                            accessibility: {
                                description: 'Height (female)'
                            }
                        }],
                        yAxis: {
                            title: {
                                text: null
                            },
                            labels: {
                                format: '{abs value}%'
                            },
                            accessibility: {
                                description: 'Porcentaje altura',
                                rangeDescription: 'Range: 0 to 5%'
                            }
                        },

                        plotOptions: {
                            series: {
                                stacking: 'normal',
                                borderRadius: '50%'
                            }
                        },

                        tooltip: {
                            format: '<b>{series.name}, altura {point.category}</b><br/>' +
                                'Population: {(abs point.y):.1f}%'
                        },

                        series: [{
                            name: 'Jugadoras volleyball',
                            data: d_m
                        }, {
                            name: 'Jugadores baloncesto',
                            data: d_h
                        }]
                    });

    }

</script>
<!-- <ul>

    {#each jugadores as x}
        <li>{x.longName} - {x.team}</li>
    {/each}

</ul> -->

<figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description">
        Esta gráfica muestra el porcentaje de jugadoras de volleyball y jugadores de la NBA en base al intervalo
        de altura en el que se encuentran
    </p>
</figure>
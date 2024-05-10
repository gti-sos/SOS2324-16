<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';

    import {dev} from "$app/environment";

    let DATAAPI1 = "/stats-volleyball/nba_player";
    if(dev){
        DATAAPI1 = "http://localhost:10000/stats-volleyball/nba_player";
        
    }

    let jugadores=[];
    onMount(async () => {
        //jugadores= await getDataAPIExternaJugadores();
        preparaChat();
        //fillChart2();
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


            fillChart2(data_m,data_h); 
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


//     async function fillChart(d_m,d_h){

//         Highcharts.Templating.helpers.abs = value => Math.abs(value);

// // Age altura 170-180-190-200-210-220 [tia:alt,tio:alt],tio 
//         const alturas= ['-180','180-190','190-200','200-210','210-220','220+']

//         const categories = [
//             '0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-40', '40-45',
//             '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+'
//         ];


//         Highcharts.chart('container', {
//                         chart: {
//                             type: 'bar'
//                         },
//                         title: {
//                             text: 'Altura de jugador@s por intervalos',
//                             align: 'left'
//                         },
//                         accessibility: {
//                             point: {
//                                 valueDescriptionFormat: '{index}. Altura {xDescription}, {value}%.'
//                             }
//                         },
//                         xAxis: [{
//                             categories: alturas,
//                             reversed: false,
//                             labels: {
//                                 step: 1
//                             },
//                             accessibility: {
//                                 description: 'Height (male)'
//                             }
//                         }, { // mirror axis on right side
//                             opposite: true,
//                             reversed: false,
//                             categories: alturas,
//                             linkedTo: 0,
//                             labels: {
//                                 step: 1
//                             },
//                             accessibility: {
//                                 description: 'Height (female)'
//                             }
//                         }],
//                         yAxis: {
//                             title: {
//                                 text: null
//                             },
//                             labels: {
//                                 format: '{abs value}%'
//                             },
//                             accessibility: {
//                                 description: 'Porcentaje altura',
//                                 rangeDescription: 'Range: 0 to 5%'
//                             }
//                         },

//                         plotOptions: {
//                             series: {
//                                 stacking: 'normal',
//                                 borderRadius: '50%'
//                             }
//                         },

//                         tooltip: {
//                             format: '<b>{series.name}, altura {point.category}</b><br/>' +
//                                 'Population: {(abs point.y):.1f}%'
//                         },

//                         series: [{
//                             name: 'Jugadoras volleyball',
//                             data: d_m
//                         }, {
//                             name: 'Jugadores baloncesto',
//                             data: d_h
//                         }]
//                     });

//     }

    async function fillChart2(d_m,d_h){

        ZC.LICENSE = ["569d52cefae586f634c54f86dc99e6a9", "b55b025e438fa8a98e32482b5f768ff5"]; // CHART CONFIG
        // -----------------------------
        let chartConfig = {
        theme: 'classic',
        graphset: [{
        backgroundColor: 'white',
        height: '10%',
        title: {
            text: 'Altura jugador@s',
            backgroundColor: 'white',
            color: '#05669D',
            fontFamily: 'Helvetica',
            fontSize: '40px',
            fontWeight: 'bold',
            offsetX: '45px',
            offsetY: '-6px',
            textAlign: 'left'
        },
        // subtitle: {
        //     text: '<span style=\'font-weight:none;\'>Population:</span> <span style=\'font-size:40;font-weight:bold;\'>20,962,000</span>',
        //     color: '#05669D',
        //     fontFamily: 'Helvetica',
        //     fontWeight: 'none',
        //     offsetX: '-185px',
        //     offsetY: '-6px',
        //     textAlign: 'right'
        // },
        labels: [{
            text: 'Male',
            color: 'white',
            fontFamily: 'Helvetica',
            fontSize: '52px',
            fontWeight: 'bold',
            x: '20%',
            y: '130px'
            },
            {
            text: 'Female',
            color: 'white',
            fontFamily: 'Helvetica',
            fontSize: '52px',
            fontWeight: 'bold',
            x: '60%',
            y: '130px'
            }
        ]
        },
        {
        type: 'pop-pyramid',
        backgroundColor: 'white',
        height: '90%',
        y: '10%',
        legend: {
            visible: false
        },
        options: {
            aspect: 'varea',
            labelPlacement: 'side',
            side2: {
            plotarea: {
                backgroundColor: '#D156BF'
            },
            source: {
                text: '',
                fontSize: '9px',
                fontWeight: 'none',
                x: '-10%',
                y: '95%'
            }
            }
        },
        plot: {
            stacked: true
        },
        plotarea: {
            marginTop: '10px',
            backgroundColor: '#05669D'
        },
        scaleX: {
            values: ['-180','180-190','190-200','200-210','210-220','220+'],
            guide: {
            alpha: 0.5,
            lineColor: 'white',
            lineStyle: 'solid',
            lineWidth: '2px'
            },
            item: {
            color: 'white',
            fontSize: '9px',
            offsetX: '38px',
            offsetY: '-8px',
            textAlign: 'middle'
            },
            itemsOverlap: true,
            tick: {
            visible: false
            }
        },
        scaleY: {
            values: '0:100:30',
            format: '%v%',
            guide: {
            visible: false
            },
            item: {
            color: 'white',
            fontSize: '9px',
            offsetY: '-20px',
            rules: [{
                rule: '%i == 4',
                visible: false
                },
                {
                rule: '%i == 0',
                visible: false
                }
            ]
            },
            lineColor: 'black',
            lineWidth: '1px',
            short: true,
            tick: {
            alpha: 0.5,
            lineColor: 'white',
            offsetY: '-10px'
            }
        },
        tooltip: {
            text: '%v%',
            backgroundColor: 'white',
            borderColor: '#05669D',
            borderRadius: '3px',
            borderWidth: '1px',
            color: '#05669D',
            shadow: false
        },
        series: [{
            values: d_h,
            alphaArea: 0.8,
            backgroundColor: 'white',
            dataSide: 1,
            lineColor: 'white',
            lineWidth: '1px',
            marker: {
                visible: false
            }
            },
            {
            values: d_m,
            alphaArea: 0.8,
            backgroundColor: 'white',
            dataSide: 2,
            lineColor: 'white',
            lineWidth: '1px',
            marker: {
                visible: false
            }
            }
        ]
        }
        ]
        };

        // RENDER CHARTS
        // -----------------------------
        zingchart.render({
        id: 'myChart',
        data: chartConfig
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

<div id="myChart"></div>
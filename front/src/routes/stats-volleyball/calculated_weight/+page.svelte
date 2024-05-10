<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://cdn.zingchart.com/zingchart.min.js"></script>

</svelte:head>

<script>

    let l_Hamwi=[];
    let l_Devine=[];
    let l_Miller=[];
    let l_Robinson=[];
    let l_Original=[];

    import {onMount} from "svelte";
    import {dev} from "$app/environment";

// https://rapidapi.com/malaaddincelik/api/fitness-calculator/

    //import {zingchart, ZC} from 'zingchart/es6';
    //import 'zingchart/modules-es6/zingchart-pareto.min.js';

    let DATAAPI = "/stats-volleyball/calculated_weight";
    if(dev){
        DATAAPI="http://localhost:10000/stats-volleyball/calculated_weight";
      }

    async function getData1(){
        try{
            const res = await fetch(DATAAPI);
            const data = await res.json();
            console.log(`Data received: ${JSON.stringify(data,null,2)}'`);
            return data; 
        } catch (error){
            console.log( `Error fetching data: ${error}`);
        } 
    }

    async function getDataAPIExterna(alt){

      const url = `https://fitness-calculator.p.rapidapi.com/idealweight?gender=female&height=${alt}`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '091e0bcec8msh63bb62660ef5b0cp134125jsn9307b8f17903',
          'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result.data)
        return result.data;
      } catch (error) {
        console.error(error);
      }

    }


    async function preparaChat(){

      let jugadoras_alt=await getData1();

      let s=[];
      
      let etiq=[];

      let alturas=[];

      let pesos=[];

      for(let a=0;a<jugadoras_alt.length;a++){
        let ja=jugadoras_alt[a];

        let n=ja["nombre"];
        etiq.push(n);

        let alt=ja["altura"];
        alturas.push(alt);

        pesos.push(ja["peso"]);
      }

      for(let i=0;i<alturas.length;i++){

        let l_alturas=await getDataAPIExterna(Number(alturas[i]));
        
        l_Original.push(pesos[i]);

        l_Hamwi.push(l_alturas["Hamwi"]);
        l_Devine.push(l_alturas["Devine"]);
        l_Robinson.push(l_alturas["Robinson"]);
        l_Miller.push(l_alturas["Miller"]);

      }

      s.push( {
            values: l_Original,
            text: 'Pesos originales',
          });
        
          s.push( {
            values: l_Hamwi,
            text: 'Pesos según Hamwi',
          });

          s.push( {
            values: l_Devine,
            text: 'Pesos según Devine',
          });

          s.push( {
            values: l_Robinson,
            text: 'Pesos según Robinson',
          });

          s.push( {
            values: l_Miller,
            text: 'Pesos según Miller',
          });


          fillChart3(etiq,s);

    }
        
    async function fillChart3(etiquetas,s){

      let myConfig = {
        type: 'bar',
        title: {
          text: 'Data Basics',
          fontSize: 24,
        },
        legend: {
          draggable: true,
        },
        scaleX: {
          // Set scale label
          label: { text: 'Jugadoras' },
          // Convert text on scale indices
          // nombre de las jugadoras
          labels: etiquetas
        },
        scaleY: {
          // Scale label with unicode character
          label: { text: 'Temperature (°F)' }
        },
        plot: {
          // Animation docs here:
          // https://www.zingchart.com/docs/tutorials/styling/animation#effect
          animation: {
            effect: 'ANIMATION_EXPAND_BOTTOM',
            method: 'ANIMATION_STRONG_EASE_OUT',
            sequence: 'ANIMATION_BY_NODE',
            speed: 275,
          }
        },

        //Series que me haga la función
        series: s
        // [
        //   {
        //     // plot 1 values, linear data
        //     values: [23,20,27,29,25,17,15],
        //     text: 'Week 1',
        //   },
        //   {
        //     // plot 2 values, linear data
        //     values: [35,42,33,49,35,47,35],
        //     text: 'Week 2'
        //   },
        //   {
        //     // plot 2 values, linear data
        //     values: [15,22,13,33,44,27,31],
        //     text: 'Week 3'
        //   },
        //   {
        //     // plot 2 values, linear data
        //     values: [15,22,13,33,44,27,31],
        //     text: 'Week 4'
        //   },
        //   {
        //     // plot 2 values, linear data
        //     values: [15,22,13,33,44,27,31],
        //     text: 'Week 5'
        //   }
        // ]
      };

      zingchart.render({
        id: 'myChart',
        data: myConfig,
      });

    }



    onMount(()=>{
      preparaChat();
      //getDataAPIExterna(189);
    })


</script>


<div id="myChart" class="chart--container">
    <a href="https://www.zingchart.com/" rel="noopener" class="zc-ref">Powered by ZingChart</a>
  </div>


  <div id="myChart2" class="chart--container">
    <a href="https://www.zingchart.com/" rel="noopener" class="zc-ref">Powered by ZingChart</a>
  </div>
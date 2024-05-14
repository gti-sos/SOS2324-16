import express from "express";
import bodyParser from "body-parser";
import dataStore from "nedb";
import cors from "cors";
import request from "request";
//Svelte
import {handler} from "./front/build/handler.js";

import {loadBackendPRR} from './api/apiPRR/apiPRR-v2.js';
import {loadBackendPSS} from './api/apiPSS/apiPSS-v2.js';
import {loadBackendDMC} from './api/apiDMC/apiDMC-v2.js';

let app = express();
app.use(cors());

//creacion de bases de datos
let dbRugby = new dataStore();
let dbVolleyball = new dataStore();
let dbFootball = new dataStore();

//Variables constantes
const PORT = (process.env.PORT || 10000);
const API_BASE_v2 = "/api/v2";
const API_BASE_v1 = "/api/v1";

app.use(bodyParser.json());

//Recurso html principal
// app.use("/", express.static("./public"));

// //Redireccionamientos a documentos de postman
app.get(API_BASE_v1+"/stats-rugby/docs", (req,res) => {
    res.redirect('https://documenter.getpostman.com/view/32964665/2sA2xh2YTp');
});
app.get(API_BASE_v2+"/stats-rugby/docs", (req,res) => {
    res.redirect('https://documenter.getpostman.com/view/32964665/2sA35Eb3QP');
});
app.get(API_BASE_v1+"/stats-football/docs", (req,res) => {
    res.redirect('https://documenter.getpostman.com/view/32965495/2sA2xh2sVA');
});
app.get(API_BASE_v2+"/stats-football/docs", (req,res) => {
    res.redirect('https://documenter.getpostman.com/view/32966846/2sA35Eb3nQ');
});
app.get(API_BASE_v1+"/stats-volleyball/docs", (req,res) => {
    res.redirect('https://documenter.getpostman.com/view/32966846/2sA2xh2sVB');
});
app.get(API_BASE_v2+"/stats-volleyball/docs", (req,res) => {
    res.redirect('https://documenter.getpostman.com/view/32966846/2sA35Eb3nS');
});

//Llamar a la api de Pablo Rivas
loadBackendPRR(app, dbRugby);
//Llamar a la api de Pablo Suárez
loadBackendPSS(app, dbFootball);
//Llamar a la api de Domingo Morales
loadBackendDMC(app, dbVolleyball);

//Proxy

app.use("/DMC/proxy", async function(req, res) {
    
    const url = `https://the-vegan-recipes-db.p.rapidapi.com/`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'ae855ceae1msh2840b2c00787f80p198e0bjsnbf6b6ed1fe06',
            'X-RapidAPI-Host': 'the-vegan-recipes-db.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        res.json(result.slice(0,20)) ;
    } catch (error) {
        console.error(error);
    }

});

app.use("/PRR/proxy/:user", async function(req, res) {
    
    const { user } = req.params;
    const url = `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${user}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'ca542eb6dbmsha5edf4ea0fd0f32p146eb2jsn67517c3e59d5',
            'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        res.send(result);
    } catch (error) {
        console.error(error);
    }

});

app.use("/PSS/proxy", async function(req, res) {
    const url = 'https://maps-data.p.rapidapi.com/photos.php?business_id=0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0&lang=en&country=us';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'b0f281d7f3msh13de4455d1b8a25p1c2a06jsn2bd53ab1a197',
            'X-RapidAPI-Host': 'maps-data.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const lugar = await result.data;
        res.json(lugar);
    } catch (error) {
        console.error(error);
    }

});

app.use("/PRR/proxy/:user", async function(req, res) {
    
    const { user } = req.params;
    const url = `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${user}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'ca542eb6dbmsha5edf4ea0fd0f32p146eb2jsn67517c3e59d5',
            'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        res.send(result);
    } catch (error) {
        console.error(error);
    }

});

app.use(handler);


//Iniciar servicio
app.listen(PORT,() =>{
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`API Pablo Rivas on http://localhost:${PORT + API_BASE_v2}/stats-rugby`);
    console.log(`API Pablo Suárez on http://localhost:${PORT + API_BASE_v2}/stats-football`);
    console.log(`API Domingo Morales on http://localhost:${PORT + API_BASE_v2}/stats-volleyball`);
});
console.log(`Server initializing...`);
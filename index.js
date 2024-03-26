// let express = require("express");
// let bodyParser = require("body-parser");
// let dataStore = require("nedb");
import express from "express";
import bodyParser from "body-parser";
import dataStore from "nedb";
import cors from "cors";
//Svelte
import {handler} from "./front/build/handler.js";

// let apiPRR = require('./api/apiPRR/apiPRR');
// let apiPSS = require('./api/apiPSS/apiPSS');
// let apiDMC = require('./api/apiDMC/apiDMC');
import {loadBackendPRR} from './api/apiPRR/apiPRR.js';
import {loadBackendPSS} from './api/apiPSS/apiPSS.js';
import {loadBackendDMC} from './api/apiDMC/apiDMC.js';

let app = express();
app.use(cors());

//creacion de bases de datos
let dbRugby = new dataStore();
let dbVolleyball = new dataStore();
let dbFootball = new dataStore();

//Variables constantes
const PORT = (process.env.PORT || 10000);
const API_BASE = "/api/v2";

app.use(bodyParser.json());

//Recurso html principal
// app.use("/", express.static("./public"));

// //Redireccionamientos a documentos de postman
// app.get(API_BASE+"/stats-rugby/docs", (req,res) => {
//     res.redirect('https://documenter.getpostman.com/view/32964665/2sA2xh2YTp');
// });
// app.get(API_BASE+"/stats-football/docs", (req,res) => {
//     res.redirect('https://documenter.getpostman.com/view/32965495/2sA2xh2sVA');
// });
// app.get(API_BASE+"/stats-volleyball/docs", (req,res) => {
//     res.redirect('https://documenter.getpostman.com/view/32966846/2sA2xh2sVB');
// });

//Llamar a la api de Pablo Rivas
loadBackendPRR(app, dbRugby);
//Llamar a la api de Pablo Suárez
loadBackendPSS(app, dbFootball);
//Llamar a la api de Domingo Morales
loadBackendDMC(app, dbVolleyball);

app.use(handler);


//Iniciar servicio
app.listen(PORT,() =>{
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`API Pablo Rivas on http://localhost:${PORT + API_BASE}/stats-rugby`);
    console.log(`API Pablo Suárez on http://localhost:${PORT + API_BASE}/stats-football`);
    console.log(`API Domingo Morales on http://localhost:${PORT + API_BASE}/stats-volleyball`);
});
console.log(`Server initializing...`);
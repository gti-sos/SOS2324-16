let express = require("express");
let bodyParser = require("body-parser");
let dataStore = require("nedb");

let apiPRR = require('./api/apiPRR/apiPRR');
let apiPSS = require('./api/apiPSS/apiPSS');
let apiDMC = require('./api/apiDMC/apiDMC');

let app = express();

//creacion de bases de datos
let dbRugby = new dataStore();
let dbVolleyball = new dataStore();
let dbFootball = new dataStore();

//Variables constantes
const PORT = (process.env.PORT || 10000);
const API_BASE = "/api/v1";

app.use(bodyParser.json());

//Recurso html principal
app.use("/", express.static("./public"));

//Redireccionamientos a documentos de postman
app.get(API_BASE+"/stats-rugby/docs", (req,res) => {
    res.redirect('https://documenter.getpostman.com/view/32964665/2sA2xh2YTp');
});
app.get(API_BASE+"/stats-football/docs", (req,res) => {
    res.redirect('https://documenter.getpostman.com/view/32965495/2sA2xh2sVA');
});
app.get(API_BASE+"/stats-volleyball/docs", (req,res) => {
    res.redirect('https://documenter.getpostman.com/view/32966846/2sA2xh2sVB');
});

//Llamar a la api de Pablo Rivas
apiPRR(app, dbRugby);
//Llamar a la api de Pablo Suárez
apiPSS(app, dbFootball);
//Llamar a la api de Domingo Morales
apiDMC(app, dbVolleyball);


//Iniciar servicio
app.listen(PORT,() =>{
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`API Pablo Rivas on http://localhost:${PORT + API_BASE}/stats-rugby`);
    console.log(`API Pablo Suárez on http://localhost:${PORT + API_BASE}/stats-football`);
    console.log(`API Domingo Morales on http://localhost:${PORT + API_BASE}/stats-volleyball`);
});
console.log(`Server initializing...`);
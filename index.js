let cool = require("cool-ascii-faces");
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

//Recurso dinámico /cool
app.get("/cool", (req,res) => {
    res.send(`<html><body><h1>${cool()}</html></body></h1>`);
});

//Recurso para /samples
app.get("/samples/PSS", (req,res) => {
    res.send(`<html><body><h1> ${PSS.calcularMediaEdadPorNacionalidades(PSS.jugadores)}  </h1></body></html>`)
});
app.get("/samples/PRR", (req,res) => {
    res.send(`<html><body><h1> ${PRR.mediaPesoPorPais(PRR.array, "Argentina")}  </h1></body></html>`)
});
app.get("/samples/DMC",(req,res)=>{
    res.send(`<html><body><h1> ${DMC.todosPaises(DMC.datos)}  </h1></body></html>`)
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
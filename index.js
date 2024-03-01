let cool = require("cool-ascii-faces");
let express = require("express");
let bodyParser = require("body-parser");
let dataStore = require("nedb");

let PSS = require('./index-PSS');
let DMC = require('./index-DMC');

let apiPRR = require('./api/apiPablo');

let app = express();

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

//llamar a la api pablo
apiPRR(app, dbRugby);


//Recurso para /api de PABLO SUÁREZ
app.get(API_BASE+"/stats-football", (req,res) => {
    res.send(JSON.stringify(PSS.jugadores));
});
app.post(API_BASE+"/stats-football", (req,res) => {
    let stat = req.body;
    PSS.jugadores.push(stat);
    res.sendStatus(201, "Created");
})

//Recurso para /api de DOMINGO MORALES
app.get(API_BASE+"/stats-volleyball", (req,res) => {
    res.send(JSON.stringify(DMC.datos));
});
app.post(API_BASE+"/stats-volleyball", (req,res) => {
    let stat = req.body;
    DMC.datos.push(stat);
    res.sendStatus(201, "Created");
})

//Iniciar servicio
app.listen(PORT,() =>{
    console.log(`Server listening on port ${PORT}. http://localhost:${PORT}`);
});
console.log(`Server initializing...`);
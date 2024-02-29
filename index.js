let cool = require("cool-ascii-faces");
let express = require("express");
let bodyParser = require("body-parser");

let PSS = require('./index-PSS');
let PRR = require('./index-PRR');
let DMC = require('./index-DMC');

let app = express();

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

//Recurso para /api de PABLO RIVAS jaja brr 
app.get(API_BASE+"/stats-rugby", (req,res) => {
    res.send(JSON.stringify(PRR.array));
});
app.post(API_BASE+"/stats-rugby", (req,res) => {
    let stat = req.body;
    if(PRR.array.includes === stat){
        res.sendStatus(409, "Conflict");
    }else if(stat){
        PRR.array.push(stat);
        res.sendStatus(201, "Created");
    }else{
        res.sendStatus(400, "Bad request");
    }
})
app.delete(API_BASE+"/stats-rugby", (req,res) => {
    PRR.array.splice(0,PRR.array.length);
    res.sendStatus(200, "OK");
})
app.put(API_BASE+"/stats-rugby", (req,res) => {
    res.sendStatus(405, "Method Not Allowed");
})

app.get(API_BASE+"/stats-rugby/loadInitialData", (req,res) => {
    if(PRR.array.length === 0){
        PRR.array.push(PRR.array);
    }
    res.sendStatus(201, "Array created");
});

// app.get(API_BASE+"/stats-rugby/:id", (req,res) => {
//     const parametro = req.params.id;
//     const playerData = PRR.array.find(x => x.bplace === parametro);
//     if (playerData) {
//         res.send(JSON.stringify(playerData)); 
//     } else {
//         res.sendStatus(404, "Player not found");
//     }
// });





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
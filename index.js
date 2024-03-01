let cool = require("cool-ascii-faces");
let express = require("express");
let bodyParser = require("body-parser");
let dataStore = require("nedb");

let PSS = require('./index-PSS');
let PRR = require('./index-PRR');
let DMC = require('./index-DMC');

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

//Recurso para /api de PABLO RIVAS 
app.get(API_BASE+"/stats-rugby/loadInitialData", (req,res) => {
    dbRugby.find({}, (err, doc) => {
        if(err){
            res.sendStatus(500, "Internal Error");
        }else {
            if (docs.length === 0) {
                dbRugby.insert(PRR.array);
                res.sendStatus(201, "Array created");
            } else{
                res.sendStatus(409, "Conflict");
            }
        }
    });
});
app.get(API_BASE+"/stats-rugby", (req,res) => {
    dbRugby.find({}, (err,info) => {
        if(err){
            res.sendStatus(500,"Internal Error");
        }else{
            res.send(JSON.stringify(info.map((c)=> {
                delete c._id;
                return c;
            })));
        }
    });
});
app.post(API_BASE+"/stats-rugby", (req,res) => {
    let stat=req.body;
    dbRugby.insert(stat);
    res.sendStatus(201,"Created");
});
app.put(API_BASE+"/stats-rugby", (req,res) => {
    res.sendStatus(405, "Method Not Allowed");
});
app.delete(API_BASE+"/stats-rugby", (req,res) => {
    dbRugby.remove({},{ multi: true},(err,numRemoved) => {
        if(err){
            res.sendStatus(500,"Internal Error");
        }else{
            if(numRemoved>=1){
                res.sendStatus(200,"All removed");
            }else{
                res.sendStatus(404,"Not found");
            }
        }
    })
});

app.get(API_BASE+"/stats-rugby/:name", (req,res) => {
    let name=req.params.name;
    dbRugby.find({"name":name}, (err,info) => {
        if(err){
            res.sendStatus(404,"Not Found");
        }else{
            res.send(JSON.stringify(info));
        }
    });
});

app.delete(API_BASE+"/stats-rugby/:name", (req,res) => {
    let name=req.params.name;
    dbRugby.remove( {"name":name},{},(err,numRemoved)=>{
    if(err){
        res.sendStatus(500,"Internal Error");
    }else{
        if(numRemoved>=1){
            res.sendStatus(200,"Removed");
        }else{
            res.sendStatus(404,"Not found");
        }
    }
    });
});


app.get(API_BASE+"/stats-rugby/loadInitialData", (req,res) => {
    if(PRR.array.length === 0){
        PRR.array.push(PRR.array);
    }
    res.sendStatus(201, "Array created");
});



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
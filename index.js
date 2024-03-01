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
    dbRugby.find({}, (err, docs) => {
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

app.get(API_BASE+"/stats-rugby/:first", (req,res) => {
    let first=req.params.first;
    dbRugby.find({"first":first}, (err,info) => {
        if(err){
            res.sendStatus(404,"Not Found");
        }else{
            res.send(JSON.stringify(info.map((c)=> {
                delete c._id;
                return c;
            })));
        }
    });
});

app.post(API_BASE+"/stats-rugby/:first", (req,res) => {
    res.sendStatus(405, "Method Not Allowed");
});

app.put(API_BASE+"/stats-rugby/:first", (req,res) => {
    let first  = req.params.first;
    const nuevo = req.body;

    dbRugby.update({"first":first},{$set: nuevo},(err,numUpdated)=>{
        if (err) {
            res.sendStatus(500, "Internal Error");
        } else {
            if (numUpdated === 0) {
                res.sendStatus(404, "Not found");
            } else {
                res.sendStatus(200, "Ok");
            }
        }
    });
});

app.delete(API_BASE+"/stats-rugby/:first", (req,res) => {
    let first=req.params.first;
    dbRugby.remove( {"first":first},{},(err,numRemoved)=>{
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



//Recurso para /api de PABLO SUÁREZ
app.get(API_BASE+"/stats-football/loadInitialData", (req,res) => {
    dbFootball.find({}, (err, docs) => {
        if(err){
            res.sendStatus(500, "Internal Error");
        }else {
            if (docs.length === 0) {
                dbFootball.insert(PSS.jugadores);
                res.sendStatus(201, "Created");
            } else{
                res.sendStatus(409, "Conflict");
            }
        }
    });
});

app.get(API_BASE+"/stats-football", (req,res) => {
    dbFootball.find({}, (err,info) => {
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

app.post(API_BASE+"/stats-football", (req,res) => {
    let stat=req.body;
    dbFootball.insert(stat);
    res.sendStatus(201,"Created");
});

app.put(API_BASE+"/stats-football", (req,res) => {
    res.sendStatus(405, "Method Not Allowed");
});

app.delete(API_BASE+"/stats-football", (req,res) => {
    dbFootball.remove({},{ multi: true },(err,numRemoved) => {
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

app.get(API_BASE+"/stats-football/:short_name", (req,res) => {
    let short_name=req.params.short_name;
    dbFootball.find({"short_name":short_name}, (err,info) => {
        if(err){
            res.sendStatus(404,"Not Found");
        }else{
            res.send(JSON.stringify(info.map((c)=> {
                delete c._id;
                return c;
            })));
        }
    });
});

app.post(API_BASE+"/stats-football/:short_name", (req,res) => {
    res.sendStatus(405, "Method Not Allowed");
});

app.put(API_BASE+"/stats-football/:short_name", (req,res) => {
    let short_name  = req.params.short_name;
    const nuevo = req.body;

    dbFootball.update({"short_name":short_name},{$set: nuevo},(err,numUpdated)=>{
        if (err) {
            res.sendStatus(500, "Internal Error");
        } else {
            if (numUpdated === 0) {
                res.sendStatus(404, "Not found");
            } else {
                res.sendStatus(200, "Ok");
            }
        }
    });
});

app.delete(API_BASE+"/stats-football/:short_name", (req,res) => {
    let short_name=req.params.short_name;
    dbFootball.remove( {"short_name":short_name},{},(err,numRemoved)=>{
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

//Recurso para /api de DOMINGO MORALES
app.get(API_BASE+"/stats-volleyball/loadInitialData", (req,res) => {
    dbVolleyball.find({}, (err, docs) => {
        if(err){
            res.sendStatus(500, "Internal Error");
        }else {
            if (docs.length === 0) {
                dbVolleyball.insert(DMC.datos);
                res.sendStatus(201, "Created");
            } else{
                res.sendStatus(409, "Conflict");
            }
        }
    });
});

app.get(API_BASE+"/stats-volleyball", (req,res) => {
    dbVolleyball.find({}, (err,info) => {
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

app.post(API_BASE+"/stats-volleyball", (req,res) => {
    let stat=req.body;
    dbVolleyball.insert(stat);
    res.sendStatus(201,"Created");
});

app.put(API_BASE+"/stats-volleyball", (req,res) => {
    res.sendStatus(405, "Method Not Allowed");
});

app.delete(API_BASE+"/stats-volleyball", (req,res) => {
    dbVolleyball.remove({},{ multi: true},(err,numRemoved) => {
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

app.get(API_BASE+"/stats-volleyball/:name", (req,res) => {
    let name=req.params.name;
    dbVolleyball.find({"name":name}, (err,info) => {
        if(err){
            res.sendStatus(404,"Not Found");
        }else{
            res.send(JSON.stringify(info.map((c)=> {
                delete c._id;
                return c;
            })));
        }
    });
});

app.post(API_BASE+"/stats-volleyball/:name", (req,res) => {
    res.sendStatus(405, "Method Not Allowed");
});

app.put(API_BASE+"/stats-volleyball/:name", (req,res) => {
    let name  = req.params.name;
    const nuevo = req.body;

    dbVolleyball.update({"name":name},{$set: nuevo},(err,numUpdated)=>{
        if (err) {
            res.sendStatus(500, "Internal Error");
        } else {
            if (numUpdated === 0) {
                res.sendStatus(404, "Not found");
            } else {
                res.sendStatus(200, "Ok");
            }
        }
    });
});

app.delete(API_BASE+"/stats-volleyball/:name", (req,res) => {
    let name=req.params.name;
    dbVolleyball.remove( {"name":name},{},(err,numRemoved)=>{
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

//Iniciar servicio
app.listen(PORT,() =>{
    console.log(`Server listening on port ${PORT}. http://localhost:${PORT}`);
});
console.log(`Server initializing...`);
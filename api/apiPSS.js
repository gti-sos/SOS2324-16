let PSS = require('../index-PSS');

const API_BASE = "/api/v1";

//funcion pa validar si los campos son correctos
function validarDatos(req, res, next) {
    const jsonRecibido = req.body;
  
    const esquemaEsperado = {
        'short_name': 'string', 
        'long_name': 'string', 
        'age': 'number', 
        'dob': 'string', 
        'height_cm': 'number', 
        'weight_kg': 'number', 
        'nationality': 'string', 
        'club': 'string', 
        'preferred_foot': 'string', 
        'team_position': 'string'
    };

    const keysRecibidas = Object.keys(jsonRecibido);
    const keysEsperadas = Object.keys(esquemaEsperado);
    const keysFaltantes = keysEsperadas.filter(key => !keysRecibidas.includes(key));
    
    //comprueba q no haya claves de mas
    const clavesExtra = keysRecibidas.filter(key => !keysEsperadas.includes(key));
    if (clavesExtra.length > 0) {
        console.error(`Se encontraron claves adicionales en el JSON: ${clavesExtra.join(', ')}`);
        return res.sendStatus(400, "Bad request");
    }

    //comprueba q no haya claves de menos
    if (keysFaltantes.length > 0) {
        console.error(`Faltan las siguientes claves en el JSON: ${keysFaltantes.join(', ')}` );
        return res.sendStatus(400, "Bad request");
    }

    //comprueba q sean los tipos q son
    const erroresTipo = [];
    keysEsperadas.forEach(key => {
        const tipoEsperado = esquemaEsperado[key];
        const valor = jsonRecibido[key];
        if (typeof valor !== tipoEsperado) {
            erroresTipo.push(`El valor de '${key}' debe ser de tipo '${tipoEsperado}'`);
        }
    });
    if (erroresTipo.length > 0) {
        console.error(`Errores de tipo: ${erroresTipo.join(', ')}`);
        return res.sendStatus(400, "Bad request");
    }

    next();
}

module.exports = (app,dbFootball) => {
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

app.post(API_BASE+"/stats-football", validarDatos, (req,res) => {
    let stat=req.body;
    dbFootball.insert(stat, (err,info) => {
        if(err){
            res.sendStatus(500,"Internal Error");
        }else{
            res.sendStatus(201,"Created");
        }
    });
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
            res.sendStatus(400, "Bad request");
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
}
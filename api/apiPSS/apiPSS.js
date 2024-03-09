let PSS = require('./jugadores');

const API_BASE = "/api/v1";

//Función para validar si los campos son correctos
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
    
    //Comprueba que no haya claves de más
    const clavesExtra = keysRecibidas.filter(key => !keysEsperadas.includes(key));
    if (clavesExtra.length > 0) {
        console.error(`Se encontraron claves adicionales en el JSON: ${clavesExtra.join(', ')}`);
        return res.sendStatus(400, "Bad request");
    }

    //Comprueba que no haya claves de menos
    if (keysFaltantes.length > 0) {
        console.error(`Faltan las siguientes claves en el JSON: ${keysFaltantes.join(', ')}` );
        return res.sendStatus(400, "Bad request");
    }

    //Comprueba q sean los tipos q son
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

app.get(API_BASE+'/stats-football', (req, res) => {
    let peticion = req.query;

    const from = Number(req.query.from);
    const to = Number(req.query.to);

    if (Object.keys(peticion).length===0) {
        dbFootball.find( {} ,(err,info)=> {
                    if(err){
                        res.sendStatus(500,"Internal Error");
                    }else{
                        res.send(JSON.stringify(info.map((c)=> {
                            delete c._id;
                            return c;
                        })));
                    }
                });
    }else if(from>0 && to >0 && from<to){

        dbFootball.find( {"dob": { $gte:new Date(from+"-01-01"), $lte:new Date(to+"-12-31") } } ,(err,info)=> {
            if(err){
                res.sendStatus(500,"Internal Error");
            }else{
                res.send(JSON.stringify(info.map((c)=> {
                    delete c._id;
                    return c;
                })));
            }
        });
    }else{

        let valor=Object.values(peticion)[0];
        let clave=Object.keys(peticion)[0];
        let cond={}
        
        if ((typeof PSS.jugadores[0][clave])==="number"){
            valor=Number(valor);

            cond[clave]=valor;
        
            dbFootball.find(cond, (err, info) => {
                if (err) {
                    res.sendStatus(500,'Error interno del servidor' );
                 }else {
                    res.send(JSON.stringify(info.map((c)=> {
                    delete c._id;
                 return c;
            })));
        }
        }); 
        }else if( (typeof PSS.jugadores[0][clave])==="object" ){

            valor=Number(valor);        

            dbFootball.find({"dob":{ $gte:new Date(valor+"-01-01"), $lte:new Date(valor+"-12-31") }}, (err, info) => {
                if (err) {
                    res.sendStatus(500,'Error interno del servidor');
                 }else {
                    res.send(JSON.stringify(info.map((c)=> {
                    delete c._id;
                 return c;
            })));
        }
        });
        }else{
            cond[clave]=valor;
        
            dbFootball.find(cond, (err, info) => {
                if (err) {
                    res.sendStatus(500,'Error interno del servidor' );
                 }else {
                    res.send(JSON.stringify(info.map((c)=> {
                    delete c._id;
                 return c;
            })));
        }
        }); 
        }
    }
  });

  app.post(API_BASE+"/stats-football", validarDatos, (req,res) => {
    let stat=req.body;
    dbFootball.find(stat, (err,info) => {
        if(err){
            res.sendStatus(500,"Internal Error");
        }else{
            if(info.length===0){
                dbFootball.insert(stat, (err,info) => {
                    if(err){
                        res.sendStatus(500,"Internal Error");
                    }else{
                        res.sendStatus(201,"Created");
                    }
                });
            }else{
                res.sendStatus(409,"Conflict");
            }     
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

app.get(API_BASE+"/stats-football/:nationality", (req,res) => {
    let nationality=req.params.nationality;
    let peticion=req.query;

    const from = Number(req.query.from);
    const to = Number(req.query.to);

    if (Object.keys(peticion).length===0) {
        dbFootball.find( {"nationality":nationality} ,(err,info)=> {
                    if(err){
                        res.sendStatus(500,"Internal Error");
                    }else{
                        res.send(JSON.stringify(info.map((c)=> {
                            delete c._id;
                            return c;
        
                        })));
                    }
                });
    }else if(from>0 && to >0 && from<to){

        dbFootball.find( {"nationality":nationality,"dob": { $gte:new Date(from+"-01-01"), $lte:new Date(to+"-12-31") } } ,(err,info)=> {
            if(err){
                res.sendStatus(500,"Internal Error");
            }else{
                res.send(JSON.stringify(info.map((c)=> {
                    delete c._id;
                    return c;

                })));
            }
        });
    }else{
            let valor=Object.values(peticion)[0];
            let clave=Object.keys(peticion)[0];
            let cond={}
            
            if ((typeof PSS.jugadores[0][clave])==="number"){
                valor=Number(valor);

                cond["nationality"]=nationality;
                cond[clave]=valor;
            
                dbFootball.find(cond, (err, info) => {
                    if (err) {
                        res.sendStatus(500,'Error interno del servidor' );
                     }else {
                        res.send(JSON.stringify(info.map((c)=> {
                        delete c._id;
                     return c;
                })));
            }
            }); 
            }else if( (typeof PSS.jugadores[0][clave])==="object" ){
    
                valor=Number(valor);        
    
                dbFootball.find({"nationality":nationality,"dob":{ $gte:new Date(valor+"-01-01"), $lte:new Date(valor+"-12-31") }}, (err, info) => {
                    if (err) {
                        res.sendStatus(500,'Error interno del servidor' );
                     }else {
                        res.send(JSON.stringify(info.map((c)=> {
                        delete c._id;
                     return c;
                })));
            }
            });
            }else{
                
                cond["nationality"]=nationality;
                cond[clave]=valor;
            
                dbFootball.find(cond, (err, info) => {
                    if (err) {
                        res.sendStatus(500,'Error interno del servidor' );
                     }else {
                        res.send(JSON.stringify(info.map((c)=> {
                        delete c._id;
                     return c;
                }))); 
            }
            }); 
            }
        }
});

app.post(API_BASE+"/stats-football/:nationality", (req,res) => {
    res.sendStatus(405, "Method Not Allowed");
});

app.put(API_BASE+"/stats-football/:nationality", (req,res) => {
    let nationality  = req.params.nationality;
    const nuevo = req.body;

    dbFootball.update({"nationality":nationality},{$set: nuevo},(err,numUpdated)=>{
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

app.delete(API_BASE+"/stats-football/:nationality", (req,res) => {
    let nationality=req.params.nationality;
    dbFootball.remove( {"nationality":nationality},{ multi: true },(err,numRemoved)=>{
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

app.get(API_BASE+"/stats-football/:nationality/:height_cm", (req,res) => {
    let nationality=req.params.nationality;
    let height_cm=req.params.height_cm;
    dbFootball.find({"nationality":nationality, "height_cm":Number(height_cm)}, (err,info) => {
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

app.put(API_BASE+"/stats-football/:nationality/:height_cm", (req,res) => {
    let nationality=req.params.nationality;
    let height_cm=req.params.height_cm;
    const nuevo=req.body;

    dbFootball.update({"nationality":nationality,"height_cm":Number(height_cm)},{$set: nuevo},(err,numUpdated)=>{
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
}
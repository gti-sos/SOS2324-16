let PRR = require('../index-PRR');

const API_BASE = "/api/v1";

//funcion pa validar si los campos son correctos
function validarDatos(req, res, next) {
    const jsonRecibido = req.body;
  
    const esquemaEsperado = {
        "team": 'string',
        "plabel": 'string',
        "age": 'number',
        "height": 'number',
        "weight": 'number',
        "bplace": 'string',
        "bdate": 'string',
        "last": 'string',
        "first": 'string',
        "caps": 'number'
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

module.exports = (app,dbRugby) => {
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
    // app.get(API_BASE+"/stats-rugby", (req,res) => {
    //     dbRugby.find({}, (err,info) => {
    //         if(err){
    //             res.sendStatus(500,"Internal Error");
    //         }else{
    //             res.send(JSON.stringify(info.map((c)=> {
    //                 delete c._id;
    //                 return c;
    //             })));
    //         }
    //     });
    // });
    app.get(API_BASE+'/stats-rugby', (req, res) => {
        let peticion = req.query; 
        const from = Number(req.query.from);
        const to = Number(req.query.to);
        if (Object.keys(peticion).length===0) {
            dbRugby.find( {} ,(err,info)=> {
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
            dbRugby.find( {"bdate": { $gte:new Date(from+"-01-01"), $lte:new Date(to+"-12-31") } } ,(err,info)=> {
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
            
            if ((typeof PRR.array[0][clave])==="number"){
                valor=Number(valor);
                cond[clave]=valor;
                dbRugby.find(cond, (err, info) => {
                    if (err) {
                        res.sendStatus(500,'Error interno del servidor' );
                     }else {
                        res.send(JSON.stringify(info.map((c)=> {
                        delete c._id;
                     return c;
                })));
    
            }
            }); 
    
    
            }else if( (typeof PRR.array[0][clave])==="object" ){
    
                valor=Number(valor);        
    
                dbRugby.find({"bdate":{ $gte:new Date(valor+"-01-01"), $lte:new Date(valor+"-12-31") }}, (err, info) => {
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
                cond[clave]=valor;
            
    
                dbRugby.find(cond, (err, info) => {
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
    
    app.post(API_BASE+"/stats-rugby", validarDatos, (req,res) => {
        let stat=req.body;
        dbRugby.insert(stat, (err,info) => {
            if(err){
                res.sendStatus(500,"Internal Error");
            }else{
                res.sendStatus(201,"Created");
            }
        });
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
    
    //con parámetros
    // app.get(API_BASE+"/stats-rugby/:name", (req,res) => {
    //     let name=req.params.name;
    //     dbRugby.find({"first":name}, (err,info) => {
    //         if(err){
    //             res.sendStatus(404,"Not Found");
    //         }else{
    //             res.send(JSON.stringify(info.map((c)=> {
    //                 delete c._id;
    //                 return c;
    //             })));
    //         }
    //     });
    // });
    app.get(API_BASE+"/stats-rugby/:nationality", (req,res) => {
        let nationality=req.params.nationality;
        let peticion=req.query;
    
        const from = Number(req.query.from);
        const to = Number(req.query.to);
    
        if (Object.keys(peticion).length===0) {
            dbRugby.find( {"bplace":nationality} ,(err,info)=> {
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
            dbRugby.find( {"bplace":nationality,"bdate": { $gte:new Date(from+"-01-01"), $lte:new Date(to+"-12-31") } } ,(err,info)=> {
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
                
                if ((typeof PRR.array[0][clave])==="number"){
                    valor=Number(valor);
    
                    cond["bplace"]=nationality;
                    cond[clave]=valor;
                
                    dbRugby.find(cond, (err, info) => {
                        if (err) {
                            res.sendStatus(500,'Error interno del servidor' );
                         }else {
                            res.send(JSON.stringify(info.map((c)=> {
                            delete c._id;
                         return c;
                    })));
        
                }
                }); 
        
        
                }else if( (typeof PRR.array[0][clave])==="object" ){
        
                    valor=Number(valor);        
        
                    dbRugby.find({"bplace":nationality,"bdate":{ $gte:new Date(valor+"-01-01"), $lte:new Date(valor+"-12-31") }}, (err, info) => {
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
                    
                    cond["bplace"]=nationality;
                    cond[clave]=valor;
                
                    dbRugby.find(cond, (err, info) => {
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
    app.post(API_BASE+"/stats-rugby/:name", (req,res) => {
        res.sendStatus(405, "Method Not Allowed");
    });
    
    app.put(API_BASE+"/stats-rugby/:name", (req,res) => {
        let name  = req.params.name;
        const nuevo = req.body;
        dbRugby.update({"first":name},{$set: nuevo},(err,info)=>{
            if (err) {
                res.sendStatus(400, "Bad Request");
            } else {
                if (numUpdated === 0) {
                    res.sendStatus(404, "Not found");
                } else {
                    res.sendStatus(200, "Ok");
                }
            }
        });
        
    });
    app.delete(API_BASE+"/stats-rugby/:name", (req,res) => {
        let name=req.params.name;
        dbRugby.remove( {"first":name},{},(err,numRemoved)=>{
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


app.get(API_BASE+"/stats-rugby/:nationality/:weight", (req,res) => {
    let nationality=req.params.nationality;
    let weight=req.params.weight;
    dbRugby.find({"bplace":nationality, "weight":Number(weight)}, (err,info) => {
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

app.put(API_BASE+"/stats-rugby/:nationality/:weight", (req,res) => {
    let nationality=req.params.nationality;
    let weight=req.params.weight;
    const nuevo=req.body;

    dbRugby.update({"bplace":nationality,"weight":Number(weight)},{$set: nuevo},(err,numUpdated)=>{
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
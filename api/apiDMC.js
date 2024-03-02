let DMC = require('../index-DMC');

const API_BASE = "/api/v1";

//funcion pa validar si los campos son correctos
function validarDatos(req, res, next) {
    const jsonRecibido = req.body;
  
    const esquemaEsperado = {
        'name':'string',
        'ranking':'number',
        'nationality':'string',
        'position':'string',
        'birthdate':'string',
        'height':'number',
        'weight':'number',
        'dominant_hand':'string',
        'country_point':'number',
        'point':'number'
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

module.exports = (app,dbVolleyball) => {
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



app.get(API_BASE+'/stats-volleyball', (req, res) => {
    let peticion = req.query; // Obtiene el valor del parámetro de la provincia

    const from = Number(req.query.from);
    const to = Number(req.query.to);

    if (Object.keys(peticion).length===0) {
        dbVolleyball.find( {} ,(err,info)=> {
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
        dbVolleyball.find( {"birthdate": { $gte:new Date(from+"-01-01"), $lte:new Date(to+"-12-31") } } ,(err,info)=> {
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
        
        if ((typeof DMC.datos[0][clave])==="number"){
            valor=Number(valor);

            cond[clave]=valor;
        

            dbVolleyball.find(cond, (err, info) => {
                if (err) {
                    res.sendStatus(500,'Error interno del servidor' );
                 }else {
                    res.send(JSON.stringify(info.map((c)=> {
                    delete c._id;
                 return c;
            })));

        }
        }); 


        }else if( (typeof DMC.datos[0][clave])==="object" ){

            valor=Number(valor);        

            dbVolleyball.find({"birthdate":{ $gte:new Date(valor+"-01-01"), $lte:new Date(valor+"-12-31") }}, (err, info) => {
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
        

            dbVolleyball.find(cond, (err, info) => {
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

app.get(API_BASE+"/stats-volleyball/:nationality", (req,res) => {
    let nationality=req.params.nationality;
    let peticion=req.query;

    const from = Number(req.query.from);
    const to = Number(req.query.to);

    if (Object.keys(peticion).length===0) {
        dbVolleyball.find( {"nationality":nationality} ,(err,info)=> {
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
        dbVolleyball.find( {"nationality":nationality,"birthdate": { $gte:new Date(from+"-01-01"), $lte:new Date(to+"-12-31") } } ,(err,info)=> {
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
            
            if ((typeof DMC.datos[0][clave])==="number"){
                valor=Number(valor);

                cond["nationality"]=nationality;
                cond[clave]=valor;
            
                dbVolleyball.find(cond, (err, info) => {
                    if (err) {
                        res.sendStatus(500,'Error interno del servidor' );
                     }else {
                        res.send(JSON.stringify(info.map((c)=> {
                        delete c._id;
                     return c;
                })));
    
            }
            }); 
    
    
            }else if( (typeof DMC.datos[0][clave])==="object" ){
    
                valor=Number(valor);        
    
                dbVolleyball.find({"nationality":nationality,"birthdate":{ $gte:new Date(valor+"-01-01"), $lte:new Date(valor+"-12-31") }}, (err, info) => {
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
            
                dbVolleyball.find(cond, (err, info) => {
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

app.post(API_BASE+"/stats-volleyball/:nationality", (req,res) => {
    res.sendStatus(405, "Method Not Allowed");
});

app.put(API_BASE+"/stats-volleyball/:nationality", (req,res) => {
    let nationality  = req.params.nationality;
    const nuevo = req.body;

    dbVolleyball.update({"nationality":nationality},{$set: nuevo},(err,numUpdated)=>{
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

app.delete(API_BASE+"/stats-volleyball/:nationality", (req,res) => {
    let nationality=req.params.nationality;
    dbVolleyball.remove( {"nationality":nationality},{},(err,numRemoved)=>{
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

app.get(API_BASE+"/stats-volleyball/:nationality/:weight", (req,res) => {
    let nationality=req.params.nationality;
    let weight=req.params.weight;
    dbVolleyball.find({"nationality":nationality, "weight":Number(weight)}, (err,info) => {
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

}
let PRR = require('./array');

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

    app.get(API_BASE+'/stats-rugby', (req, res) => {
        let peticion = req.query; 
    
        let limit = parseInt(req.query.limit) || 10; 
        let offset = parseInt(req.query.offset) || 0;
    
        let from = Number(req.query.from);
        let to = Number(req.query.to);
    
        if (Object.keys(peticion).length===0) {
            dbRugby.find( {} ,(err,info)=> {
                        if(err){
                            res.sendStatus(500,"Internal Error");
                        }else if(info.length===0){
                            res.sendStatus(404,"Not found");
    
                        }else if(info.length===1){
                            let elem=info[0];
                            delete elem._id;
                            res.send(elem);
                        }else{
                            res.send(JSON.stringify(info.map((c)=> {
                                delete c._id;
                                return c;
            
                            })));
                        }
                    });
        }else{
    
            let valores=Object.values(peticion);
            let claves=Object.keys(peticion);
            let cond={}
    
            //Paginación
            let indexLimit = claves.indexOf('limit');
            if (indexLimit !== -1) {
                claves.splice(indexLimit, 1);
                valores.splice(indexLimit, 1);
            }
            let indexOffset = claves.indexOf('offset');
            if (indexOffset !== -1) {
                claves.splice(indexOffset, 1);
                valores.splice(indexOffset, 1);
            }
    
            //Búsquedas
            if(from>0 && to >0 && from<to){
    
                let indexFrom = claves.indexOf('from');
                if (indexFrom !== -1) {
                    claves.splice(indexFrom, 1);
                    valores.splice(indexFrom, 1);
                }
                let indexTo = claves.indexOf('to');
                if (indexTo !== -1) {
                    claves.splice(indexTo, 1);
                    valores.splice(indexTo, 1);
                }
    
                cond["bdate"]={ $gte:new Date(from+"-01-01"), $lte:new Date(to+"-12-31") };
    
                from=0;
                to=0;
    
            }
    
            for(let i=0;i<claves.length;i++){
    
                let clave=claves[i];
    
                if((typeof PRR.array[0][clave])==="number"){
                    valor=Number(valores[i]);
                }else if((typeof PRR.array[0][clave])==="object"){
                    valor_aux=Number(valores[i]);
                    valor={ $gte:new Date(valor_aux+"-01-01"), $lte:new Date(valor_aux+"-12-31") };
                }else{
                    valor=valores[i];
                }
                cond[clave]=valor;
            }
    
            dbRugby.find(cond).skip(offset).limit(limit).exec((err, info) => {
                if (err) {
                    res.sendStatus(500,'Server Internal Error');
                }else if(info.length===0){
                    res.sendStatus(404,"Not found");

                }else if(info.length===1){
                    let elem=info[0];
                    delete elem._id;
                    res.send(elem);
                }else {
                    res.send(info.map((c)=> {
                        delete c._id;
                    return c;
                    }));
        }
        });      
        }      
    });
    
    app.post(API_BASE+"/stats-rugby", validarDatos, (req,res) => {
        let stat=req.body;
        dbRugby.find({
            "team": stat.team,
            "plabel": stat.plabel,
            "age": stat.age,
            "height": stat.height,
            "weight": stat.weight,
            "bplace": stat.bplace,
            "bdate": stat.bdate,
            "last": stat.last,
            "first": stat.first,
            "caps": stat.caps
        }, (err,info) => {
            if(err){
                res.sendStatus(500,"Internal Error");
            }else{
                if(info.length>0){
                    res.sendStatus(409,"Conflict");
                } else{
                    dbFootball.insert(stat, (err,info) => {
                        if(err){
                            res.sendStatus(500,"Internal Error");
                        }else{
                            res.sendStatus(201,"Created");
                        }
                    });  
                }
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
    app.get(API_BASE+"/stats-rugby/:nationality", (req,res) => {
        let nationality=req.params.nationality;
        let peticion=req.query;
    
        let limit = parseInt(req.query.limit) || 10; 
        let offset = parseInt(req.query.offset) || 0;
    
        let from = Number(req.query.from);
        let to = Number(req.query.to);
    
        if (Object.keys(peticion).length===0) {
            dbRugby.find( {"bplace":nationality} ,(err,info)=> {
                        if(err){
                            res.sendStatus(500,"Internal Error");
                        }else if(info.length===0){
                            res.sendStatus(404,"Not found");
                        }else if(info.length===1){
                            let elem=info[0];
                            delete elem._id;
                            res.send(elem);
                        }else{
                            res.send(info.map((c)=> {
                                delete c._id;
                                return c;
                            }));
                        }
                    });
        }else{
    
            let valores=Object.values(peticion);
            let claves=Object.keys(peticion);
            let cond={}
            cond["bplace"]=nationality;
    
            //Paginación
            let indexLimit = claves.indexOf('limit');
            if (indexLimit !== -1) {
                claves.splice(indexLimit, 1);
                valores.splice(indexLimit, 1);
            }
            let indexOffset = claves.indexOf('offset');
            if (indexOffset !== -1) {
                claves.splice(indexOffset, 1);
                valores.splice(indexOffset, 1);
            }
    
            //Búsquedas
            if(from>0 && to >0 && from<to){
    
                let indexFrom = claves.indexOf('from');
                if (indexFrom !== -1) {
                    claves.splice(indexFrom, 1);
                    valores.splice(indexFrom, 1);
                }
                let indexTo = claves.indexOf('to');
                if (indexTo !== -1) {
                    claves.splice(indexTo, 1);
                    valores.splice(indexTo, 1);
                }
    
                cond["bdate"]={ $gte:new Date(from+"-01-01"), $lte:new Date(to+"-12-31") };
    
                from=0;
                to=0;
    
            }
    
            for(let i=0;i<claves.length;i++){
    
                clave=claves[i];
    
                if((typeof PRR.array[0][clave])==="number"){
                    valor=Number(valores[i]);
                }else if((typeof PRR.array[0][clave])==="object"){
                    valor_aux=Number(valores[i]);
                    valor={ $gte:new Date(valor_aux+"-01-01"), $lte:new Date(valor_aux+"-12-31") };
                }else{
                    valor=valores[i];
                }
                cond[clave]=valor;
            }
    
            dbRugby.find(cond).skip(offset).limit(limit).exec((err, info) => {
                if (err) {
                    res.sendStatus(500,'Server Internal Error' );
                 }else if(info.length===0){
                    res.sendStatus(404,"Not found");
                }else if(info.length===1){
                    let elem=info[0];
                    delete elem._id;
                    res.send(elem);
                }else {
                    res.send(info.map((c)=> {
                        delete c._id;
                 return c;
            }));
        }
        }); 
    
            }
        
    });
    app.post(API_BASE+"/stats-rugby/:name", (req,res) => {
        res.sendStatus(405, "Method Not Allowed");
    });
    
    app.put(API_BASE+"/stats-rugby/:nationality", (req,res) => {
        let nationality  = req.params.nationality;
        const nuevo = req.body;
        let nom=false;
    
        dbRugby.find({"bplace":nationality},(err,info)=>{
            if (err) {
                res.sendStatus(500, "Internal Error");
            }else if(info.length===0){
                res.sendStatus(404, "Not Found");
            }else {
                info.filter((c)=>{
                    if(c.first===nuevo.first){
                        nom=true;
                    }
                })
                if(nom===false){
                    res.sendStatus(400,"Bad Request");
                }else{
                dbRugby.update({"first":nuevo.first,"bplace":nationality},{$set: nuevo},(err,numUpdated)=>{
                    if (err) {
                        res.sendStatus(500, "Internal Error");
                    }else {
                        if (numUpdated === 0) {
                            res.sendStatus(404, "Not found");
                        } else {
                            res.sendStatus(200, "Ok");
                        }
                    }
                });
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
        }else if(info.length===0){
            res.sendStatus(404,"Not found");
        }else if(info.length===1){
            let elem=info[0];
            delete elem._id;
            res.send(elem);
        }else{
            res.send(info.map((c)=> {
                delete c._id;
                return c;
            }));
        }
    });
});

app.put(API_BASE+"/stats-rugby/:nationality/:weight", (req,res) => {
    let nationality=req.params.nationality;
    let weight=req.params.weight;
    const nuevo=req.body;

    let v_n;

    dbRugby.find({"bplace":nationality,"weight":Number(weight)},{$set: nuevo},(err,info)=>{
        if (err) {
            res.sendStatus(500, "Server Internal Error");
        } else if(info.length===0){
            res.sendStatus(404, "Not Found");
        }else {
            v_n=info[0].first;
            if(!(nuevo.first) || nuevo.first!==v_n){
                res.sendStatus(400,"Bad Request");
            }else{

                dbRugby.update({"bplace":nationality,"weight":Number(weight)},{$set: nuevo},(err,numUpdated)=>{
                if (err) {
                    res.sendStatus(500, "Server Internal Error");
                }else {
                    if (numUpdated === 0) {
                        res.sendStatus(404, "Not found");
                    } else {
                        res.sendStatus(200, "Ok");
                    }
                }
            });
            }
        }
    });
});

app.delete(API_BASE+"/stats-rugby/:nationality/:weight", (req,res) => {
    let nationality=req.params.nationality;
    let weight=req.params.weight;

    dbFootball.remove( {"bplace":nationality, "weight": Number(weight)},{ multi: true },(err,numRemoved)=>{
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
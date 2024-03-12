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

    let limit = parseInt(req.query.limit) || 10; 
    let offset = parseInt(req.query.offset) || 0;

    let from = Number(req.query.from);
    let to = Number(req.query.to);

    if (Object.keys(peticion).length===0) {
        dbFootball.find( {} ,(err,info)=> {
                    if(err){
                        res.sendStatus(500,"Internal Error");
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

            cond["dob"]={ $gte:new Date(from+"-01-01"), $lte:new Date(to+"-12-31") };

            from=0;
            to=0;
        }

        for(let i=0;i<claves.length;i++){

            let clave=claves[i];

            if((typeof PSS.jugadores[0][clave])==="number"){
                valor=Number(valores[i]);
            }else if((typeof PSS.jugadores[0][clave])==="object"){
                valor_aux=Number(valores[i]);
                valor={ $gte:new Date(valor_aux+"-01-01"), $lte:new Date(valor_aux+"-12-31") };
            }else{
                valor=valores[i];
            }
            cond[clave]=valor;
        }

        dbFootball.find(cond).skip(offset).limit(limit).exec((err, info) => {
            if (err) {
                res.sendStatus(500,'Error interno del servidor' );
            }else {
                res.send(info.map((c)=> {
                    delete c._id;
                return c;
                }));
            }
        });      
    }      
});

app.post(API_BASE+"/stats-football", validarDatos, (req,res) => {
    let stat=req.body; 

    dbFootball.find({"short_name":stat.short_name, "long_name":stat.long_name, "age":stat.age, "height_cm":stat.height_cm, "weight_kg":stat.weight_kg}, (err,info) => {
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

    let limit = parseInt(req.query.limit) || 10; 
    let offset = parseInt(req.query.offset) || 0;

    let from = Number(req.query.from);
    let to = Number(req.query.to);

    if (Object.keys(peticion).length===0) {
        dbFootball.find( {"nationality":nationality} ,(err,info)=> {
            if(err){
                res.sendStatus(500,"Internal Error");
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
        cond["nationality"]=nationality;

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

            cond["birthdate"]={ $gte:new Date(from+"-01-01"), $lte:new Date(to+"-12-31") };

            from=0;
            to=0;
        }

        for(let i=0;i<claves.length;i++){

            clave=claves[i];

            if((typeof PSS.jugadores[0][clave])==="number"){
                valor=Number(valores[i]);
            }else if((typeof PSS.jugadores[0][clave])==="object"){
                valor_aux=Number(valores[i]);
                valor={ $gte:new Date(valor_aux+"-01-01"), $lte:new Date(valor_aux+"-12-31") };
            }else{
                valor=valores[i];
            }
            cond[clave]=valor;
        }

        dbFootball.find(cond).skip(offset).limit(limit).exec((err, info) => {
            if (err) {
                res.sendStatus(500,'Error interno del servidor' );
             }else {
                res.send(info.map((c)=> {
                    delete c._id;
                return c;
            }));
            }
        }); 
    }
});

app.post(API_BASE+"/stats-football/:nationality", (req,res) => {
    res.sendStatus(405, "Method Not Allowed");
});

app.put(API_BASE+"/stats-football/:nationality", (req,res) => {
    let nationality = req.params.nationality;
    let nuevo = req.body;

    let nom=false;

    dbFootball.find({"nationality":nationality},(err,info)=>{
        if (err) {
            res.sendStatus(500, "Internal Error");
        } else if(info.length===0){
            res.sendStatus(404, "Not Found");
        }else {
            info.filter((c)=>{
                if(c.short_name===nuevo.short_name){
                    nom=true;
                }
            })
            if(nom===false){
                res.sendStatus(400,"Bad Request");
            }else{
                dbFootball.update({"short_name":nuevo.short_name,"nationality":nationality,},{$set: nuevo},(err,numUpdated)=>{
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
            res.send(info.map((c)=> {
                delete c._id;
                return c;
            }));
        }
    });
});

app.put(API_BASE+"/stats-football/:nationality/:height_cm", (req,res) => {
    let nationality  = req.params.nationality;
    let height_cm  = req.params.height_cm;
    const nuevo = req.body;

    let v_n;

    dbFootball.find({"nationality":nationality,"height_cm":Number(height_cm)},(err,info)=>{
        if (err) {
            res.sendStatus(500, "Internal Error");
        } else if(info.length===0){
            res.sendStatus(404, "Not Found");
        }else {
            v_n=info[0].short_name;
            if(!(nuevo.short_name) || nuevo.short_name!==v_n){
                res.sendStatus(400,"Bad Request");
            }else{
                dbFootball.update({"nationality":nationality,"height_cm":Number(height_cm)},{$set: nuevo},(err,numUpdated)=>{
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

app.delete(API_BASE+"/stats-football/:nationality/:height_cm", (req,res) => {
    let nationality=req.params.nationality;
    let height_cm=req.params.height_cm;

    dbFootball.remove( {"nationality":nationality, "height_cm": Number(height_cm)},{ multi: true },(err,numRemoved)=>{
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
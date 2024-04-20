import datosDMC from "./datos.js"

const API_BASE = "/api/v2";

//funcion para validar si los campos son correctos
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
    
    //comprueba que no haya claves de más
    const clavesExtra = keysRecibidas.filter(key => !keysEsperadas.includes(key));
    if (clavesExtra.length > 0) {
        console.error(`Se encontraron claves adicionales en el JSON: ${clavesExtra.join(', ')}`);
        return res.sendStatus(400, "Bad request");
    }

    //comprueba que no haya claves de menos
    if (keysFaltantes.length > 0) {
        console.error(`Faltan las siguientes claves en el JSON: ${keysFaltantes.join(', ')}` );
        return res.sendStatus(400, "Bad request");
    }

    //comprueba que sean los tipos que son
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

function loadBackendDMC(app,dbVolleyball){
//Recurso para /api de DOMINGO MORALES

dbVolleyball.insert(datosDMC);

app.get(API_BASE+"/stats-volleyball/loadInitialData", (req,res) => {
    dbVolleyball.find({}, (err, docs) => {
        if(err){
            res.sendStatus(500, "Internal Error");
        }else {
            if (docs.length === 0) {
                dbVolleyball.insert(datosDMC);
                res.sendStatus(201, "Created");
            } else{
                res.sendStatus(409, "Conflict");
            }
        }
    });
});


app.get(API_BASE+'/stats-volleyball', (req, res) => {
    let peticion = req.query; 

    let limit = parseInt(req.query.limit) || 10; 
    let offset = parseInt(req.query.offset) || 0;

    let from = Number(req.query.from);
    let to = Number(req.query.to);

    if (Object.keys(peticion).length===0) {
        dbVolleyball.find( {} ,(err,info)=> {
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
        let cond={};

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

        let valor=0;
        let valor_aux=0;

        for(let i=0;i<claves.length;i++){

            let clave=claves[i];

            if((typeof datosDMC[0][clave])==="number"){
                valor=Number(valores[i]);
            }else if((typeof datosDMC[0][clave])==="object"){
                valor_aux=Number(valores[i]);
                valor={ $gte:new Date(valor_aux+"-01-01"), $lte:new Date(valor_aux+"-12-31") };
            }else{
                valor=valores[i];
            }
            cond[clave]=valor;
        }

        dbVolleyball.find(cond).skip(offset).limit(limit).exec((err, info) => {
            if (err) {
                res.sendStatus(500,'Error interno del servidor' );
             }else if(info.length===0){
                res.sendStatus(404,"Not found");
            }else {
                res.send(info.map((c)=> {
                    delete c._id;
                    return c;
        }));
    }
    });      
    }      
  });


app.post(API_BASE+"/stats-volleyball", validarDatos, (req,res) => {
    let stat=req.body;

    dbVolleyball.find({"name":stat.name,"ranking":stat.ranking,"nationality":stat.nationality,"position":stat.position,"height":stat.height,"weight":stat.weight,"dominant_hand":stat.dominant_hand,"country_point":stat.country_point,"point":stat.point}, (err,info) => {
        if(err){
            res.sendStatus(500,"Internal Error");
        }else{
            if(info.length===0){

                dbVolleyball.insert(stat, (err,info) => {
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

    let limit = parseInt(req.query.limit) || 10; 
    let offset = parseInt(req.query.offset) || 0;

    let from = Number(req.query.from);
    let to = Number(req.query.to);

    if (Object.keys(peticion).length===0) {
        dbVolleyball.find( {"nationality":nationality} ,(err,info)=> {

                    if(err){
                        res.sendStatus(500,"Internal Error");
                    }
                    else{
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

        let valor=0;
        let valor_aux=0;

        for(let i=0;i<claves.length;i++){

            clave=claves[i];

            if((typeof datosDMC[0][clave])==="number"){
                valor=Number(valores[i]);
            }else if((typeof datosDMC[0][clave])==="object"){
                valor_aux=Number(valores[i]);
                valor={ $gte:new Date(valor_aux+"-01-01"), $lte:new Date(valor_aux+"-12-31") };
            }else{
                valor=valores[i];
            }
            cond[clave]=valor;
        }

        dbVolleyball.find(cond).skip(offset).limit(limit).exec((err, info) => {
            if (err) {
                res.sendStatus(500,'Error interno del servidor' );
             }else if(info.length===0){
                res.sendStatus(404,"Not found");
            }else {
                res.send(info.map((c)=> {
                    delete c._id;
                    return c;
        }));
    }
    }); 

        }
    
});

app.post(API_BASE+"/stats-volleyball/:nationality", (req,res) => {
    res.sendStatus(405, "Method Not Allowed");
});

app.put(API_BASE+"/stats-volleyball/:nationality", (req,res) => {
    let nationality  = req.params.nationality;
    const nuevo = req.body;
    let nom=false;

    dbVolleyball.find({"nationality":nationality},(err,info)=>{
        if (err) {
            res.sendStatus(500, "Internal Error");
        } else if(info.length===0){
            res.sendStatus(404, "Not Found");
        }else {
            info.filter((c)=>{
                if(c.name===nuevo.name){
                    nom=true;
                }
            })
            if(nom===false){
                res.sendStatus(400,"Bad Request");
            }else{
                dbVolleyball.update({"nationality":nationality},{$set: nuevo},(err,numUpdated)=>{
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
        }
        else if(info.length===0){
            res.sendStatus(404,"Not found");

        }
        else{
            let elem=info[0];
            delete elem._id;
            res.send(elem);
        }
    });
});

app.put(API_BASE+"/stats-volleyball/:nationality/:weight", (req,res) => {
    let nationality=req.params.nationality;
    let weight=req.params.weight;
    const nuevo=req.body;

    let v_nom;

    dbVolleyball.find({"nationality":nationality,"weight":Number(weight)},(err,info)=>{
        if (err) {
            res.sendStatus(500, "Internal Error");
        } else if(info.length===0){
            res.sendStatus(404, "Not Found");
        }else {
            v_nom=info[0].name;
            if(!(nuevo.name) || nuevo.name!==v_nom){
                res.sendStatus(400,"Bad Request");
            }else{
                dbVolleyball.update({"nationality":nationality,"weight":Number(weight)},{$set: nuevo},(err,numUpdated)=>{
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

app.delete(API_BASE+"/stats-volleyball/:nationality/:weight", (req,res) => {
    let nationality=req.params.nationality;
    let weight=req.params.weight;

    dbVolleyball.remove( {"nationality":nationality, "weight": Number(weight)},{ multi: true },(err,numRemoved)=>{
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

app.get("/data1",(req,res)=>{

    let data=[];
    let l=datosDMC.length;
    for(let i=0; i< l; i++){
        let n=datosDMC[i].height;
        data.push({ alt:n});
    }
    res.send(data);
});

app.get("/data2",(req,res)=>{

    let data=[];
    let paisesSet = [];
    
    datosDMC.forEach((el) => {
        
        if(!(paisesSet.includes(el.nationality))){
            console.log(el.nationality);
            paisesSet.push(el.nationality);
        }
    });

    console.log(paisesSet);

    for(let i=0;i<paisesSet.length;i++){
        let p=paisesSet[i];
        let ar=datosDMC.filter(el => el.nationality === p).map(el => el.name);
        let n=ar.length/datosDMC.length;
        console.log(p+"y "+n);
        data.push({name:p,y:n});
    }
    res.send(data);
});

}

export{loadBackendDMC};
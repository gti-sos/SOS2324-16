let PRR = require('../index-PRR');

const API_BASE = "/api/v1";

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
        dbRugby.find(stat, (err,info) => {
            if(err){
                res.sendStatus(500,"Internal Error");
            }else{
                if(info){
                    res.sendStatus(409, "Confilct");
                }else {
                    dbRugby.insert(stat);
                    res.sendStatus(201,"Created");
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
    
    app.get(API_BASE+"/stats-rugby/:name", (req,res) => {
        let name=req.params.name;
        dbRugby.find({"first":name}, (err,info) => {
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
}


let cool = require("cool-ascii-faces");
let express = require("express");

let app = express();
const PORT = (process.env.PORT || 10000);

let PSS = require('./index-PSS');
let PRR = require('./index-PRR');
let DMC = require('./index-DMC');

app.use("/", express.static("./public"));

app.get("/cool", (req,res) => {
    res.send(`<html><body><h1>${cool()}</html></body></h1>`);
});

app.get("/samples/PSS", (req,res) => {
    res.send(`<html><body><h1> ${PSS.calcularMediaEdadPorNacionalidades(PSS.jugadores)}  </h1></body></html>`)
});

app.get("/samples/PRR", (req,res) => {
    res.send(`<html><body><h1> ${PRR.mediaPesoPorPais(PRR.array, "Argentina")}  </h1></body></html>`)
});

app.get("/samples/DMC",(req,res)=>{
    res.send(`<html><body><h1> ${DMC.todosPaises(DMC.datos)}  </h1></body></html>`)
});

app.listen(PORT,() =>{
    console.log(`Server listening on port ${PORT}.`);
});

console.log(`Server initializing...`);
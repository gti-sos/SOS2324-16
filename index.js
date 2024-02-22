let cool = require("cool-ascii-faces");
let express = require("express");

let app = express();
const PORT = (process.env.PORT || 10000);

app.use("/", express.static("./public"));
app.use("/samples/PSS", express.static("./samples/PSS"));
app.use("/samples/DMC", express.static("./samples/DMC"));

app.use("/samples/PRR", express.static("./samples/PRR"));

app.get("/cool", (req,res) => {
    res.send(`<html><body><h1>${cool()}</html></body></h1>`);
});

app.listen(PORT,() =>{
    console.log(`Server listening on port ${PORT}.`);
});

console.log(`Server initializing...`);
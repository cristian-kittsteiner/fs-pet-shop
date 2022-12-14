import express, { application } from "express";
import { readFile, writeFile } from 'node:fs/promises';
import morgan from "morgan";

let app = express();
let info =await readFile("./pets.json" , 'utf-8')
let data = (JSON.parse(info))
let create = (newPet) => {
    data.push(newPet);
    let jsonUpdate = JSON.stringify(data)
    writeFile("./pets.json" , jsonUpdate)
}
app.use(express.json());
app.use(morgan("tiny"));


app.get('/pets', async (req, res) => {
    res.send(data)
})

app.get('/pets/:index', async (req, res) => {
    let index = req.params.index
    if(data[index] === undefined){
        res.status(404).send('Not Found')
    } else{
        res.send(data[index])
    }
})


app.post('/pets', async (req, res) => {
    let pet = req.body;
    if(typeof pet.age !== "number" || pet.kind === undefined || pet.name === undefined){
        res.status(400).send('Bad Request')
    } else {
        create(pet)
        res.send(pet);
    }
})

app.use((req, res) => {
    res.status(404).send("Not Found")
})

app.get('/boom', (req, res) => {
    res.status(500).send("Internal Server Error")
})

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("internal Sataus Error")
})


// app.get(path, async function(req, res){
//     if(req.params.index === undefined){
//         res.send('data.index')
//         //res.send(req.params)
//         process.exit([1])
//     } else {
//         res.send(data)
//         console.dir(req.params)
//         //process.exit([1])
//     }  
// })  unfortunately this did not work as expected. gonna use router function I think


app.listen(3000, function(){
    console.log('server is running')
})
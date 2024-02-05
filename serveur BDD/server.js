const { error } = require('console');
const express = require('express');
const { request } = require('http');
const{MongoClient} = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use((req,res,next)=>{
    console.log(`requete recue : ${req.methode} ${req.url}${JSON.stringify(req.body)}`);
    next();
});

const uri = 'mongodb+srv://raphael:test@cluster0.ueqps0d.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);
app.use(bodyParser.json());
client.connect(err =>{
    if(err){
        console.log("erreur dans la base de données")
    }else{
        console.log("connexion réussie")
    }
});

app.post('/utilisateurs',(request,response)=>{
    const{nom,prenom} = request.body;

    if(!nom || !prenom){
        return response.status(400).json({erruer : "veuillez fournir un nom et un prenom"});
    }
    const nouvelUtilisateur = {nom,prenom};
    const collection = client.db('myDB').collection("utilisateurs");

    try{
        const result = collection.insertOne(nouvelUtilisateur);
        console.log("utilisateur ajouté avec succès");
        response.status(201).json(nouvelUtilisateur);
    }
    catch(error){
        console.error("erreur lors de l'ajout d'utilisateur",error);
        response.status(500).json({erreur : ("erreur lors de l'ajout d'utilisateur")});
    }
});


app.get('/utilisateurs',(request,response)=>{
    const collection = client.db('myDB').collection("utilisateurs");
    collection.find().toArray((err,utilisateur) => {
        if(err){
            console.error('erreur lors de la recherche des utilisateur: ',error);
            response.status(500).send('erreur intern du serveur')
        }
        else{
            response.json(utilisateur);
        }
    });
});

app.listen(port, ()=>{
    console.log (`serveur en cours d'execution sur le port : ${port}`)
})
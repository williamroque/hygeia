const path = require('path');

const Filesystem = require('./js/filesystem');
const system = new Filesystem(__dirname);

const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb';

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const modules = system.parseModules();

(async () => {
    await client.connect();

    const db = client.db('hygeia');

    const express = require('express');
    const app = express();

    const port = 80;


    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public/index.html'));
    });

    app.get('/patients', (req, res) => {
        const patients = db.collection('patients').find().toArray();

        patients.then(data => {
            res.send(data);
        });
    });

    app.get('/modules', (req, res) => {
        res.send(modules.map(mod => mod.manifest));
    });

    app.listen(port, () => {
        console.log(`Usando a porta ${port}.`);
    });

    app.use('/', express.static(path.join(__dirname, 'public')));
})();

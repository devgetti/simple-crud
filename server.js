import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Character from './src/character';

const app = express();
//const port = 3001;
const dbUrl = 'mongodb://localhost/crud';

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
        mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
        mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
        mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
        mongoPassword = process.env[mongoServiceName + '_PASSWORD']
        mongoUser = process.env[mongoServiceName + '_USER'];
    
    if (mongoHost && mongoPort && mongoDatabase) {
        mongoURLLabel = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword) {
        mongoURL += mongoUser + ':' + mongoPassword + '@';
        }
        // Provide UI label that excludes user id and pw
        mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
    }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(mongoURL, dbErr => {
    if (dbErr) throw new Error(dbErr);
    else console.log('db connected');

    app.get('/api/test', (request, response) => {
        console.log('receive GET request');
    });

    app.post('/api/characters', (request, response) => {
        console.log('receive POST request');
        console.log(request.body);

        const { name, age } = request.body;

        new Character({
            name,
            age,
        }).save((err) => {
            if (err) response.status(500);
            //else response.status(200).send(`${name}(${age}) was successfully created.`);
            else {
                Character.find({}, (findErr, characterArray) => {
                    if (findErr) response.status(500).send();
                    else response.status(200).send(characterArray);
                });
            }
        });
    });

    app.get('/api/characters', (request, response) => {
        console.log('receive GET request');
        Character.find({}, (err, characterArray) => {
            if (err) response.status(500);
            else response.status(200).send(characterArray);
        });
    });

    app.put('/api/characters', (request, response) => {
        console.log("receive PUT request");
        const { id } = request.body;
        Character.findByIdAndUpdate(id, { $inc: { "age": 1 } }, err => {
            if (err) response.status(500).send();
            else {
                Character.find({}, (findErr, characterArray) => {
                    if (findErr) response.status(500).send();
                    else response.status(200).send(characterArray);
                });
            }
        });
    });

    app.delete('/api/characters', (request, response) => {
        console.log("receive DELETE request");
        const { id } = request.body;
        Character.findByIdAndRemove(id, (err) => {
            if (err) response.status(500).send();
            else {
                Character.find({}, (findErr, characterArray) => {
                    if (findErr) response.status(500).send();
                    else response.status(200).send(characterArray);
                });
            }
        })
    });

    app.listen(port, (err) => {
        if (err) throw new Error(err);
        else console.log(`listening on port ${port}`);
    });
});

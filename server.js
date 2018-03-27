import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Character from './src/character';

const app = express();
const port = 3001;
const dbUrl = 'mongodb://localhost/crud';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(dbUrl, dbErr => {
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

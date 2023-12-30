const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading notes file");
        }
        try {
            res.json(JSON.parse(data));
        } catch (parseErr) {
            console.error(parseErr);
            res.status(500).send("Error parsing notes data");
        }
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: uuidv4() };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading notes file");
        }
        try {
            const notes = JSON.parse(data);
            notes.push(newNote);

            fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error saving note");
                }
                res.json(newNote);
            });
        } catch (parseErr) {
            console.error(parseErr);
            res.status(500).send("Error parsing notes data");
        }
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`); 
});
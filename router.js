const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const jsonParser = express.json();

router.use(express.static(path.resolve(__dirname, 'public')));

const dbPath = 'db.json';

router.get('/home', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

// GET
router.get('/contacts', (req, res) => {
    const content = fs.readFileSync(dbPath, 'utf8');
    const contacts = JSON.parse(content);
    res.status(200).send(contacts);
})

// POST
router.post('/contacts', jsonParser, (req, res) => {

  
    if (!req.body) return res.sendStatus(400);

    const name = req.body.name;
    const tel = req.body.tel;
    const marked = req.body.marked;

    let contact = {
        name: name,
        tel: tel,
        marked: marked
    };

    let data = fs.readFileSync(dbPath, 'utf8');
    let contacts = JSON.parse(data);

    if (contacts.length === 0) {
        contact.id = 1;
    } else {
        const id = Math.max.apply(Math, contacts.map(c => c.id));
        contact.id = id + 1;
    };

    contacts.push(contact);
    data = JSON.stringify(contacts);
    fs.writeFileSync('db.json', data);
    res.send(contact);
})

// PUT
router.put('/contacts', jsonParser, (req, res) => {

    if (!req.body) return res.sendStatus(400);

    const id = req.body.id;
    const marked = req.body.marked;
    let data = fs.readFileSync(dbPath, 'utf8');
    let contacts = JSON.parse(data);
    let contact;

    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].id == id) {
            contact = contacts[i];
            break;
        }
    }
    if (contact) {
        contact.marked = marked;
        data = JSON.stringify(contacts);
        fs.writeFileSync('db.json', data);
        res.send(contact);
    } else {
        res.status(404).send(contact);
    }
})

// DELETE
router.delete('/contacts/:id', (req, res) => {
    const id = req.params.id;
    let data = fs.readFileSync(dbPath, 'utf8');
    let contacts = JSON.parse(data);
    let idx = -1;

    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].id == id) {
            idx = i;
            break;
        }
    }
    if (idx > -1) {
        const contact = contacts.splice(idx, 1)[0];
        data = JSON.stringify(contacts);
        fs.writeFileSync('db.json', data);
        res.send(contact);
    }
})

router.use('*', function(req, res) {
  res.status(400).send(`not found`)
});

module.exports = router;
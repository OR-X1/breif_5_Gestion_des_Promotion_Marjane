const express = require('express');
const db = require('../db');

const router = express.Router();



router.get('/', async (req, res, next) => {
    // res.json({ test: 'test' });
    try{
        let results = await db.all();
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:id', async (req, res, next) => {
    try{
        let results = await db.one(req.params.id);
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/', async (req, res, next) => {

    let name = req.query.name;
    let tel = req.query.tel;
    let ville = req.query.ville;
    console.log("hiiiii" +name);
    try{
        let results = await db.insert(name, tel, ville);
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete('/:id', async (req, res, next) => {
    try{
        let results = await db.delete(req.params.id);
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;
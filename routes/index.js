var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

const nutritionFactsSchema = new mongoose.Schema({
    name: String,
    date: String,
    units: String,
    servingSize: Number,
    calories: Number, 
    fat: Number,            // grams
    chol: Number,               // miligrams
    sodium: Number,             // miligrams
    carbs: Number,          // grams
    fiber: Number,          // grams
    sugars: Number,         // grams
    proteins: Number,       // grams
});

const Facts = mongoose.model('Facts', nutritionFactsSchema);
const Daily = mongoose.model('Daily', nutritionFactsSchema);
const Hist  = mongoose.model('Hist' , nutritionFactsSchema);

/* GET home page. */
router.get('/', (req, res, next) => {
    res.sendFile('index.html', { root: 'public'});
});

router.get('/getFacts', async (req, res) => {
    console.log('router GET /getFacts');
    try {
        let facts = await Facts.find();
        res.send(facts);
    } catch(e) { console.log(e); }
});

router.get('/getDailyFood', async (req, res) => {
   console.log('router GET /getIntake');
   try {
       let daily = await Daily.find();
       res.send(daily);
   } catch(e) { console.log(e) }
});

router.get('/getHistory', async (req, res) => {
    console.log('router GET /getHistory');
    try {
        let hist = await Hist.find();
        res.send(hist);
    } catch(e) { console.log(e); }
});

router.post('/addFact', async (req, res) => {
    console.log('router POST /addFact');
    try {
        const fact = new Facts({
            name: req.body.name,
            date: null,
            units: req.body.units,
            servingSize: req.body.servingSize,
            calories: req.body.calories,
            fat: req.body.fat,
            chol: req.body.chol,
            sodium: req.body.sodium,
            carbs: req.body.carbs,
            fiber: req.body.fiber,
            sugars: req.body.sugars,
            proteins: req.body.proteins
        });
        await fact.save();
        return res.send(fact);
    } catch(e) { console.log(e); }
});

router.post('/addDaily', async (req, res) => {
    console.log('router POST /addDaily');
    console.log(req.body);
    try {
        var name = { name: req.body.name };
        var fact = await Facts.findOne(name);
        var multiple = req.body.servings;
        const daily = new Daily({
            name: req.body.name,
            date: req.body.date,
            units: fact.units,
            servingSize: (req.body.servings * fact.servingSize),
            calories: (fact.calories * multiple),
            fat: (fact.fat * multiple),
            chol: (fact.chol * multiple),
            sodium: (fact.sodium * multiple),
            carbs: (fact.carbs * multiple),
            fiber: (fact.fiber * multiple),
            sugars: (fact.sugars * multiple),
            proteins: (fact.proteins * multiple)
        });
        await daily.save();
        return res.send(daily);
    } catch(e) { console.log(e); }
});

router.post('/addHistory', async (req, res) => {
    console.log('router POST /addHistory');
    try {
        const hist = new Hist({
            name: '',
            date: req.body.date,
            units: '',
            servingSize: 0,
            calories: req.body.calories,
            fat: req.body.fat,
            chol: req.body.chol,
            sodium: req.body.sodium,
            carbs: req.body.carbs,
            fiber: req.body.fiber,
            sugars: req.body.sugars,
            proteins: req.body.proteins
        });
        await hist.save();
        return res.send(hist);
    } catch(e) { console.log(e); }
});

router.delete('/removeFact/:name', async (req, res) => {
    console.log('router DELETE /removeFact');
    try {
        var fact = { name: req.params.name };
        Facts.deleteOne(fact, (err, obj) => {
            if (err) { throw err; }
            console.log('delete successful');
        });
        res.end('{"Success":"Updated Successfully", "Status": 200}');
    } catch(e) { console.log(e); }
});

router.delete('/removeDaily/:name', async (req, res) => {
    console.log('router DELETE /removeDaily');
    try {
        var daily = { name: req.params.name };
        Daily.deleteOne(daily, (err, obj) => {
            if (err) { throw err; }
            console.log('delete successful');
        });
        res.end('{"Success":"Updated Successfully", "Status": 200}');
    } catch(e) { console.log(e); }
});

router.delete('/removeHist/:name', async (req, res) => {
    console.log('router DELETE /removeHist');
    try {
        var hist = { name: req.params.name };
        Hist.deleteOne(hist, (err, obj) => {
            if (err) { throw err; }
            console.log('delete successful');
        });
        res.end('{"Success":"Updated Successfully", "Status": 200}');
    } catch(e) { console.log(e); }
});

module.exports = router;

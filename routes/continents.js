const express = require('express');
const router = express.Router()

const ContinentModel = require('../models/Continent');
const CountryModel = require('../models/Country');

router.get('/1', async (request, response) => {
    const continents = await ContinentModel.find().populate('countries');

    response.status(200).json(continents);
});

//Question 3
router.get('/list', async (request, response) => {
    const continents = await ContinentModel.find()
    const list = []
    continents.forEach(c => {
        console.log(c.name)
        console.log(c.countries.length)
        list.push({
            name: c.name,
            number_of_countries: c.countries.length
        })
    });
    response.status(200).json(list);
});


//Question 4
router.get('/4th/:name', async (request, response) => {
    const continentName = request.params.name;

    const continent = await ContinentModel.findOne({
        name: continentName
    }).populate('countries');
    countries = continent.countries;
    countries.sort((a, b) => {
        let fa = a.name.toLowerCase(),
            fb = b.name.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
           return 1;
        }
           return 0;
    });

    response.status(200).json(countries[3]);
});


router.get('/id/:id', async (request, response) => {
    const continentId = request.params.id;

    const continent = await ContinentModel.findOne({
        _id: continentId
    });

    response.status(200).json(continent);
});

router.get('/name/:name', async (request, response) => {
    const continentName = request.params.name;

    const continent = await ContinentModel.findOne({
        _name: continentName
    });

    response.status(200).json(continent);
});

router.post('/', async (request, response) => {
    const { name } = request.body

    const continent = await ContinentModel.create({
        name: name
    });

    response.status(200).json(continent);
});


module.exports = router;
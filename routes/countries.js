const express = require('express');
const ContinentModel = require('../models/Continent');
const router = express.Router()

const CountryModel = require('../models/Country')

router.get('/', async (request, response) => {
    const countries = await CountryModel.find().populate('continent');
    response.status(200).json(countries);
});

router.get('/id/:id', async (request, response) => {
    const countryId = request.params.id;

    const countries = await CountryModel.findOne({
        _id: countryId
    });
    
    response.status(200).json(countries);
});

router.get('/filter/:keys', async (request, response) => {
    const keys = request.params.keys;
    const countries = await CountryModel.find({
        name: { $regex: "^.*" + keys + ".*$"}
    })
    
    response.status(200).json(countries);
});


router.get('/number', async (req, res) => {
    const num = await CountryModel.count();
    return res.status(200).json({msg: "We have " + num + " countries"});
});



router.post('/new', async (request, response) => {
    const {name, isoCode, continent} = request.body
    const continent_object = await ContinentModel.findOne(
        {name: continent}
    )
    const country = await CountryModel.create({
        name: name,
        isoCode: isoCode,
        continent: continent_object.id
    });
    
    continent_object.countries.push(country.id);
    continent_object.save("Done");

    response.status(200).json(country);
});

//Q5
router.post('/update/pop', async (request, response) => {
    const {name, population} = request.body
    
    const country = await CountryModel.findOneAndUpdate({
        name: name,
    },
    {
        population: population
    },
    {
        new: true
    });
    country.save("Done");
    response.status(200).json(country);
});

router.delete('/:id', async (request, response) => {
    const countryId = request.params.id;

    await CountryModel.findOneAndDelete({
        _id: countryId
    });

    response.status(200).json({msg: 'Country well deleted !'});
});

router.put('/:id', async (request, response) => {
    const countryId = request.params.id;
    const {name, isoCode} = request.body

    const country = await CountryModel.findOneAndUpdate({
        _id: countryId
    },{
        name,
        isoCode
    },{
        new: true
    });

    response.status(200).json(country);
});

//Q6
router.get('/orderbypopulation/',async (request,response) => {
    const countries = await CountryModel.find().sort({"population" : 1})

    response.status(200).json(countries);
})
//Q7
router.get('/filter2/:keys', async (request, response) => {
    const keys = request.params.keys;
    const reg= new RegExp("^.*["+keys+"||"+keys.toUpperCase()+"]"+".*$");
    const countries = await CountryModel.find({
        $and:[
            {
                name: { $regex: reg}
            },{
                population: {$gt: 1000000}
            }
            ]
    });
    
    response.status(200).json(countries);
});

module.exports = router;
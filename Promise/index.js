let yargs = require('yargs');
let axios = require('axios');

const argv = yargs
    .options({
        a : {
            demand: true,
            alias: 'address',
            string: true
        }
    }).help()
    .alias('help', 'h')
    .argv;

let encodedAddress = encodeURIComponent(argv.address);
let geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${ encodedAddress }`;

axios.get(geocodeUrl).then((response) => {
    if (response.data.status === 'ZERO_RESULT'){
        throw new Error("Unable to find location");
    }

    let lat = response.data.results[0].geometry.location.lat;
    let lng = response.data.results[0].geometry.location.lng;
    let weatherUrl = `https://api.darksky.net/forecast/1f8dff5f5bb5c169225ce2b5bb8b7913/${ lat },${ lng }`

    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);

}).then((response) => {
    let temperature = response.data.currently.temperature;
    let apparentTemperature = response.data.currently.apparentTemperature;
    
    console.log("temperature: ", temperature, "apparent temperature", apparentTemperature);
}).catch((err) => {
    if (err.code === 'ENOTFOUND'){
        console.log("Unable to locate server");
    }else {
        console.log(err);
    }
});
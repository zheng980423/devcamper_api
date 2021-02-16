const nodeGeocode = require('node-geocoder');

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formattr: null,
};
const geocoder = nodeGeocode(options);
module.exports = geocoder;

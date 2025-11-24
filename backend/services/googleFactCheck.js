const axios = require('axios');

exports.searchFacts = async (query) => {
  const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?key=${process.env.GOOGLE_API_KEY}&query=${encodeURIComponent(query)}&languageCode=en&pageSize=10`;
  const res = await axios.get(url);
  return res.data.claims || [];
};

const cron = require('node-cron');
const axios = require('axios');
const Claim = require('../models/Claim');
const { searchFacts } = require('../services/googleFactCheck');

module.exports = {
  start() {
    // every 5 minutes; for dev you can change to '*/1 * * * *' (every minute)
    cron.schedule('*/5 * * * *', async () => {
      try {
        console.log('DetectionAgent: polling sample feed...');
        // Example: check a simple trending terms endpoint or a static list
        const testTerms = ['vaccine', 'flood', 'bank holiday'];
        for (const term of testTerms) {
          const facts = await searchFacts(term);
          if (facts && facts.length) {
            // store a claim record for each fact-check result (simplified)
            for (const f of facts) {
              const text = f.text || f.claimReview?.[0]?.title || term;
              await Claim.findOneAndUpdate(
                { text },
                { $set: { text, status: 'unverified', sources: [f.claimReview?.[0]?.publisher?.name || 'google-factcheck'], metadata: f } },
                { upsert: true, new: true }
              );
            }
          }
        }
      } catch (err) {
        console.error('DetectionAgent error', err.message);
      }
    });
  }
};

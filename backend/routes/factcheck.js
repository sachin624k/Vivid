const express = require('express');
const router = express.Router();
const { searchFacts } = require('../services/googleFactCheck');

router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const claims = await searchFacts(q);
    res.json({ ok: true, claims });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;

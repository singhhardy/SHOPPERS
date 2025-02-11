const express = require('express')
const router = express.Router();

router.route('/login').get((req, res) => {
    res.status(201).send(`login Route`)
})

module.exports = router
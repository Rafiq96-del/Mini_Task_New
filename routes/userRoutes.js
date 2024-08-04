const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register route
router.post('/register', async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).send('User already exists');

        user = new User({ username, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).send({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;

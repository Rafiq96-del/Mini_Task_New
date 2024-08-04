const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const auth = require('../middleware/auth');

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// GET product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.json(product);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// POST new product
router.post('/', auth, async (req, res) => {
    const { title, price, description, categories, img } = req.body;
    try {
        const newProduct = new Product({ title, price, description, categories, img });
        await newProduct.save();
        res.json(newProduct);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// DELETE product by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        await product.remove();
        res.json({ msg: 'Product removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// PUT update product by ID
router.put('/:id', auth, async (req, res) => {
    const { title, price, description, categories, img } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');

        product.title = title || product.title;
        product.price = price || product.price;
        product.description = description || product.description;
        product.categories = categories || product.categories;
        product.img = img || product.img;

        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;

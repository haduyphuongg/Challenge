const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

// [GET] /api/product
router.get('/', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM products');
    res.json(rows);
});

// [POST] /api/product
router.post('/', async (req, res) => {
    const { name, slug, quantity } = req.body;
    const id = uuidv4();
    const result = await pool.query(
        `INSERT INTO products (id, name, slug, quantity) VALUES ($1, $2, $3, $4) RETURNING *`,
        [id, name, slug, quantity]
    );
    res.status(201).json(result.rows[0]);
});

// [GET] /api/product/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    result.rows.length ? res.json(result.rows[0]) : res.status(404).json({ message: 'Not found' });
});

// [GET] /api/product/slug/:slug
router.get('/slug/:slug', async (req, res) => {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE slug = $1', [slug]);
    result.rows.length ? res.json(result.rows[0]) : res.status(404).json({ message: 'Not found' });
});

// [PUT] /api/product/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, slug, quantity } = req.body;
    const result = await pool.query(
        `UPDATE products SET name = $1, slug = $2, quantity = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
        [name, slug, quantity, id]
    );
    result.rows.length ? res.json(result.rows[0]) : res.status(404).json({ message: 'Not found' });
});

// [DELETE] /api/product/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    result.rows.length ? res.json({ message: 'Deleted successfully' }) : res.status(404).json({ message: 'Not found' });
});

module.exports = router;

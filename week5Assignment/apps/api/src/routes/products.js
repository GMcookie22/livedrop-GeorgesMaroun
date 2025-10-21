// const express = require('express');
// const router = express.Router();
// const Product = require('../models/product');

// // GET /api/products?search=&tag=&sort=&page=&limit=
// router.get('/', async (req, res, next) => {
//   try {
//     const { search, tag, sort, page = 1, limit = 10 } = req.query;
//     const query = {};

//     // 🔍 Filter by search keyword
//     if (search) {
//       query.name = { $regex: search, $options: 'i' };
//     }

//     // 🏷️ Filter by tag
//     if (tag) {
//       query.tags = tag;
//     }

//     // 📄 Pagination
//     const skip = (page - 1) * limit;

//     // ↕️ Sorting
//     let sortOption = {};
//     if (sort === 'price_asc') sortOption.price = 1;
//     else if (sort === 'price_desc') sortOption.price = -1;
//     else if (sort === 'name_asc') sortOption.name = 1;
//     else if (sort === 'name_desc') sortOption.name = -1;

//     // 🧭 Fetch products
//     const products = await Product.find(query)
//       .sort(sortOption)
//       .skip(Number(skip))
//       .limit(Number(limit));

//     const total = await Product.countDocuments(query);

//     res.json({
//       page: Number(page),
//       totalPages: Math.ceil(total / limit),
//       totalResults: total,
//       products,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// // GET /api/products/:id
// router.get('/:id', async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product)
//       return res.status(404).json({ error: 'Product not found' });

//     res.json(product);
//   } catch (err) {
//     next(err);
//   }
// });

// // POST /api/products
// router.post('/', async (req, res, next) => {
//   try {
//     const product = new Product(req.body);
//     await product.save();
//     res.status(201).json(product);
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET /api/products?search=&tag=&sort=&page=&limit=
router.get('/', async (req, res, next) => {
  try {
    const { search, tag, sort, page = 1, limit = 10 } = req.query;

    // 🧩 Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    if (tag) {
      filter.tags = tag;
    }

    // 📄 Pagination (safe bounds)
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // ↕️ Sorting (clearer options)
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      default:
        sortOption = { name: 1 }; // default sorting
    }

    // ⚡ Fetch data in parallel
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(filter)
    ]);

    // 📦 Response
    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalResults: total,
        totalPages: Math.ceil(total / limitNum),
        hasMore: skip + products.length < total
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const { name, price } = req.body;
    if (!name || price == null)
      return res.status(400).json({ error: 'name and price required' });

    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

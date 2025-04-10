const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')

// GET ALL PRODUCTS
const getAllProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({})
    res.json(products)
})

// GET PRODUCT BY ID
const getProduct = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if(!product){
        res.status(400)
        throw new Error('Product not found')
    }

    res.status(200).json({
        message: "Product Found",
        product
    })
})

// ADD NEW PRODUCT
const AddNewProduct = asyncHandler(async(req, res) => {
    const { user, name, category, brand, description, price, countInStock, image, imgs, sizes } = req.body
    
    if(!user || !name || !brand || !description || !price || !countInStock){
        res.status(400)
        throw new Error(`Please Enter All Fields`)
    }

    if (!["SuperAdmin", "admin"].includes(req.user.role)) {
        return res.status(403).json({
            message: "Only Admins & SuperAdmins can Add a product"
        });
    }
    
    const coverImage = image || (imgs && imgs.length > 0 ? imgs[0] : '');

    const product = new Product({
        user,
        name,
        category,
        brand,
        description,
        price,
        countInStock,
        image: coverImage,
        imgs,
        sizes,
        reviews: [],
        rating: 0,
        numReviews: 0
    })

    const createdProduct = await product.save()

    res.status(201).json({
        success: true,
        message: "Product Added Successfuly",
        product: createdProduct
    })
})

// EDIT A PRODUCT

const editProduct = asyncHandler(async (req, res) => {
    const { user, name, category, brand, description, price, countInStock, image, imgs, sizes } = req.body
    const { id } = req.params;

    // if(!user || !name || !brand || !description || !price || !countInStock){
    //     res.status(400)
    //     throw new Error(`Please Enter All Fields`)
    // }

    if (!["SuperAdmin", "admin"].includes(req.user.role)) {
        return res.status(403).json({
            message: "Only Admins & SuperAdmins can update a product"
        });
    }

    const product = await Product.findOne({ _id: id})

    if(!product){
        res.status(400)
        throw new Error(`Product Not found`)
    }

    if (user) product.user = user;
    if (name) product.name = name;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (description) product.description = description;
    if (price) product.price = price;
    if (countInStock) product.countInStock = countInStock;
    if (imgs) product.imgs = imgs;
    if (sizes) product.sizes = sizes;

    product.image = image || (imgs && imgs.length > 0 ? imgs[0] : product.image);

    const updatedProduct = await product.save()

    res.status(201).json({
        message: "Product Updated Successfully",
        product: updatedProduct
    })
})

// DELETE A PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    const product = await Product.findOne({_id: id})

    if (!["SuperAdmin", "admin"].includes(req.user.role)) {
        return res.status(403).json({
            message: "Only Admins & SuperAdmins can delete a product"
        });
    }

    if(product){
        await product.deleteOne()
        res.status(200).json({
            message: 'Product Deleted Successfuly'
        })
    } else{
        throw new Error(`Product Not Found!`)
    }
})

// GET, FILTER & SEARCH ALL PRODUCTS
const searchProducts = asyncHandler(async (req, res) => {
    try {
      const query = req.query.q || '';
      const keywords = query.split(/\s+/).filter(Boolean);
      const regexes = keywords.map(k => new RegExp(k, 'i'));
      const limit = parseInt(req.query.limit) || 20;
      const page = parseInt(req.query.page) || 1;

      // FILTERING
      const category = req.query.category;
      const brand = req.query.brand;
      const minPrice = parseInt(req.query.minPrice) || 0;
      const maxPrice = parseInt(req.query.maxPrice);
      const size = parseInt(req.query.size)
      const minRating = parseFloat(req.query.minRating);
      const sort = req.query.sort || '';
      let sortOption = {};

      const skip = (page -1) * limit

      const andConditions = regexes.length > 0
        ? regexes.map(regex => ({
            $or: [
                { name: regex },
                { description: regex },
                { brand: regex },
                { category: regex },
                { tags: regex }
            ]
            }))
        : [];

        if (category) {
            andConditions.push({ category: new RegExp(`^${category}$`, 'i') });
        }
        if (brand) {
            andConditions.push({ brand: new RegExp(`^${brand}$`, 'i') });
        }
        if (!isNaN(size)) {
            andConditions.push({ sizes: size });
        }
        
        if (!isNaN(maxPrice)) {
            andConditions.push({ price: { $gte: minPrice, $lte: maxPrice } });
        } else {
            andConditions.push({ price: { $gte: minPrice } });
        }
        
        if (!isNaN(minRating)) {
            andConditions.push({ rating: { $gte: minRating } });
        }

        switch (sort) {
            case 'price_asc':
              sortOption = { price: 1 };
              break;
            case 'price_desc':
              sortOption = { price: -1 };
              break;
            case 'rating_desc':
              sortOption = { rating: -1 };
              break;
            case 'newest':
              sortOption = { createdAt: -1 };
              break;
          }

      const filterQuery = andConditions.length ? { $and: andConditions } : {};
  
      const products = await Product.find(filterQuery )
      .sort(sortOption)
      .limit(limit)
      .skip(skip)

      const totalCount = await Product.countDocuments(filterQuery );
  
      res.json({
        results: products,
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      });
    } catch (err) {
      console.error('Search Error:', err);
      res.status(500).json({ error: 'Server error' });
    }
});
  
module.exports = {  
    getAllProducts,
    AddNewProduct,
    deleteProduct,
    editProduct,
    getProduct,
    searchProducts
}
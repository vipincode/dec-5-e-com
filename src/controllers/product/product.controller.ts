import { Request, Response } from 'express';

import Category from '@models/category.model';
import Product from '@models/product.model';

export const createProduct = async (req: Request, res: Response) => {
  const productData = req.body;

  const category = await Category.findById(productData.category);
  if (!category) {
    res.status(400).json('Invalid Category!');
    return;
  }

  // Check if the file was uploaded
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: 'Image is required!' });
    return;
  }

  const product = new Product({
    name: productData.name,
    description: productData.description,
    richDescription: productData.richDescription,
    image: file.path.replace(/\\/g, '/'), // Normalize file path for different OS
    brand: productData.brand,
    price: productData.price,
    category: productData.category,
    countInStock: productData.countInStock,
    rating: productData.rating,
    numReviews: productData.numReviews,
    isFeatured: productData.isFeatured,
  });

  await product.save();

  if (!product) {
    res.status(400).send('Product cannot be created!');
  }

  res.status(201).send({ data: product });
};

export const getAllProduct = async (req: Request, res: Response) => {
  // http://localhost:5000/api/v1/product?categories=123,466,787

  let filter = {}; // if no category id pass it show all data

  if (typeof req.query.categories === 'string') {
    filter = { category: req.query.categories.split(',') };
  }

  const productList = await Product.find(filter).populate('category');

  if (!productList) {
    res.status(500).json({ success: false });
  }

  res.send({ data: productList });
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate('category');

  if (!product) {
    res.status(500).json({ message: 'No product available with this Id.' });
  }

  res.send({ data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const productData = req.body;

  const category = await Category.findById(productData.category);

  if (!category) {
    res.status(400).json('Invalid Category!');
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: productData.name,
      description: productData.description,
      richDescription: productData.richDescription,
      image: productData.image,
      brand: productData.brand,
      price: productData.price,
      category: productData.category,
      countInStock: productData.countInStock,
      rating: productData.rating,
      numReviews: productData.numReviews,
      isFeatured: productData.isFeatured,
    },
    {
      new: true,
    },
  );

  if (!product) {
    res.status(400).send('Product cannot be updated!');
  }

  res.status(201).send({ data: product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(500).send({ success: false });
  }

  res.send({ message: 'Product deleted!' });
};

export const getProductCount = async (req: Request, res: Response) => {
  const productCount = await Product.countDocuments({});

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
};

export const getFeaturedProduct = async (req: Request, res: Response) => {
  const count = req.params.count ? req.params.count : 0;

  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send({
    products: products,
  });
};

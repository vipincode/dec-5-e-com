import Category from '@models/category.model';
import { Request, Response } from 'express';

export const createCategory = async (req: Request, res: Response) => {
  const categoryData = req.body;

  const category = await Category.create({
    name: categoryData.name,
    icon: categoryData.icon,
    color: categoryData.color,
  });

  res.status(201).send({ data: category });
};

export const getAllCategory = async (req: Request, res: Response) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }

  res.status(200).send({ data: categoryList });
};

export const getCategory = async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(500).json({ message: 'Category with given id was not found.' });
  }

  res.status(200).send({ data: category });
};

export const updateCategory = async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.name,
      color: req.body.color,
    },
    { new: true }, // return new updated data
  );

  if (!category) {
    res.status(500).json({ message: 'Category cannot be created.' });
  }

  res.status(200).send({ data: category });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    res.status(500).send({ success: false });
  }

  res.send({ message: 'Category deleted!' });
};

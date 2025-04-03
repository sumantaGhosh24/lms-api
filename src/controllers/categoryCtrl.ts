import {Request, Response} from "express";

import Category, {ICategory} from "../models/categoryModel";
import Course from "../models/courseModel";

function createCategories(categories: ICategory[], parentId = null): any {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat: ICategory) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat: ICategory) => cat.parentId == parentId);
  }
  for (let cat of category) {
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      parentId: cat.parentId,
      image: cat.image,
      children: createCategories(categories, cat._id as any),
    });
  }
  return categoryList;
}

const categoryCtrl = {
  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await Category.find();
      const categoryList = createCategories(categories);

      res.json(categoryList);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getCategory: async (req: Request, res: Response) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        res.status(400).json({message: "Category does not exists."});
        return;
      }

      res.json(category);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  createCategory: async (req: Request, res: Response) => {
    try {
      const {name, image, parentId} = req.body;

      if (!name || !image) {
        res.status(400).json({message: "Please fill all fields."});
        return;
      }

      const category = await Category.findOne({name});
      if (category) {
        res.status(400).json({message: "This category already exists."});
        return;
      }

      const newCategory = new Category({
        name: name.toLowerCase(),
        image,
        parentId,
      });
      await newCategory.save();

      res.json({message: "Category Created successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  updateCategory: async (req: Request, res: Response) => {
    try {
      const {name, image, parentId} = req.body;

      const category = await Category.findById(req.params.id);
      if (!category) {
        res.status(400).json({message: "Category does not exists."});
        return;
      }

      if (name) category.name = name.toLowerCase();
      if (image) category.image = image;
      if (parentId !== "") category.parentId = parentId;
      await category.save();

      res.json({message: "Category updated successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  deleteCategory: async (req: Request, res: Response) => {
    try {
      const courses = await Course.findOne({category: req.params.id});
      if (courses) {
        res
          .status(400)
          .json({message: "Please delete all course of this category first."});
        return;
      }
      const category = await Category.find({parentId: req.params.id});
      if (category.length === 1) {
        res.status(400).json({
          message: "Please delete all sub categories of this category.",
        });
        return;
      }

      await Category.findByIdAndDelete(req.params.id);
      res.json({message: "Category deleted successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
};

export default categoryCtrl;

import {Request, Response} from "express";

import Course from "../models/courseModel";
import {APIFeatures} from "../lib";
import {IReqAuth} from "../types";

const courseCtrl = {
  getCourses: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(
        Course.find()
          .select("-chapters")
          .populate("owner", "_id username email mobileNumber image")
          .populate("category", "_id name image"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const features2 = new APIFeatures(Course.find(), req.query)
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const courses = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.status(200).json({courses, count});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getCourse: async (req: Request, res: Response) => {
    try {
      const course = await Course.findById(req.params.id)
        .select("-chapters")
        .populate("owner", "_id username email mobileNumber image")
        .populate("category", "_id name image");
      if (!course) {
        res.status(404).json({message: "Course not found."});
        return;
      }

      res.status(200).json(course);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getCoursesAdmin: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(
        Course.find()
          .populate("owner", "_id username email mobileNumber image")
          .populate("category", "_id name image"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const features2 = new APIFeatures(Course.find(), req.query)
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const courses = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.status(200).json({courses, count});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getCourseAdmin: async (req: Request, res: Response) => {
    try {
      const course = await Course.findById(req.params.id)
        .populate("owner", "_id username email mobileNumber image")
        .populate("category", "_id name image");
      if (!course) {
        res.status(404).json({message: "Course not found."});
        return;
      }

      res.status(200).json(course);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  createCourse: async (req: IReqAuth, res: Response) => {
    try {
      const owner = req.user?._id;
      const {
        title,
        description,
        content,
        category,
        price,
        thumbnail,
        chapters,
      } = req.body;

      if (
        !title ||
        !description ||
        !content ||
        !category ||
        !price ||
        !thumbnail ||
        !chapters
      ) {
        res.status(400).json({message: "Please fill all fields."});
        return;
      }

      const newCourse = new Course({
        owner: owner,
        title: title.toLowerCase(),
        description: description.toLowerCase(),
        content,
        category,
        price,
        thumbnail,
        chapters,
      });
      await newCourse.save();

      res.json({message: "Course Created successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  updateCourse: async (req: Request, res: Response) => {
    try {
      const {title, description, content, category, price, thumbnail} =
        req.body;

      const course = await Course.findById(req.params.id);
      if (!course) {
        res.status(400).json({message: "Course does not exists."});
        return;
      }

      if (title) course.title = title.toLowerCase();
      if (description) course.description = description.toLowerCase();
      if (content) course.content = content;
      if (category) course.category = category;
      if (price) course.price = price;
      if (thumbnail) course.thumbnail = thumbnail;
      await course.save();

      res.json({message: "Course updated successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  addChapters: async (req: Request, res: Response) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        res.status(400).json({message: "Course does not exists."});
        return;
      }

      course.chapters = [...course.chapters, ...req.body.chapters];
      await course.save();

      res.json({message: "Chapters added successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  removeChapters: async (req: Request, res: Response) => {
    try {
      const {id} = req.body;

      if (!id) {
        res.status(400).json({message: "Please select an chapter."});
        return;
      }

      const course = await Course.findById(req.params.id);
      if (!course) {
        res.status(400).json({message: "Course does not exists."});
        return;
      }

      course.chapters = course.chapters.filter((chapter) => chapter._id !== id);
      await course.save();

      res.json({message: "Chapter removed successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  deleteCourse: async (req: Request, res: Response) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        res.status(400).json({message: "Course does not exists."});
        return;
      }

      await Course.findByIdAndDelete(req.params.id);

      res.json({message: "Course deleted successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
};

export default courseCtrl;

import {Request, Response} from "express";

import Review from "../models/reviewModel";
import {APIFeatures} from "../lib";
import {IReqAuth} from "../types";

const reviewCtrl = {
  getReviews: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(
        Review.find().populate("course", "_id title description thumbnail"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const features2 = new APIFeatures(Review.find(), req.query)
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const reviews = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.status(200).json({reviews, count});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getCourseReview: async (req: Request, res: Response) => {
    try {
      const review = await Review.findById(req.params.course)
        .populate("course", "_id title description thumbnail")
        .populate("user", "_id username email mobileNumber image");
      if (!review) {
        res.status(404).json({message: "Review not found."});
        return;
      }

      res.status(200).json(review);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getUserReview: async (req: Request, res: Response) => {
    try {
      const review = await Review.find({user: req.params.user})
        .populate("course", "_id title description thumbnail")
        .populate("user", "_id username email mobileNumber image");
      if (!review) {
        res.status(404).json({message: "Review not found."});
        return;
      }

      res.status(200).json(review);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  createReview: async (req: IReqAuth, res: Response) => {
    try {
      const {course, comment, rating} = req.body;

      if (!course || !comment || !rating) {
        res.status(400).json({message: "Please fill all fields."});
        return;
      }

      const newReview = new Review({
        course,
        user: req.user?._id as any,
        comment,
        rating,
      });
      await newReview.save();

      res.json({message: "Review Created successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
};

export default reviewCtrl;

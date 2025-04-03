import mongoose, {Document} from "mongoose";

import {ICourse} from "./courseModel";
import {IUser} from "./userModel";

export interface IReview extends Document {
  course: ICourse;
  user: IUser;
  comment: string;
  rating: number;
}

const reviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    comment: {type: String, required: true},
    rating: {type: Number, required: true},
  },
  {timestamps: true}
);

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;

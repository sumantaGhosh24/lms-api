import mongoose, {Document} from "mongoose";

import {ICategory} from "./categoryModel";
import {IUser} from "./userModel";

export interface ICourse extends Document {
  owner: IUser;
  title: string;
  description: string;
  content: string;
  thumbnail: {
    url: string;
    public_id: string;
  };
  chapters: {
    _id: string;
    title: string;
    description: string;
    content: string;
    thumbnail: {
      url: string;
      public_id: string;
    };
    video: {
      url: string;
      public_id: string;
    };
  }[];
  category: ICategory;
  price: number;
}

const courseSchema = new mongoose.Schema(
  {
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    title: {type: String, trim: true, required: true},
    description: {type: String, trim: true, required: true},
    content: {type: String, trim: true, required: true},
    thumbnail: {url: String, public_id: String},
    chapters: [
      {
        title: String,
        description: String,
        content: String,
        thumbnail: {
          url: String,
          public_id: String,
        },
        video: {
          url: String,
          public_id: String,
        },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    price: {type: Number, required: true},
  },
  {timestamps: true}
);

courseSchema.index({title: "text", price: "text", category: "text"});

const Course = mongoose.model<ICourse>("Course", courseSchema);

export default Course;

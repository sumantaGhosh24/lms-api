import mongoose, {Document} from "mongoose";

import {ICourse} from "./courseModel";
import {IUser} from "./userModel";

export interface IOrder extends Document {
  user: IUser;
  course: ICourse;
  paymentResult: {
    id: string;
    status: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
  price: number;
  details: {
    complete: number;
    completed: string[];
  };
}

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    paymentResult: {
      id: {type: String},
      status: {type: String},
      razorpay_order_id: {type: String},
      razorpay_payment_id: {type: String},
      razorpay_signature: {type: String},
    },
    price: {type: Number, required: true},
    details: {complete: Number, completed: [String]},
  },
  {timestamps: true}
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;

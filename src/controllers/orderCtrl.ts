import {Request, Response} from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

import {IReqAuth} from "../types";
import {APIFeatures} from "../lib";
import Order, {IOrder} from "../models/orderModel";

dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const orderCtrl = {
  getRazorpay: async (req: Request, res: Response) => {
    try {
      const {amount} = req.body;
      const options = {
        amount: Number(amount * 100),
        currency: "INR",
      };

      const order = await instance.orders.create(options);
      if (!order) {
        res.status(500).json({message: "server error"});
        return;
      }

      res.json(order);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  verification: async (req: IReqAuth, res: Response) => {
    try {
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        amount,
        course,
      } = req.body;
      const user = req?.user?._id;

      const shasum = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      );
      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
      const digest = shasum.digest("hex");
      if (digest !== razorpaySignature) {
        res.status(400).json({message: "Transaction not legit!"});
        return;
      }

      const newOrder = new Order({
        user: user,
        course,
        paymentResult: {
          id: orderCreationId,
          status: "success",
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        },
        price: amount,
      });
      await newOrder.save();

      res.json({
        message: "success",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      });
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getOrders: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(
        Order.find()
          .populate("user", "_id username email mobileNumber image")
          .populate("course"),
        req.query
      );
      const features2 = new APIFeatures(Order.find(), req.query);

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const orders = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.status(200).json({orders, count});
      return;
    } catch (error: any) {
      res.status(500).json({msg: error.message});
      return;
    }
  },
  getUserOrders: async (req: IReqAuth, res: Response) => {
    try {
      const features = new APIFeatures(
        Order.find({user: req.user?._id})
          .populate("user", "_id username email mobileNumber image")
          .populate("course"),
        req.query
      );
      const features2 = new APIFeatures(
        Order.find({user: req.user?._id}),
        req.query
      );

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const orders = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.status(200).json({orders, count});
      return;
    } catch (error: any) {
      res.status(500).json({msg: error.message});
      return;
    }
  },
  getOrder: async (req: Request, res: Response) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate("user", "_id username email mobileNumber image")
        .populate("course");

      if (!order) {
        res.status(400).json({msg: "This Order doest not Exists."});
        return;
      }

      res.json(order);
      return;
    } catch (error: any) {
      res.status(500).json({msg: error.message});
      return;
    }
  },
  updateOrder: async (req: Request, res: Response) => {
    try {
      const {details} = req.body;

      if (!details) {
        res.status(400).json({msg: "Details is required."});
        return;
      }

      const order = await Order.findById(req.params.id);

      if (!order) {
        res.status(400).json({msg: "This Order doest not Exists."});
        return;
      }

      await Order.findByIdAndUpdate(req.params.id, {
        details,
      });

      res.json(order);
      return;
    } catch (error: any) {
      res.status(500).json({msg: error.message});
      return;
    }
  },
};

export default orderCtrl;

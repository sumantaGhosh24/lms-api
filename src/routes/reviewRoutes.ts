import express from "express";

import reviewCtrl from "../controllers/reviewCtrl";
import auth from "../middleware/auth";
import authAdmin from "../middleware/authAdmin";

const router = express.Router();

router.get("/reviews", authAdmin, reviewCtrl.getReviews);

router.get("/review/:course", reviewCtrl.getCourseReview);

router.get("/review/user/:user", reviewCtrl.getUserReview);

router.post("/review/:course", auth, reviewCtrl.createReview);

export default router;

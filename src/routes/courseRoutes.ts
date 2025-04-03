import express from "express";

import courseCtrl from "../controllers/courseCtrl";
import authAdmin from "../middleware/authAdmin";

const router = express.Router();

router.get("/courses", courseCtrl.getCourses);

router.get("/course/:id", courseCtrl.getCourse);

router.get("/admin/courses", authAdmin, courseCtrl.getCoursesAdmin);

router.get("/admin/course/:id", authAdmin, courseCtrl.getCourseAdmin);

router.post("/course", authAdmin, courseCtrl.createCourse);

router.put("/course/:id", authAdmin, courseCtrl.updateCourse);

router.patch("/add-chapters/:id", authAdmin, courseCtrl.addChapters);

router.patch("/remove-chapters/:id", authAdmin, courseCtrl.removeChapters);

router.delete("/course/:id", authAdmin, courseCtrl.deleteCourse);

export default router;

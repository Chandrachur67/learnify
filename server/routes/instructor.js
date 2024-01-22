const router = require("express").Router();
const authenticateGeneral = require("../middlewares/authenticationGeneral");
const authenticateInstructor = require("../middlewares/instructor");
const instructorController = require("../controller/instructorController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/signup", upload.single("profileImage"), instructorController.signuppost);

router.post("/login", instructorController.loginpost);

router.get("/", authenticateGeneral, instructorController.getAllInstructors);

router.get("/getInstructor/:id", authenticateGeneral, instructorController.getInstructorWithId);

router.post("/getInstructorCourses/:id", authenticateGeneral, instructorController.getInstructorCourses);

router.post("/getInstructorVideos/:id", authenticateGeneral, instructorController.getInstructorVideos);

router.use(authenticateInstructor);

router.get("/getInstructorData", instructorController.getInstructorData);

// router.get("/getInstructorProfileImage/:id", authenticateGeneral, instructorController.getInstructorProfileImage);


// router.post("/instructor/uploadSection", upload.single("image"), instructorController.uploadSection);

// router.post("/instructor/updateVideo" ,upload.single("image"), instructorController.updateVideo);
// router.post("/instructor/updateSection", upload.single("image"), instructorController.updateSection);
// router.post("/instructor/updateCourse", upload.single("image"), instructorController.updateCourse);

// router.post("/instructor/deleteVideo" ,upload.single("image"), instructorController.deleteVideo);
// router.post("/instructor/deleteSection", upload.single("image"), instructorController.deleteSection);
// router.post("/instructor/deleteCourse", upload.single("image"), instructorController.deleteCourse);


module.exports = router;
const Instructor = require("../models/instructor");
const VideoLecture = require("../models/videoLecture");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const Post = require("../models/post");
const mongoose = require("mongoose");
const { Readable } = require('stream');
const cloudinary = require('cloudinary').v2;

const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'doubts',
  });
});

// Configure Cloudinary with your credentials
// import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'desdkbhvz', 
  api_key: '822224579263365', 
  api_secret: 'kTX01qyk21TXjM3YPAdBd4YN6ps' 
});

module.exports.signuppost = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const profileImage = req.file;

    const profileImageUrl = await uploadToCloudinary(profileImage);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingInstructor = await Instructor.findOne({ email });
    if (existingInstructor) {
      return res.status(400).json({
        message: "Instructor with this eamil alread exists!"
      })
    }

    const instructor = new Instructor({
      username: username,
      email: email,
      password: hashedPassword,
      profileImage: profileImageUrl,
    });

    await instructor.save();

    res.status(200).json({
      message: "Sucessfully registered. Awaiting approval",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "There is some problem at our end. Please retry",
    });
  }
}


module.exports.loginpost = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const instructor = await Instructor.findOne({ email: email });
    console.log("hello from login" + instructor);

    const validPassword = await bcrypt.compare(password, instructor.password);

    if (!instructor) {
      return res.status(404).send("Instructor Not Present");
    }

    if (!validPassword) {
      return res.status(404).send("Invalid Password");
    }

    if(!instructor.isApproved) {
      return res.status(401).send("Approval pending!");
    }

    const token = jwt.sign(
      { 
        id: instructor.id, 
        role: "instructor" 
      }, 
      process.env.INSTRUCTOR_JWT_SECRET, 
      { expiresIn: '1h' }
    );


    res.status(200).json({
      message: "Login successfull",
      token: token
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "There is some problem at our end. Please retry",
    });
  }
};


module.exports.getInstructorData = async (req, res) => {
  try {
    const id = req.user.id;
    const instructor = await Instructor.findById(id);

    return res.status(200).json({
      id: instructor.id,
      username: instructor.username,
      email: instructor.email,
      role: "instructor",
      profileImage: instructor.profileImage
    });
    
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Authorization failed"
    })
  }
}


module.exports.uploadVideo = async (req, res) => {
  try {
    console.log("here");
    const videoFile = req.files['video'][0];
    const thumbnail = req.files['thumbnail'][0];

    const videoFileUrl = await uploadToCloudinary(videoFile);
    const thumbnailUrl = await uploadToCloudinary(thumbnail);

    const videoLecture = new VideoLecture({
      title: req.body.title,
      description: req.body.description,
      duration: 10,
      // duration: req.body.duration,
      videoFile: videoFileUrl,
      thumbnail: thumbnailUrl
    });

    console.log("here2");

    const result = await videoLecture.save();
    // add video to instructor data
    Instructor.findOneAndUpdate(
      { email: req.user.email },
      { $push: { videoLectures: result._id } }
    ).then((err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
    
        console.log("Video added to instructor");
        return res.status(200).json({ message: "Video added successfully" });
      });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Function to upload file to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' },
          (error, result) => {
              if (error) reject(error);
              resolve(result.secure_url);
          })
          .end(file.buffer);
  });
};

// module.exports.createSection = async (req, res) => {
//   try {
//     const { courseId, title, description } = req.body;

    
//   }
// }

// app.post('/api/create-course', upload.array('videoFile'), async (req, res) => {
//   try {
//     const { title, description, duration, price, level, category, thumbnail, publishedDate, sections } = req.body;

//     // Process file uploads to Cloudinary and create VideoLecture objects
//     const processedLectures = await Promise.all(
//       req.files.map(async (file) => {
//         const uploadedVideo = await cloudinary.uploader.upload_stream(
//           { resource_type: 'video', folder: 'your-folder-name' },
//           (error, result) => {
//             if (error) throw error;
//             return result.secure_url;
//           }
//         );

//         const newVideoLecture = new VideoLecture({
//           title,
//           description,
//           duration,
//           videoFile: uploadedVideo,
//           thumbnail,
//           resources: [], // Assuming you don't handle resources in this example
//           like: 0,
//           comments: [],
//         });

//         // Save the new VideoLecture to the database
//         await newVideoLecture.save();

//         return newVideoLecture._id; // Return the ObjectId of the new VideoLecture
//       })
//     );

//     // Create a new section with the processed VideoLecture objects
//     const newSection = new Section({
//       title,
//       description,
//       videoLectures: processedLectures,
//     });

//     // Save the new section to the database
//     await newSection.save();

//     // Create a new course with the processed data
//     const newCourse = new Course({
//       title,
//       description,
//       duration,
//       price,
//       level,
//       category,
//       thumbnail,
//       publishedDate,
//       sections: [newSection._id], // Reference the new section
//     });
// 
//     // Save the new course to the database
//     await newCourse.save();

//     res.status(201).json({ message: 'Course created successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

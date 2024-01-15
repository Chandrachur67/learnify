const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
    title: { type: String, required: true },
    description: String,
    videoLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VideoLecture' }],
  });
  

  const Section = mongoose.model("Section", sectionSchema);

  module.exports = Section;
  
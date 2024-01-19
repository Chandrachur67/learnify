// AddSectionForm.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './AddSectionForm.css'

const AddSectionForm = ({ setCourseDetails, handleAddSectionClick }) => {
  const { courseId } = useParams();

  console.log(courseId);
  const [sectionDetails, setSectionDetails] = useState({
    title: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSectionDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('title', sectionDetails.title);
    formData.append('description', sectionDetails.description);

    const res = await fetch('http://localhost:8000/course/createSection', {
      method: 'POST',
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    console.log(data.ok);

    if (data.ok) {
      // const sectionId = data.sectionId;

      setCourseDetails((prevCourseDetails) => {
        return {
          ...prevCourseDetails,
          sections: [
            ...prevCourseDetails.sections,
            data.section
          ]
        };
      });

      setSectionDetails({
        title: '',
        description: '',
      });
      handleAddSectionClick();
      // show toast success
      // navigate(`/course/${courseId}/edit`);
    } else {
      // show toast err
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Section Title:
        <input type="text" name="title" value={sectionDetails.title} onChange={handleChange} required />
      </label>
      <label>
        Section Description:
        <textarea name="description" value={sectionDetails.description} onChange={handleChange} required />
      </label>
      <button type="submit">Save Section</button>
    </form>
  );
};

export default AddSectionForm;

import { useState } from "react";

const EditJobPage = () => {
  const [formData, setFormData] = useState({
    title: "Frontend Developer",
    company: "Google",
    description: "Edit Job Description",
    requirements: "React, JavaScript",
    location: "Cairo",
    type: "full-time",
    salary: 15000,
    totalSlots: 5
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Job Updated!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Job</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />
        <br /><br />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="number"
          name="totalSlots"
          value={formData.totalSlots}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">
          Update Job
        </button>

      </form>
    </div>
  );
};

export default EditJobPage;

import { useState } from "react";

const CreateJobPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    location: "",
    type: "",
    salary: "",
    totalSlots: ""
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

    alert("Job Created!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Job</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="company"
          placeholder="Company"
          onChange={handleChange}
        />
        <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="requirements"
          placeholder="Requirements"
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="type"
          placeholder="Type"
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="number"
          name="totalSlots"
          placeholder="Total Slots"
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">
          Create Job
        </button>

      </form>
    </div>
  );
};

export default CreateJobPage;

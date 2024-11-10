import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "../styles/EmployeeForm.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "HR",
    course: "MCA",
    gender: "Male",
    image: null,
  });

  useEffect(() => {
    if (id && id !== "createNew") {
      axios
        .get(`http://localhost:5000/api/employees/${id}`)
        .then((response) => {
          const { name, email, mobile, designation, course, gender, image } =
            response.data.data;
          setFormData({
            name: name || "",
            email: email || "",
            mobile: mobile || "",
            designation: designation || "HR",
            course: course || "MCA",
            gender: gender || "Male",
            image: image || null,
          });
        })
        .catch((error) => console.log("Error fetching employee data:", error));
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, mobile, designation, course, gender, image } =
      formData;
    const formPayload = new FormData();
    formPayload.append("name", name);
    formPayload.append("email", email);
    formPayload.append("mobile", mobile);
    formPayload.append("designation", designation);
    formPayload.append("course", course);
    formPayload.append("gender", gender);
    if (image) formPayload.append("image", image);

    if (id && id !== "createNew") {
      axios
        .put(`http://localhost:5000/api/employees/edit/${id}`, formPayload)
        .then(() => {
          toast.success("Employee updated successfully");
          navigate("/employees");
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.errors) {
            const errorMessages = error.response.data.errors.join(", ");
            toast.error(`Validation errors: ${errorMessages}`);
          } else {
            toast.error("Error updating employee");
          }
          console.log("Error updating employee:", error);
        });
    } else {
      axios
        .post("http://localhost:5000/api/employees/create", formPayload)
        .then(() => {
          toast.success("Employee created successfully");
          navigate("/employees");
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.errors) {
            const errorMessages = error.response.data.errors.join(", ");
            toast.error(`Validation errors: ${errorMessages}`);
          } else {
            toast.error("Error creating employee");
          }
          console.log("Error creating employee:", error);
        });
    }
  };

  return (
    <div className={style.mainForm}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleInputChange}
        />
        <label>Mobile No.</label>
        <input
          type="tel"
          name="mobile"
          value={formData.mobile || ""}
          onChange={handleInputChange}
        />
        <label>Designation</label>
        <select
          name="designation"
          value={formData.designation || "HR"}
          onChange={handleInputChange}
        >
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Sales">Sales</option>
        </select>
        <label>Course</label>
        <select
          name="course"
          value={formData.course || "MCA"}
          onChange={handleInputChange}
        >
          <option value="MCA">MCA</option>
          <option value="BCA">BCA</option>
          <option value="BSC">BSC</option>
        </select>
        <label>Gender</label>
        <div>
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={formData.gender === "Male"}
            onChange={handleInputChange}
          />
          Male
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={formData.gender === "Female"}
            onChange={handleInputChange}
          />
          Female
        </div>
        <label>Profile Pic</label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          name="image"
        />
        <button type="submit">
          {id && id !== "createNew" ? "Update Employee" : "Create Employee"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EmployeeForm;

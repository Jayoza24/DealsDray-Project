import { useEffect, useState } from "react";
import style from "../styles/EmployeeListStyle.module.css";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [employeesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    getEmployees(currentPage, searchTerm, sortBy, sortOrder);
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const getEmployees = (page, search, sortBy, order) => {
    axios
      .get(
        `http://localhost:5000/api/employees/find?page=${page}&limit=${employeesPerPage}&sortBy=${sortBy}&order=${order}&search=${search}`
      )
      .then((res) => {
        const formattedEmployees = res.data.employees.map((employee) => {
          return {
            ...employee,
            createDate: format(new Date(employee.createDate), "dd-MMM-yyyy"),
          };
        });
        setEmployees(formattedEmployees);
        setTotalEmployees(res.data.total);
      })
      .catch((err) => console.log(err));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };

  const handleSortOrderChange = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  const deleteEmployee = (id) => {
    axios
      .delete(`http://localhost:5000/api/employees/delete/${id}`)
      .then((res) => {
        alert(res.data.message);
        location.reload();
      });
  };

  const totalPages = Math.ceil(totalEmployees / employeesPerPage);

  return (
    <div className={style.mainContainer}>
      <div className={style.empHeader}>
        <span>
          <b>Employees</b>
        </span>
        <div className={style.searchContainer}>
          <div className={style.search}>
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div>
          <span>Total: {totalEmployees}</span>
          <button onClick={() => navigate("/employees/createNew")}>
            Create Employee
          </button>
        </div>
      </div>
      <div className={style.sorting}>
        <label>
          <b>Sort By :</b>
        </label>
        <select onChange={handleSortChange} value={sortBy}>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="course">Course</option>
          <option value="createDate">Create Date</option>
        </select>
        <button onClick={handleSortOrderChange}>
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Unique Id</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile No</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Create Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee._id}</td>
                <td>
                  <img
                    src={employee.imageUrl}
                    alt={`${employee.name}'s profile`}
                    width="50"
                    height="50"
                  />
                </td>
                <td>{employee.name}</td>
                <td>
                  <a href={`mailto:${employee.email}`}>{employee.email}</a>
                </td>
                <td>
                  <a href={`tel:+91${employee.mobile}`}>{employee.mobile}</a>
                </td>
                <td>{employee.designation}</td>
                <td>{employee.gender}</td>
                <td>{employee.course}</td>
                <td>{employee.createDate}</td>
                <td className={style.actionButtons}>
                  <button
                    onClick={() => navigate(`/employees/${employee._id}`)}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteEmployee(employee._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={style.pagination}>
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </button>
        )}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? style.active : ""}
          >
            {index + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;

const multer = require("multer");
const path = require("path");
const Employee = require("../models/Employee");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const mobileRegex = /^[0-9]{10}$/;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only .jpg and .png files are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

const validateEmployeeData = (data) => {
  const { name, email, mobile, designation, course, gender } = data;
  const errors = [];

  if (!name || name.trim() === '') errors.push("Name is required.");
  if (!email || !emailRegex.test(email)) errors.push("Invalid email format.");
  if (!mobile || !mobileRegex.test(mobile)) errors.push("Invalid mobile number.");
  if (!designation || designation.trim() === '') errors.push("Designation is required.");
  if (!course || course.trim() === '') errors.push("Course is required.");
  if (!gender || gender.trim() === '') errors.push("Gender is required.");

  return errors;
};

const createEmployee = async (req, res) => {
  const { name, email, mobile, designation, course, gender } = req.body;

  const validationErrors = validateEmployeeData(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ message: "Validation errors", errors: validationErrors });
  }

  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const image = req.file ? req.file.filename : null;

  try {
    const newEmployee = new Employee({
      name,
      email,
      mobile,
      designation,
      course,
      gender,
      image,
    });

    await newEmployee.save();
    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating employee", error: error.message });
  }
};

const editEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, designation, course, gender } = req.body;

  const validationErrors = validateEmployeeData(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ message: "Validation errors", errors: validationErrors });
  }

  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee && existingEmployee._id.toString() !== id) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const image = req.file ? req.file.filename : null;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.mobile = mobile || employee.mobile;
    employee.designation = designation || employee.designation;
    employee.course = course || employee.course;
    employee.gender = gender || employee.gender;

    if (image) {
      employee.image = image;
    }

    await employee.save();
    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error: error.message });
  }
};

const getEmployeeData = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const imageUrl = employee.image
      ? `${req.protocol}://${req.get("host")}/uploads/${employee.image}`
      : null;

    res.status(200).json({
      data: { ...employee.toObject(), imageUrl },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error finding employee", error: error.message });
  }
};

const searchEmployees = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      sortBy = "name",
      order = "asc",
      mobile,
    } = req.query;

    let query = {};

    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (mobile) {
      query.mobile = mobile;
    }

    let sortOrder = 1;
    if (order === "desc") {
      sortOrder = -1;
    }

    const employees = await Employee.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Employee.countDocuments(query);

    const employeesWithImage = employees.map((employee) => {
      const imageUrl = employee.image
        ? `${req.protocol}://${req.get("host")}/uploads/${employee.image}`
        : null;
      return { ...employee.toObject(), imageUrl };
    });

    res.json({
      employees: employeesWithImage,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employees", error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting employee", error: error.message });
  }
};

module.exports = {
  createEmployee,
  editEmployee,
  deleteEmployee,
  getEmployeeData,
  searchEmployees,
  upload,
};

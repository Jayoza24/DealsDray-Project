const express = require("express");
const {
  createEmployee,
  editEmployee,
  deleteEmployee,
  searchEmployees,
  getEmployeeData,
  upload
} = require("../controller/employeeController");
const router = express.Router();

router.post('/create', upload.single('image'), createEmployee);
router.put('/edit/:id', upload.single('image'), editEmployee);
router.delete("/delete/:id", deleteEmployee);
router.get("/find", searchEmployees);
router.get("/:id",getEmployeeData)

module.exports = router;

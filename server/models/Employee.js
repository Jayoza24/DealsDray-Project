const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  image: { type: String, require: true },
  name: { type: String, require: true },
  email: { type: String, require: true },
  mobile: {
    type: Number,
    require: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  designation: { type: String, require: true },
  course: { type: String, require: true },
  createDate: { type: Date, require: true, default: Date.now },
  gender: { type: String, require: true },
  status: { type: String, require: true },
  image: { type: String, default: null },
});

module.exports = mongoose.model("Employee", employeeSchema);

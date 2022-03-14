const Validator = require("validator");
const isEmpty = require("../utils/is-Empty");

module.exports = function validateStack(data) {
  let errors = {};

  data.ID = !isEmpty(data.ID) ? data.ID : "";
  data.amount = !isEmpty(data.amount) ? data.amount : "";
  data.duration = !isEmpty(data.duration) ? data.duration : "";
  if (Validator.isEmpty(data.ID)) {
    errors.ID = "ID field is required";
  }
  if (Validator.isEmpty(data.amount)) {
    errors.stackamount = "Amount field is required";
  }
  if (Validator.isEmpty(data.duration)) {
    errors.duration = "Duration field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const Validator = require("validator");
const isEmpty = require("../utils/is-Empty");

module.exports = function validateEarn(data) {
  let errors = {};

  data.ID = !isEmpty(data.ID) ? data.ID : "";

  if (Validator.isEmpty(data.ID)) {
    errors.ID = "ID field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

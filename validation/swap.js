const Validator = require("validator");
const isEmpty = require("../utils/is-Empty");

module.exports = function validateSwap(data) {
  let errors = {};

  data.ID = !isEmpty(data.ID) ? data.ID : "";
  data.amount = !isEmpty(data.amount) ? data.amount : "";

  if (Validator.isEmpty(data.ID)) {
    errors.ID = "ID field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

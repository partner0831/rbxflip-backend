const Validator = require("validator");
const isEmpty = require("../utils/is-Empty");

module.exports = function validateTransferInput(data) {
  let errors = {};

  data.owneraddress = !isEmpty(data.owneraddress) ? data.owneraddress : "";
  data.flag = !isEmpty(data.flag) ? data.flag : "";
  data.toaddress = !isEmpty(data.toaddress) ? data.toaddress : "";

  if (Validator.isEmpty(data.owneraddress)) {
    errors.owneraddress = "Address field is required";
  }
  if (Validator.isEmpty(data.flag)) {
    errors.flag = "Select token field is required";
  }
  if (Validator.isEmpty(data.toaddress)) {
    errors.address = "Address field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

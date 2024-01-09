const validations_options = [
  // check if value pass year
  {
    attribute: "id",
    isValid: (input) => {
      input.id !== "year";
      const today = new Date();
      // calculate raw differences
      return today.getFullYear() >= input.value;
    },
    errorMessage: () => `Must be in the past`,
  },
  // check if value pass minlength
  {
    attribute: "max",
    isValid: (input) => {
      return input.max >= input.value && input.min <= input.value;
    },
    errorMessage: (input) => `Must be a valid ${input.name}`,
  },
  // check if value pass required
  {
    attribute: "required",
    isValid: (input) => input.value.trim() !== "",
    errorMessage: () => `This field is required`,
  },
];

const form = document.getElementById("form");

const formElement = document.querySelector("#form");
// disabling HTML standart validation
formElement.setAttribute("novalidate", "");
//adding our validation
formElement.addEventListener("submit", (event) => {
  // prevent page reload after submit
  event.preventDefault();
  // go to validation all inputs
  validateAllFormGroups(formElement);
});

function validateAllFormGroups(formToValidate) {
  const formGroups = Array.from(
    formToValidate.querySelectorAll(".input-control")
  );

  // variable for check error for all forms together
  let allFormGroupsValid = true;

  //   loop through array
  formGroups.forEach((formGroup) => {
    validateSingleFormGroup(formGroup);

    if (formGroup.querySelector(".error").textContent) {
      allFormGroupsValid = false;
    }
  });

  if (!allFormGroupsValid) return;

  const input = document.querySelectorAll("input");
  input.forEach((input) => {
    input.classList.remove("border-danger-subtle");
  });

  const { years, months, days } = calculateAge();
  displayAge({ years, months, days });
}

function validateSingleFormGroup(formGroup) {
  // select input, label, error img and error class
  const label = formGroup.querySelector("label");
  const input = formGroup.querySelector("input");
  const errorContainer = formGroup.querySelector(".error");

  //   set no error to the input
  let formGroupError = false;
  // validation rules that loop through then check the input egainst each of rules and trigger right error message

  const { inputError: optionsError, errorMessage: optionsErrorMessage } =
    validateOptions(input, errorContainer);

  if (optionsError) {
    errorContainer.textContent = optionsErrorMessage;
    errorStyling({ errorContainer, input, label });
    formGroupError = true;
  }

  // Check for valid day based on the month
  if (input.id === "day" && input.value) {
    const { inputError: dateInputError, errorMessage: dateInputErrorMessage } =
      validateDateInput(input);

    if (dateInputError) {
      errorContainer.textContent = dateInputErrorMessage;
      errorStyling({ errorContainer, input, label });
      formGroupError = true;
    }
  }

  //   remove error border and icon from input if here is no error
  if (!formGroupError) {
    label.classList.remove("error-label");
    errorContainer.textContent = "";
  }
}

// helper functions
//Sergii: I have extracted the functions outside and used function keyword instead of arrow function
// so that they are hoisted and can be used before they are defined
// you can read more here https://codecryrepeat.hashnode.dev/imagine-execution-context-and-hoisting (shameless plug)
function validateOptions(input) {
  //   set no error to the input
  let inputError = false;
  let errorMessage = "";
  // validation rules that loop through then check the input egainst each of rules and trigger right error message
  for (const option of validations_options) {
    if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
      errorMessage = option.errorMessage(input);
      inputError = true;
    }
  }

  return {
    inputError,
    errorMessage,
  };
}

function validateDateInput(input) {
  const day = parseInt(input.value);
  const month = parseInt(document.getElementById("month").value);

  let errorMessage = "";
  let inputError = false;

  // Check if day is within valid range for the selected month
  if (day < 1 || day > getDaysInMonth(month) || day > 31) {
    errorMessage = "Must be a valid day";
    inputError = true;
  }

  return {
    inputError,
    errorMessage,
  };
}

function calculateAge() {
  const day = document.getElementById("day").value;
  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;

  const currentDate = new Date();
  const birthDate = new Date(year, month - 1, day);

  const ageInMilliseconds = currentDate - birthDate;

  const ageDate = new Date(ageInMilliseconds);
  const years = Math.abs(ageDate.getUTCFullYear() - 1970);
  const months = ageDate.getUTCMonth();
  const days = ageDate.getUTCDate() - 1;

  return { years, months, days };
}

function displayAge({ years, months, days }) {
  document.getElementById("years").innerText = years;
  document.getElementById("months").innerText = months;
  document.getElementById("days").innerText = days;
}

function errorStyling({ errorContainer, input, label }) {
  errorContainer.style.display = "block";
  //   add red border around input
  input.classList.add("border-danger-subtle");

  //   change position for button
  if (window.innerWidth <= 500) {
    // styles for mobile devices
    document.querySelector("button").style.top = "117px";
  } else {
    document.querySelector("button").style.top = "87px";
  }

  label.classList.add("error-label");
}

// Function to get the number of days in a month, considering leap years
function getDaysInMonth(month) {
  const leapYear = (year) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust February's days for leap years
  if (month === 2) {
    const year = parseInt(document.getElementById("year").value);
    return leapYear(year) ? 29 : 28;
  }

  return daysInMonth[month - 1];
}

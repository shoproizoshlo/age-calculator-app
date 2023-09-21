const form = document.getElementById("form");

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

  document.getElementById("years").innerText = `${years}`;
  document.getElementById("months").innerText = `${months}`;
  document.getElementById("days").innerText = `${days}`;
}

// creating function that get form selector
const validateForm = (formSelector) => {
  const formElement = document.querySelector(formSelector);

  // items in array have object and 3 properties
  const validationOptions = [
    // check if value pass minlength
    // {
    //   attribute: "id",
    //   isValid: (input) => {
    //     input.id === "day" && input.value;
    //     const day = parseInt(input.value);
    //     const month = parseInt(document.getElementById("month").value);
    //     return day < 1 || day > getDaysInMonth(month);
    //   },
    //   errorMessage: (input) => `Must be a valid ${input.name}`,
    // },
    // check if value pass year
    {
      attribute: "id",
      isValid: (input) => {
        input.id !== "year";
        const today = new Date();
        // calculate raw differences
        return today.getFullYear() > input.value;
      },
      errorMessage: (input) => `Must be in the past`,
    },
    // check if value pass minlength
    {
      attribute: "max",
      isValid: (input) => {
        return input.max >= input.value;
      },
      errorMessage: (input) => `Must be a valid ${input.name}`,
    },

    // check if value pass required
    {
      attribute: "required",
      isValid: (input) => input.value.trim() !== "",
      errorMessage: (input) => `This field is required`,
    },
    // check if year value pass minlength
    // {
    //   attribute: "minlength",
    //   isValid: (input) =>
    //     input.value && input.value.length >= parseInt(input.minLength),
    //   errorMessage: (input, label) =>
    //     `Year needs to be at least ${input.minLength} characters`,
    // },
    // check if value pass email
    // {
    //   attribute: "pattern",
    //   isValid: (input) => {
    //     const patternRegex = new RegExp(input.pattern);
    //     return patternRegex.test(input.value);
    //   },
    //   errorMessage: (input, label) => `Looks like this is not an email`,
    // },
  ];

  const validateSingleFormGroup = (formGroup) => {
    // select input, label, error img and error class
    const label = formGroup.querySelector("label");
    const input = formGroup.querySelector("input");
    const errorContainer = formGroup.querySelector(".error");

    //   set no error to the input
    let formGroupError = false;
    // validation rules that loop through then check the input egainst each of rules and trigger right error message
    for (const option of validationOptions) {
      if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
        errorContainer.textContent = option.errorMessage(input);
        errorContainer.style.display = "block";
        //   add red border around input
        input.classList.add("border-danger-subtle");

        //   change position for button
        document.querySelector("button").style.top = "87px";

        label.classList.add("error-label");
        //   add error to the input
        formGroupError = true;
      }
    }
    //   remove error border and icon from input if here is no error
    if (!formGroupError) {
      input.classList.remove("border-danger-subtle");
      label.classList.remove("error-label");
      errorContainer.textContent = "";
    }
    // Check for valid day based on the month
    if (input.id === "day" && input.value) {
      const day = parseInt(input.value);
      const month = parseInt(document.getElementById("month").value);

      // Check if day is within valid range for the selected month
      if (day < 1 || day > getDaysInMonth(month)) {
        errorContainer.textContent = `Must be a valid date`;
        errorContainer.style.display = "block";
        input.classList.add("border-danger-subtle");
        document.querySelector("button").style.top = "87px";
        label.classList.add("error-label");
        formGroupError = true;
      }
    }
  };

  // Function to get the number of days in a month, considering leap years
  const getDaysInMonth = (month) => {
    const leapYear = (year) =>
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust February's days for leap years
    if (month === 2) {
      const year = parseInt(document.getElementById("year").value);
      return leapYear(year) ? 29 : 28;
    }

    return daysInMonth[month - 1];
  };

  // disabling HTML standart validation
  formElement.setAttribute("novalidate", "");

  //adding our validation
  formElement.addEventListener("submit", (event) => {
    // prevent page reload after submit
    event.preventDefault();
    // go to validation all inputs
    validateAllFormGroups(formElement);
  });

  // validate all inputs
  const validateAllFormGroups = (formToValidate) => {
    //   create array from all inputs
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

    // if no error in forms, call calculateAge()
    if (allFormGroupsValid) {
      calculateAge();
    }
  };
};

// select form id
validateForm("#form");

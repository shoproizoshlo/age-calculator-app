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
    // check if value pass day and month
    {
      attribute: "max",
      isValid: (input) => input.value <= parseInt(input.max),
      errorMessage: (input) => `Must be a valid ${input.name}`,
    },

    // check if value pass year
    {
      attribute: "maxlength",
      isValid: (input) => input.value && input.minLength <= parseInt(input.max),
      errorMessage: (input) => `Must be in the past`,
    },

    // check if value pass minlength
    // {
    //   attribute: "minlength",
    //   isValid: (input) =>
    //     input.value && input.value.length >= parseInt(input.minLength),
    //   errorMessage: (input, label) =>
    //     `${label.textContent} needs to be at least ${input.minLength} characters`,
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

    // check if value pass required
    {
      attribute: "required",
      isValid: (input) => input.value.trim() !== "",
      errorMessage: (input) => `This field is required`,
    },
  ];

  const validateSingleFormGroup = (formGroup) => {
    // select input, label, error img and error class
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
        input.style.margin = "0";

        //   add error to the input
        formGroupError = true;
      }
    }
    //   remove error border and icon from input if here is no error
    if (!formGroupError) {
      input.classList.remove("border-danger-subtle");
      errorContainer.textContent = "";
      calculateAge();
    }
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

    //   loop through array
    formGroups.forEach((formGroup) => {
      validateSingleFormGroup(formGroup);
    });
  };
};

// select form id
validateForm("#form");

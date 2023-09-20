const submitButton = document.querySelector(".arrow");
submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  // Remove any existing error styling
  removeErrorStyling();

  // Ensure there are no empty fields
  const form = document.querySelector(".form");
  const data = new FormData(form);

  // Verify that all fields are filled out
  let errorFound = false;

  // Iterate through form data entries
  for (const [name, value] of data) {
    if (value === "") {
      generateErrorMessage(name, "This field is required");
      errorFound = true;
    }
  }

  if (errorFound) {
    addErrorStyling();
    return;
  }

  const day = parseInt(data.get("day"));
  const month = parseInt(data.get("month"));
  const year = parseInt(data.get("year"));

  // Check if day is valid
  if (day < 1 || day > 31) {
    generateErrorMessage("day", "Must be a valid day");
    errorFound = true;
  } else if (month >= 1 && month <= 12) {
    // Check if valid month and day
    const isLeapYear = year % 4 === 0 && year % 100 !== 0;
    const daysInMonth = isLeapYear
      ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (day > daysInMonth[month - 1] || day < 1) {
      generateErrorMessage("day", "Must be a valid day");
      errorFound = true;
    }
  }

  // Check if year is valid
  if (year > new Date().getFullYear()) {
    generateErrorMessage("year", "Must be in the past");
    errorFound = true;
  }

  if (errorFound) {
    addErrorStyling();
    return;
  }

  // calculate age in terms of years, months, and days from birthday
  const today = new Date();
  const birthday = new Date(year, month - 1, day);
  // calculate raw differences
  const age = today.getFullYear() - birthday.getFullYear();
  const monthDifference = today.getMonth() - birthday.getMonth();
  const dayDifference = today.getDate() - birthday.getDate();
  let ageInYears = age;
  let ageInMonths = monthDifference;
  let ageInDays = dayDifference;

  // adject years and months if birthday hasn't occurred this month
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    ageInYears--;
    ageInMonths = 12 + monthDifference;
  }
  if (dayDifference < 0) {
    ageInMonths--;
    // calculate the number of days between today and last month
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    ageInDays += (today - lastMonth) / (1000 * 60 * 60 * 24);
    // (today - lastMonth) / (1000 * 60 * 60 * 24) calculates the number of days between two dates, today and lastMonth.

    // breakdown of the calculation:
    // (today - lastMonth) calculates the difference between the two dates in milliseconds.
    // 1000 represents the number of milliseconds in a second.
    // 60 represents the number of seconds in a minute.
    // 60 represents the number of minutes in an hour.
    // 24 represents the number of hours in a day.
    // By dividing the difference in milliseconds by the product of these values, we convert the time difference into the number of days.
  }

  // display age
  const ageDisplay = document.querySelector("years");
  ageDisplay.innerHTML = ageInYears;
  const ageDisplayMonths = document.querySelector(".months");
  ageDisplayMonths.textContent = ageInMonths;
  const ageDisplayDays = document.querySelector(".days");
  ageDisplayDays.textContent = ageInDays;
});

function generateErrorMessage(field, message) {
  if (!["day", "month", "year"].includes(field)) {
    throw new Error("Invalid field");
  }
  const errorMessage = document.createElement("span");
  errorMessage.classList.add("error");
  errorMessage.textContent = message;

  const input = document.querySelector(`input[name=${field}]`);
  input.after(errorMessage);
}

function removeErrorStyling() {
  const formLabels = document.querySelectorAll("label");
  const formInputs = document.querySelectorAll("input");
  const errorMessages = document.querySelectorAll("error");
  formInputs.forEach((input, index) => {
    formLabels[index].classList.remove("error-label");
    input.classList.remove("border-danger-subtle");
  });
  errorMessages.forEach((message) => {
    message.remove();
  });
}

function addErrorStyling() {
  const formLabels = document.querySelectorAll("label");
  const formInputs = document.querySelectorAll("input");
  formInputs.forEach((input, index) => {
    formLabels[index].classList.add("error-label");
    input.classList.add("border-danger-subtle");
  });
}

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

  console.log(years);

  document.getElementById("years").innerText = `${years}`;
  document.getElementById("months").innerText = `${months}`;
  document.getElementById("days").innerText = `${days}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  calculateAge();
});

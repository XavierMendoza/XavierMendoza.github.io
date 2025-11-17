// ===== Event Listeners =====
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document
  .querySelector("#signupForm")
  .addEventListener("submit", function (event) {
    validateForm(event);
  });

document.querySelector("#password").addEventListener("focus", suggestPassword);

// Populate states when page loads
populateStates();


// ===== FUNCTIONS =====

// 1–2. Display city, latitude, longitude OR show “Zip code not found”
async function displayCity() {
  let zipCode = document.querySelector("#zip").value;
  let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;

  try {
    let response = await fetch(url);
    let data = await response.json();

    if (!data || data == false) {
      document.querySelector("#city").innerHTML = "Zip code not found";
      document.querySelector("#latitude").innerHTML = "";
      document.querySelector("#longitude").innerHTML = "";
      return;
    }

    document.querySelector("#city").innerHTML = data.city;
    document.querySelector("#latitude").innerHTML = data.latitude;
    document.querySelector("#longitude").innerHTML = data.longitude;
  } catch (error) {
    console.error("Error fetching ZIP data:", error);
  }
}


// 3. Display counties based on selected state
async function displayCounties() {
  let state = document.querySelector("#state").value;
  let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;

  try {
    let response = await fetch(url);
    let data = await response.json();
    let countyList = document.querySelector("#county");
    countyList.innerHTML = "<option>Select County</option>";

    for (let i = 0; i < data.length; i++) {
      countyList.innerHTML += `<option>${data[i].county}</option>`;
    }
  } catch (error) {
    console.error("Error fetching counties:", error);
  }
}


// 4. Check username availability (color-coded)
async function checkUsername() {
  let username = document.querySelector("#username").value;
  let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;

  try {
    let response = await fetch(url);
    let data = await response.json();
    let usernameError = document.querySelector("#usernameError");

    if (data.available) {
      usernameError.innerHTML = " Username available!";
      usernameError.style.color = "green";
    } else {
      usernameError.innerHTML = " Username taken!";
      usernameError.style.color = "red";
    }
  } catch (error) {
    console.error("Error checking username:", error);
  }
}


// 5. Display suggested password on focus
async function suggestPassword() {
  try {
    let response = await fetch("https://csumb.space/api/suggestedPassword.php?length=8");
    let data = await response.text();
    document.querySelector("#suggestedPwd").innerHTML = " Suggested: " + data;
  } catch (error) {
    console.error("Error fetching suggested password:", error);
  }
}


// 6. Populate all U.S. states (with fallback list)
async function populateStates() {
  const stateSelect = document.querySelector("#state");
  stateSelect.innerHTML = '<option value="">Select One</option>';

  const fallbackStates = [
    {name:"Alabama",abbreviation:"AL"},{name:"Alaska",abbreviation:"AK"},
    {name:"Arizona",abbreviation:"AZ"},{name:"Arkansas",abbreviation:"AR"},
    {name:"California",abbreviation:"CA"},{name:"Colorado",abbreviation:"CO"},
    {name:"Connecticut",abbreviation:"CT"},{name:"Delaware",abbreviation:"DE"},
    {name:"Florida",abbreviation:"FL"},{name:"Georgia",abbreviation:"GA"},
    {name:"Hawaii",abbreviation:"HI"},{name:"Idaho",abbreviation:"ID"},
    {name:"Illinois",abbreviation:"IL"},{name:"Indiana",abbreviation:"IN"},
    {name:"Iowa",abbreviation:"IA"},{name:"Kansas",abbreviation:"KS"},
    {name:"Kentucky",abbreviation:"KY"},{name:"Louisiana",abbreviation:"LA"},
    {name:"Maine",abbreviation:"ME"},{name:"Maryland",abbreviation:"MD"},
    {name:"Massachusetts",abbreviation:"MA"},{name:"Michigan",abbreviation:"MI"},
    {name:"Minnesota",abbreviation:"MN"},{name:"Mississippi",abbreviation:"MS"},
    {name:"Missouri",abbreviation:"MO"},{name:"Montana",abbreviation:"MT"},
    {name:"Nebraska",abbreviation:"NE"},{name:"Nevada",abbreviation:"NV"},
    {name:"New Hampshire",abbreviation:"NH"},{name:"New Jersey",abbreviation:"NJ"},
    {name:"New Mexico",abbreviation:"NM"},{name:"New York",abbreviation:"NY"},
    {name:"North Carolina",abbreviation:"NC"},{name:"North Dakota",abbreviation:"ND"},
    {name:"Ohio",abbreviation:"OH"},{name:"Oklahoma",abbreviation:"OK"},
    {name:"Oregon",abbreviation:"OR"},{name:"Pennsylvania",abbreviation:"PA"},
    {name:"Rhode Island",abbreviation:"RI"},{name:"South Carolina",abbreviation:"SC"},
    {name:"South Dakota",abbreviation:"SD"},{name:"Tennessee",abbreviation:"TN"},
    {name:"Texas",abbreviation:"TX"},{name:"Utah",abbreviation:"UT"},
    {name:"Vermont",abbreviation:"VT"},{name:"Virginia",abbreviation:"VA"},
    {name:"Washington",abbreviation:"WA"},{name:"West Virginia",abbreviation:"WV"},
    {name:"Wisconsin",abbreviation:"WI"},{name:"Wyoming",abbreviation:"WY"}
  ];

  try {
    const res = await fetch("https://csumb.space/api/allStatesAPI.php");
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("Empty data");
    for (const s of data) {
      stateSelect.innerHTML += `<option value="${s.abbreviation.toLowerCase()}">${s.name}</option>`;
    }
  } catch (err) {
    console.warn("Using fallback list of states:", err);
    for (const s of fallbackStates) {
      stateSelect.innerHTML += `<option value="${s.abbreviation.toLowerCase()}">${s.name}</option>`;
    }
  }
}


// 8–9. Validate password rules and form data (fixed)
function validateForm(e) {
  let isValid = true;

  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value.trim();
  const retype = document.querySelector("#password2").value.trim(); 
  const usernameError = document.querySelector("#usernameError");
  const passwordError = document.querySelector("#passwordError");

  usernameError.innerHTML = "";
  passwordError.innerHTML = "";

  if (username.length === 0) {
    usernameError.innerHTML = " Username required!";
    usernameError.style.color = "red";
    isValid = false;
  }

  if (password.length < 6) {
    passwordError.innerHTML = " Password must be at least 6 characters.";
    passwordError.style.color = "red";
    isValid = false;
  } else if (password !== retype) {
    passwordError.innerHTML = " Passwords do not match.";
    passwordError.style.color = "red";
    isValid = false;
  }

  if (!isValid) e.preventDefault();
}

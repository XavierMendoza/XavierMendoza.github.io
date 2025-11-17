// Base URLs
const CITY_API      = zip => `https://csumb.space/api/cityInfoAPI.php?zip=${zip}`;
const COUNTY_API    = st  => `https://csumb.space/api/countyListAPI.php?state=${st}`;
const USERNAME_API  = u   => `https://csumb.space/api/usernamesAPI.php?username=${encodeURIComponent(u)}`;
const STATES_API    =     `https://csumb.space/api/allStatesAPI.php`;
const SUGGEST_API   = len => `https://csumb.space/api/suggestedPassword.php?length=${len}`;

// Event setup
document.addEventListener("DOMContentLoaded", () => {
  populateStates(); // fill all states on load (Rubric #6)

  document.querySelector("#zip").addEventListener("change", displayCity);
  document.querySelector("#state").addEventListener("change", displayCounties);
  document.querySelector("#username").addEventListener("input", checkUsername);
  document.querySelector("#password").addEventListener("focus", suggestPassword);
  document.querySelector("#signupForm").addEventListener("submit", e => validateForm(e));
});

// 1 & 2: Get city/lat/lon by ZIP, handle "not found"
async function displayCity() {
  const zip = document.querySelector("#zip").value.trim();
  const city = document.querySelector("#city");
  const lat = document.querySelector("#latitude");
  const lon = document.querySelector("#longitude");
  const zipError = document.querySelector("#zipError");

  city.textContent = lat.textContent = lon.textContent = "";
  zipError.textContent = "";

  if (!zip) return;

  try {
    const res = await fetch(CITY_API(zip));
    const data = await res.json();
    if (!data || data === false) {
      zipError.textContent = "Zip code not found";
      return;
    }
    city.textContent = data.city || "";
    lat.textContent = data.latitude || "";
    lon.textContent = data.longitude || "";
  } catch {
    zipError.textContent = "Error retrieving data";
  }
}

// 3: Populate counties for selected state
async function displayCounties() {
  const stateVal = document.querySelector("#state").value;
  const county = document.querySelector("#county");
  county.innerHTML = `<option value="">Select County</option>`;
  if (!stateVal) return;
  try {
    const res = await fetch(COUNTY_API(stateVal));
    const data = await res.json();
    for (const c of data) {
      county.innerHTML += `<option>${c.county}</option>`;
    }
  } catch {
    county.innerHTML = `<option>Error loading counties</option>`;
  }
}

// 4: Username availability (color-coded)
async function checkUsername() {
  const username = document.querySelector("#username").value.trim();
  const msg = document.querySelector("#usernameError");
  if (!username) {
    msg.textContent = "Username required";
    msg.style.color = "red";
    return;
  }
  try {
    const res = await fetch(USERNAME_API(username));
    const data = await res.json();
    if (data.available) {
      msg.textContent = "Username available";
      msg.style.color = "green";
    } else {
      msg.textContent = "Username taken";
      msg.style.color = "red";
    }
  } catch {
    msg.textContent = "Error checking username";
    msg.style.color = "red";
  }
}

// 5: Suggested password when focusing on password box
async function suggestPassword() {
  const hint = document.querySelector("#suggestedPwd");
  hint.textContent = "Generating password...";
  try {
    const res = await fetch(SUGGEST_API(10));
    const data = await res.json();
    const suggestion = data.password || data || "";
    hint.textContent = `Suggested: ${suggestion}`;
  } catch {
    hint.textContent = "Could not fetch password";
  }
}

// 6: Populate all U.S. states from Web API
async function populateStates() {
  const stateSelect = document.querySelector("#state");
  try {
    const res = await fetch(STATES_API);
    const data = await res.json();
    for (const s of data) {
      stateSelect.innerHTML += `<option value="${s.abbreviation.toLowerCase()}">${s.name}</option>`;
    }
  } catch {
    // fallback if API fails
    stateSelect.innerHTML += `
      <option value="ca">California</option>
      <option value="ny">New York</option>
      <option value="tx">Texas</option>`;
  }
}

// 8 & 9: Validation before submitting form
function validateForm(e) {
  let valid = true;
  const username = document.querySelector("#username").value.trim();
  const userMsg = document.querySelector("#usernameError");
  const pwd = document.querySelector("#password").value;
  const pwd2 = document.querySelector("#password2").value;
  const pwdMsg = document.querySelector("#passwordError");

  pwdMsg.textContent = "";

  // Username check
  if (username.length === 0) {
    userMsg.textContent = "Username required";
    userMsg.style.color = "red";
    valid = false;
  } else if (userMsg.textContent.includes("taken")) {
    valid = false;
  }

  // Password length
  if (pwd.length < 6) {
    pwdMsg.textContent = "Password must be at least 6 characters";
    valid = false;
  }

  // Password match
  if (pwd && pwd2 && pwd !== pwd2) {
    pwdMsg.textContent = "Passwords do not match";
    valid = false;
  }

  if (!valid) e.preventDefault();
}

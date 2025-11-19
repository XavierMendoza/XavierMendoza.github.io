console.log("JS is connected");

document.getElementById("searchForm").addEventListener("submit", function (event) {
  event.preventDefault();

  let input = document.getElementById("characterInput").value.trim();
  let errorMsg = document.getElementById("errorMsg");
  let results = document.getElementById("results");

  errorMsg.textContent = "";
  results.innerHTML = "";


  if (input.length === 0) {
    errorMsg.textContent = "Please enter a character name.";
    return;
  }

  let url = `https://rickandmortyapi.com/api/character/?name=${input}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {

      if (data.error) {
        results.innerHTML = "<p>No character found.</p>";
        return;
      }

      let character = data.results[0];

      results.innerHTML = `
        <div class="card">
          <h2>${character.name}</h2>
          <img src="${character.image}" alt="${character.name}">
          <p>Status: ${character.status}</p>
          <p>Species: ${character.species}</p>
          <p>Gender: ${character.gender}</p>
          <p>Origin: ${character.origin.name}</p>
        </div>
      `;
    })
    .catch(err => {
      results.innerHTML = "<p>Error fetching data.</p>";
    });
});

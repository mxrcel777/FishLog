console.log("essa boi");
async function getCatches() {
  const response = await fetch("http://localhost:3000/catches");
  const catches = await response.json();
  console.log("fishes from database:", catches);
  renderCatches(catches);
}
getCatches();
function renderCatches(catches) {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  catches.forEach((fish) => {
    const post = document.createElement("div");
    post.className = "fish-post";

    const fishId = fish.id;
    post.dataset.id = fishId;

    const fishLength = fish.length || 0;
    const fishWeight = fish.weight || 0;

    const imageHtml = fish.image ? `<img src="${fish.image}" class="post-img" alt="${fish.fishName}">` : "";

    post.innerHTML = `
        <div class="fish-post-header" style="display: flex; justify-content: space-between; align-items: center;">
            <h3>${fish.fishName}</h3>
            <div class="post-actions">
                <button class="edit-btn" onclick="editCatch('${fishId}')" style="background:none; border:none; cursor:pointer;">🛠️</button>
                <button class="delete-btn" onclick="deleteCatch('${fishId}')" style="background:none; border:none; cursor:pointer;">❌</button>
            </div>
        </div>
        <p class="fish-cmkg"> ${fishLength} cm | ${fishWeight} kg</p>
        <p>📍 ${fish.location || "Unknown"}</p>
        <p>${fish.note || ""}</p>

        ${imageHtml}
        <hr>
            `;

    timeline.appendChild(post);
  });

  // leaderboard po dlugosci ryb
  const lengthList = document.getElementById("leaderboard-length");
     if (lengthList) {
     lengthList.innerHTML = "";

     const topLength = catches
       .sort((a, b) => b.length - a.length)
       .slice(0, 3);

     topLength.forEach((fish, index) => {
       const len = document.createElement("len");
       len.innerHTML = `
                   <span class="rank-num">#${index + 1}</span>
                   <span class="rank-name">${fish.fishName}</span>
                   <span class="rank-size">${fish.length} cm</span>
               `;
       lengthList.appendChild(len);
     });
    }


// leaderboard po kilogramach

const weightList = document.getElementById("leaderboard-weight");
     if (weightList) {
     weightList.innerHTML = "";

     const topWeight = catches
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3);

     topWeight.forEach((fish, index) => {
      const len = document.createElement("len");
      len.innerHTML = `
                   <span class="rank-num">#${index + 1}</span>
                   <span class="rank-name">${fish.fishName}</span>
                   <span class="rank-size">${fish.weight} kg</span>
               `;
                weightList.appendChild(len);
     });
    }
  }


// usuwanie ryb

async function deleteCatch(id) {
  if (!confirm("Are you sure you want to delete this catch?")) return;

  try {
    const response = await fetch(`http://localhost:3000/catches/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("fish has been deleted from database.");
      getCatches();
    }
  } catch (error) {
    console.error("error deleting:", error);
  }
}

// edytowanie ryb
async function editCatch(id) {
  const newName = prompt("enter new fish name:");

  if (newName === null) return; // po kliknieciu anuluj funkcja sie przerywa

  const newLocation = prompt("new location:");
  const newNote = prompt("new note:");
  const newLength = prompt("new length:") || 0;
  const newWeight = prompt("new weight:") || 0;
  // dodac image

  const updatedData = {
    fishName: newName,
    location: newLocation,
    note: newNote,
    length: Number(newLength),
    weight: Number(newWeight)
    // dodac image
  };

  
    const response = await fetch(`http://localhost:3000/catches/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      console.log("fish updated");
      getCatches();
    }
  } 
  


const modal = document.getElementById("modal-overlay");
const openBtn = document.getElementById("open-btn");
const closeBtn = document.getElementById("close-btn");

openBtn.onclick = function () {
  modal.style.display = "flex";
};
closeBtn.onclick = function () {
  modal.style.display = "none";
};

document.getElementById("add-btn").onclick = async function () {
  const fishNameInput = document.getElementById("FishName");
  const locationInput = document.getElementById("location");
  const noteInput = document.getElementById("note");
  const lengthInput = document.getElementById("length");
  const weightInput = document.getElementById("weight");
  const fishImageInput = document.getElementById("fishImage");

  const newCatch = {
    fishName: fishNameInput.value,
    location: locationInput.value,
    length: Number(lengthInput.value) || 0,
    weight: Number(weightInput.value) || 0,
    note: noteInput.value,
    image: fishImageInput.value
  };

  lengthInput.value = "";
  weightInput.value = "";

  if (!newCatch.fishName) {
    alert("at least enter name of the fish..");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/catches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCatch),
    });

    if (response.ok) {
      console.log("added to a database");

      fishNameInput.value = "";
      locationInput.value = "";
      noteInput.value = "";
      fishImageInput.value = "";

      document.getElementById("modal-overlay").style.display = "none";

      getCatches();
    }
  } catch (error) {
    console.error("error:", error);
  }
};


async function weather(cityName = "Warsaw") {
  const container = document.getElementById('weather-container');
  const fishingContainer = document.getElementById('fishing-conditions');

  try { //pobranie danych z geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();
    // zabezpieczenie przed wpisywaniem losowych liter
    if (!geoData.results || geoData.results.length === 0 ) {
      container.innerHTML = '<p class="weather-error" style="color: #ff4a4a;">City not found...</p>';
      if (fishingContainer) fishingContainer.innerHTML = "";
      return;
    }
    // dane z meteo
    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;
    const foundCity = geoData.results[0].name;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&wind_speed_unit=ms`

    const response = await fetch(weatherUrl);
    const data = await response.json();
    const current = data.current;

    const temp = current.apparent_temperature;
    const wind = current.wind_speed_10m;

    document.getElementById('weather-container').innerHTML = `
    <div class="weather-city" style="color: aqua; font-weight: bold; margin-bottom: 10px; font-size: 1.1rem;"> ${foundCity} </div>
    <div class="weather-main-row">
      <span class="weather-temp">${current.apparent_temperature}°C</span>
      </div>
    <div class="weather-data-row">
      <span> Humidity:</span>
      <span class="weather-value">${current.relative_humidity_2m}%</span>
      </div>
    <div class="weather-data-row">
      <span> Wind:</span>
      <span class="weather-value">${current.wind_speed_10m} m/s</span>
      </div>
  `;

  let status = "Okay";
  let color = "orange";
  let emoji = "🟧";

  if (temp >= 12 && temp <= 22 && wind < 5) {
    status = "GOATED";
    color = "aquamarine";
    emoji = "🟩"
  } else if (temp > 28 || wind > 8) {
    status = "Just go home (Too hot / windy)";
    color = "red"
    emoji = "🟥"
  } else if (temp < 5) {
    status = "It's freezing";
    color = "grey";
    emoji = "🟦"
  }
  if (fishingContainer) {
      fishingContainer.innerHTML = `
        <div style="font-size: 0.9rem; color: #71767b; margin-bottom: 4px; margin-top: 5px; padding-top: 5px;">Fishing Forecast:</div>
        <div style="color: ${color}; font-weight: bold; font-size: 1.05rem;">
          ${emoji} ${status}
        </div>
      `;
    }
  } catch (error) {
    document.getElementById('weather-container').innerHTML = '<p class="weather-error">Failed to load weather</p>';

  }
};

document.getElementById('weather-city-input').onkeypress = function (e) {
  if (e.key === 'Enter' && this.value.trim() !== "") {
    weather(this.value.trim());
  }
};

weather();
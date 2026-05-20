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

  const updatedData = {
    fishName: newName,
    location: newLocation,
    note: newNote,
    length: Number(newLength),
    weight: Number(newWeight)
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

  const newCatch = {
    fishName: fishNameInput.value,
    location: locationInput.value,
    length: Number(lengthInput.value) || 0,
    weight: Number(weightInput.value) || 0,
    note: noteInput.value,
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

      document.getElementById("modal-overlay").style.display = "none";

      getCatches();
    }
  } catch (error) {
    console.error("error:", error);
  }
};

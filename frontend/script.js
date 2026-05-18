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

//   const leaderboardList = document.getElementById("leaderboard-list");
//   leaderboardList.innerHTML = "";

//   const topCatches = [...catches]
//     .sort((a, b) => b.length - a.length)
//     .slice(0, 5);

//   topCatches.forEach((fish, index) => {
//     const li = document.createElement("li");
//     li.innerHTML = `
//                 <span class="rank-num">#${index + 1}</span>
//                 <span class="rank-name">${fish.fishName}</span>
//                 <span class="rank-size">#${fish.length} cm</span>
//             `;
//     leaderboardList.appendChild(li);
//   });
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

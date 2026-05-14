console.log("essa boi");
async function getCatches() {
    const response = await fetch("http://localhost:3000/catches");
    const catches = await response.json();
    console.log("fishes from database:", catches);
}
getCatches();

document.getElementById("addbtn").onclick = async function () {
    const fishNameInput = document.getElementById("fishName");
    const locationInput = document.getElementById("location");
    const noteInput = document.getElementById("note");

    if (fishNameInput.value.trim() === "") {
        alert("at least enter name of the fish..");
        return;
    }

    const newCatch = {
        fishName: fishNameInput.value,
        location: locationInput.value,
        note: noteInput.value
    };

    try {
        const response = await fetch("http://localhost:3000/catches", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newCatch)
        });

        if (response.ok) {
            console.log("added to a database");

            fishNameInput.value = "";
            locationInput.value = "";
            noteInput.value = "";

            getCatches();
        }
    }
    catch (error) {
        console.error("error:", error);
    } 
};
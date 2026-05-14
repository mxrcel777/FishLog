// tutaj bedzie server przez ktory bede sie laczyl z baza danych 
import express from "express";
import cors from "cors";
import db from "./database.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "FishLog API działa 🐟"
  });
});

// PRZYKŁAD: dodawanie nowego połowu
app.post("/catches", (req, res) => {
//const { fishName, location, note } = req.body;
const fishName = req.body.fishName
const location = req.body.location
const note = req.body.note

  if (!fishName) {
    return res.status(400).json({
      error: "Nazwa ryby jest wymagana"
    });
  }

  const result = db
    .prepare(`
      INSERT INTO catches (fishName, location, note)
      VALUES (?, ?, ?)
    `)
    .run(fishName, location, note);

  const newCatch = db
    .prepare("SELECT * FROM catches WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(newCatch);
});

// ZADANIE DLA CIEBIE:
// Dodaj endpoint GET /catches,
// który pobierze wszystkie połowy z bazy danych
// i zwróci je jako JSON.

app.get("/catches", (req, res) => {
  // 1. pobierz dane z bazy
  const catches = db.prepare("SELECT * FROM catches").all();
  // 2. odeślij je przez res.json(...)
  res.json(catches);
});
 
app.listen(PORT, () => {
  console.log(`FishLog API działa na http://localhost:${PORT}`);
});
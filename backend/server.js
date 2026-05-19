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
    message: "FishLog API działa"
  });
});

// PRZYKŁAD: dodawanie nowego połowu
app.post("/catches", (req, res) => {
//const { fishName, location, note } = req.body;
const fishName = req.body.fishName
const location = req.body.location
const note = req.body.note
const length = req.body.length 
const weight = req.body.weight

  if (!fishName) {
    return res.status(400).json({
      error: "Nazwa ryby jest wymagana"
    });
  }

  const result = db
    .prepare(`
      INSERT INTO catches (fishName, location, note, length, weight)
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(fishName, location, note, length, weight);

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

// dodac delete
app.delete("/catches/:id", (req, res) => {
  const id = req.params.id
  // wywolac db.prepare zeby usunelo record
  const pre = db.prepare("DELETE FROM catches WHERE id = ?").run(id); //zapytanie do sql, ? - sluzy jako antywirus

  if (pre.changes > 0) {
    res.status(200).json({ message: "deleted"}); // wiadomosc do frontend ze wszystko dziala lub nie jak jest ponizej
} else {
    res.status(404).json({ error: "couldn't find a fish with this ID"});
}
});

// edycja
app.put("/catches/:id", (req, res) => {
  const id = req.params.id;

  const fishName = req.body.fishName
  const location = req.body.location
  const note = req.body.note
  const length = req.body.length 
  const weight = req.body.weight

  db.prepare("UPDATE catches SET fishName = ?, location = ?, note = ?, length = ?, weight = ? WHERE id = ?").run(fishName, location, note, length, weight, id);

  res.status(200).json({ message: "updated"});
});

app.listen(PORT, () => {
  console.log(`FishLog API działa na http://localhost:${PORT}`);
});
// Mengimpor modul express untuk membuat aplikasi web
const express = require("express"); 
// Mengimpor modul cors untuk mengizinkan permintaan lintas asal
const cors = require("cors"); 
// Mengimpor modul body-parser untuk mengurai data permintaan
const bodyParser = require("body-parser"); 
// Mengimpor modul lowdb untuk membuat database lokal
const lowdb = require("lowdb");
// Mengimpor modul FileSync untuk menyimpan database ke file
const FileSync = require("lowdb/adapters/FileSync");

// Membuat sebuah objek aplikasi express
const app = express(); 

// Use cors and body-parser middleware
// Menggunakan middleware cors untuk mengizinkan permintaan dari aplikasi berbasis web
app.use(cors()); 
// Menggunakan middleware body-parser untuk mengurai data permintaan dalam format JSON
app.use(bodyParser.json()); 

// Create a lowdb database
// Membuat sebuah objek adapter untuk menyimpan database ke file db.json
const adapter = new FileSync("db.json");
// Membuat sebuah objek database lowdb dengan adapter tersebut
const db = lowdb(adapter);

const defaultData = {
    items: [
        {
            id: 1,
            name: "Udin"
        }
    ]
}
// Menginisialisasi database dengan data default berupa array kosong bernama items dan menulisnya ke file
db.defaults(defaultData).write(); 

const generateId = () => {
    return Math.max(...defaultData.items.map((item) => item.id)) + 1;
  };

app.get("/items", (req, res) => {
  // Mendefinisikan sebuah rute untuk mendapatkan semua item
  // req adalah objek permintaan, res adalah objek respons
  // Mendapatkan nilai array items dari database
  const items = db.get("items").value(); 
  // Mengirimkan respons dalam format JSON dengan nilai items
  res.json(items); 
});

app.post("/items", (req, res) => {
  // Mendefinisikan sebuah rute untuk menambahkan item baru
  // req adalah objek permintaan, res adalah objek respons
  // Mendapatkan data item dari tubuh permintaan
  const item = req.body; 
  item.id = generateId();
  // Menambahkan item ke array items di database dan menulisnya ke file
  db.get("items").push(item).write(); 
  // Mengirimkan respons dalam format JSON dengan data item
  res.json(item); 
});

app.put("/items/:id", (req, res) => {
  // Mendefinisikan sebuah rute untuk memperbarui item yang sudah ada
  // req adalah objek permintaan, res adalah objek respons
  // :id adalah parameter yang menunjukkan id item yang akan diperbarui
  // Mendapatkan nilai id dari parameter permintaan
  const id = req.params.id; 
  // Mendapatkan data item yang diperbarui dari tubuh permintaan
  const updatedItem = req.body; 
  // Mencari item dengan id yang sesuai di array items di database dan menetapkan data item yang diperbarui kepadanya dan menulisnya ke file
  db.get("items").find({ id: id }).assign(updatedItem).write(); 
  // Mengirimkan respons dalam format JSON dengan data item yang diperbarui
  res.json(updatedItem); 
});

app.delete("/items/:id", (req, res) => {
  // Mendefinisikan sebuah rute untuk menghapus item yang sudah ada
  // req adalah objek permintaan, res adalah objek respons
  // :id adalah parameter yang menunjukkan id item yang akan dihapus
  // Mendapatkan nilai id dari parameter permintaan
  const id = parseInt(req.params.id); 
  // Mencari item dengan id yang sesuai di array items di database dan mendapatkan nilainya
  const deletedItem = db.get("items").find({ id: id }).value(); 
  // Menghapus item dengan id yang sesuai dari array items di database dan menulisnya ke file
  db.get("items").remove({ id: id }).write(); 
  // Mengirimkan respons dalam format JSON dengan data item yang dihapus
  res.json(deletedItem); 
});

app.listen(3001, () => {
  // Memulai aplikasi pada port 3001
  // Menampilkan pesan di konsol bahwa API sedang berjalan pada port 3001
  console.log("API is running on port 3001"); 
});

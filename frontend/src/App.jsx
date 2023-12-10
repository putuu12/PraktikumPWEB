// Mengimpor modul React dan dua hook yang digunakan untuk membuat state dan efek
import React, { useState, useEffect } from "react"; 

// Mengimpor modul axios yang digunakan untuk melakukan permintaan HTTP
import axios from "axios"; 

// Mengimpor file css yang berisi gaya untuk komponen App
import "./App.css"; 

function Item(props) {
  // Mendefinisikan sebuah komponen khusus untuk setiap item
  // props adalah objek yang berisi properti-properti yang dilewatkan dari komponen induk
  // Menggunakan state variabel untuk menyimpan data item dan fungsi untuk mengubahnya
  const [item, setItem] = useState(props.item); 
  // Menggunakan state variabel untuk menyimpan mode pengeditan dan fungsi untuk mengubahnya
  const [isEditing, setIsEditing] = useState(false); 

  // Define a function to handle the change of the item name
  function handleChange(event) {
    // Mendefinisikan sebuah fungsi untuk menangani perubahan nama item
    // event adalah objek yang berisi informasi tentang peristiwa yang terjadi
    // Mengubah state variabel item dengan menyalin objek item dan mengganti properti name dengan nilai dari target peristiwa
    setItem({ ...item, name: event.target.value }); 
  }

  function handleEdit() {
    // Mendefinisikan sebuah fungsi untuk menangani klik tombol edit
    // Mengubah state variabel isEditing menjadi true
    setIsEditing(true); 
  }

  // Define a function to handle the click of the save button
  function handleSave() {
    // Mendefinisikan sebuah fungsi untuk menangani klik tombol save
    // Menggunakan axios untuk mengirimkan permintaan HTTP dengan metode PUT ke alamat API dengan id item dan data item sebagai tubuh permintaan
    axios
      .put(`http://localhost:3001/items/${item.id}`, item) 
      .then((response) => {
        // Menjalankan fungsi ini jika permintaan berhasil
        // response adalah objek yang berisi informasi tentang respons dari server
        // Mengubah state variabel isEditing menjadi false
        setIsEditing(false); 
        // Memanggil fungsi onUpdate yang dilewatkan sebagai prop dari komponen induk dengan id item dan data respons sebagai argumen
        props.onUpdate(item.id, response.data); 
      })
      .catch((error) => {
        // Menjalankan fungsi ini jika permintaan gagal
        // error adalah objek yang berisi informasi tentang kesalahan yang terjadi
        // Handle the error
        console.error(error); // Menampilkan pesan kesalahan di konsol
      });
  }

  function handleDelete() {
    // Mendefinisikan sebuah fungsi untuk menangani klik tombol delete
    // Menggunakan axios untuk mengirimkan permintaan HTTP dengan metode DELETE ke alamat API dengan id item
    axios
      .delete(`http://localhost:3001/items/${item.id}`) 
      .then((response) => {
        // Menjalankan fungsi ini jika permintaan berhasil
        // response adalah objek yang berisi informasi tentang respons dari server
        // Memanggil fungsi onDelete yang dilewatkan sebagai prop dari komponen induk dengan id item sebagai argumen
        props.onDelete(item.id); 
      })
      .catch((error) => {
        // Menjalankan fungsi ini jika permintaan gagal
        // error adalah objek yang berisi informasi tentang kesalahan yang terjadi
        // Handle the error
        console.error(error); // Menampilkan pesan kesalahan di konsol
      });
  }

  return (
    <div className="item">
      {isEditing ? (
        // Jika state variabel isEditing bernilai true, maka menampilkan elemen berikut
        <div className="item-edit">
          <input
            type="text"
            value={item.name}
            onChange={handleChange}
            className="item-input"
          /> {/* Menampilkan sebuah elemen input dengan tipe teks, nilai nama item, fungsi handleChange sebagai penangan perubahan, dan kelas item-input */}
          <button onClick={handleSave} className="item-button">
            Save
          </button> {/* Menampilkan sebuah elemen button dengan teks Save, fungsi handleSave sebagai penangan klik, dan kelas item-button */}
        </div>
      ) : (
        // Jika state variabel isEditing bernilai false, maka menampilkan elemen berikut
        // If the editing mode is false, render the item name and an edit button
        <div className="item-display">
          <p className="item-name">{item.name}</p> {/* Menampilkan sebuah elemen p dengan teks nama item dan kelas item-name */}
          <button onClick={handleEdit} className="item-button">
            Edit
          </button> {/* Menampilkan sebuah elemen button dengan teks Edit, fungsi handleEdit sebagai penangan klik, dan kelas item-button */}
        </div>
      )}
      {/* Menampilkan sebuah elemen button dengan teks Delete, fungsi handleDelete sebagai penangan klik, dan kelas item-button untuk setiap item */}
      <button onClick={handleDelete} className="item-button">
        Delete
      </button>
    </div>
  ); // Menampilkan sebuah elemen div dengan kelas item yang berisi elemen-elemen di atas
}

function App() {
  // Mendefinisikan sebuah komponen khusus untuk aplikasi
  // Menggunakan state variabel untuk menyimpan daftar item dan fungsi untuk mengubahnya
  const [items, setItems] = useState([]); 

  // Menggunakan state variabel untuk menyimpan nama item baru dan fungsi untuk mengubahnya
  const [newItem, setNewItem] = useState(""); 

  useEffect(() => {
    // Menggunakan hook efek untuk menjalankan fungsi ini ketika komponen dipasang
    // Menggunakan axios untuk mengirimkan permintaan HTTP dengan metode GET ke alamat API
    axios
      .get("http://localhost:3001/items") 
      .then((response) => {
        // Menjalankan fungsi ini jika permintaan berhasil
        // response adalah objek yang berisi informasi tentang respons dari server
        // Mengubah state variabel items dengan data respons
        setItems(response.data); 
      })
      .catch((error) => {
        // Menjalankan fungsi ini jika permintaan gagal
        // error adalah objek yang berisi informasi tentang kesalahan yang terjadi
        // Handle the error
        console.error(error); // Menampilkan pesan kesalahan di konsol
      });
  }, []); // Menambahkan array kosong sebagai dependensi untuk menjalankan fungsi ini hanya sekali ketika komponen dipasang

  function handleChange(event) {
    // Mendefinisikan sebuah fungsi untuk menangani perubahan nama item baru
    // event adalah objek yang berisi informasi tentang peristiwa yang terjadi
    setNewItem(event.target.value); // Mengubah state variabel newItem dengan nilai dari target peristiwa
  }

  function handleAdd() {
    // Mendefinisikan sebuah fungsi untuk menangani klik tombol add
    // Membuat sebuah objek item dengan properti name yang bernilai newItem
    const item = { name: newItem }; 
    axios
      // Menggunakan axios untuk mengirimkan permintaan HTTP dengan metode POST ke alamat API dengan data item sebagai tubuh permintaan
      .post("http://localhost:3001/items", item) 
      .then((response) => {
        // Menjalankan fungsi ini jika permintaan berhasil
        // response adalah objek yang berisi informasi tentang respons dari server
        // Mengubah state variabel newItem menjadi string kosong
        setNewItem(""); 
        // Mengubah state variabel items dengan menambahkan data respons ke array items
        setItems([...items, response.data]); 
      })
      .catch((error) => {
        // Menjalankan fungsi ini jika permintaan gagal
        // error adalah objek yang berisi informasi tentang kesalahan yang terjadi
        // Handle the error
        console.error(error); // Menampilkan pesan kesalahan di konsol
      });
  }

  function handleUpdate(id, updatedItem) {
    // Mendefinisikan sebuah fungsi untuk menangani pembaruan item
    // id adalah parameter yang menunjukkan id item yang diperbarui
    // updatedItem adalah parameter yang menunjukkan data item yang diperbarui
    const updatedItems = items.map((item) => {
      // Membuat sebuah array baru dengan memetakan state variabel items
      // item adalah parameter yang menunjukkan setiap item dalam array items\
      if (item.id === id) {
        // Jika id item sama dengan id item yang diperbarui, maka mengembalikan item yang diperbarui
        return updatedItem;
      }
      // Jika tidak, maka mengembalikan item asli
      return item; 
    });
    // Mengubah state variabel items dengan array baru
    setItems(updatedItems); 
  }

  function handleDelete(id) {
    // Mendefinisikan sebuah fungsi untuk menangani penghapusan item
    // id adalah parameter yang menunjukkan id item yang dihapus
    const updatedItems = items.filter((item) => {
      // Membuat sebuah array baru dengan menyaring state variabel items
      // item adalah parameter yang menunjukkan setiap item dalam array items
      // Mengembalikan hanya item yang tidak sama dengan id item yang dihapus
      return item.id !== id; 
    });
    // Mengubah state variabel items dengan array baru
    setItems(updatedItems); 
  }

  return (
    <div className="app">
      <h1 className="app-title">React JS CRUD App</h1> {/* Menampilkan sebuah elemen h1 dengan teks React JS CRUD App dan kelas app-title */}
      <div className="app-form">
        {/* Menampilkan sebuah elemen input dengan tipe teks, nilai newItem, fungsi handleChange sebagai penangan perubahan, 
        kelas app-input, dan placeholder Enter a new item */}
        <input
          type="text"
          value={newItem}
          onChange={handleChange}
          className="app-input"
          placeholder="Enter a new item"
          />
        <button onClick={handleAdd} className="app-button">
          Add
        </button> {/* Menampilkan sebuah elemen button dengan teks Add, fungsi handleAdd sebagai penangan klik, dan kelas app-button */}
      </div>
      <div className="app-list">
        {items.map((item) => {
          // Menampilkan sebuah elemen div dengan kelas app-list yang berisi elemen-elemen berikut
          // Mengulangi setiap item dalam state variabel items
          // item adalah parameter yang menunjukkan setiap item dalam array items
          // Menampilkan sebuah komponen Item dengan properti key yang bernilai id item, item yang bernilai item, 
          // onUpdate yang bernilai fungsi handleUpdate, dan onDelete yang bernilai fungsi handleDelete
          return (
            <Item
              key={item.id}
              item={item}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            /> 
          );
        })}
      </div>
    </div>
  ); // Menampilkan sebuah elemen div dengan kelas app yang berisi elemen-elemen di atas
}

// Mengeskpor komponen App sebagai default
export default App; 
        
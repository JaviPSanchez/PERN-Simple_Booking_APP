import express from "express";
import cors from "cors";
import client from "./db.js";
/*
psql -U postgres

\l --> list all database in postgresql
\c --> move inside a database
\dt --> show table in database

CREATE DATABASE namedatabase;
CREATE TABLE nametable(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255)
);
ALTER TABLE books ADD COLUMN description VARCHAR(255), ADD COLUMN price INT, ADD COLUMN cover BYTEA;
ALTER TABLE books DROP COLUMN description;
ALTER TABLE table_name RENAME COLUMN column_name TO new_column_name;
*/

const app = express();
// Middleware
app.use(cors());
// Get access to the request body and get json data
app.use(express.json()); //req.body

//Check connection
client.connect(function (err) {
  if (err) throw err;
  console.log("Connected to Postgres also!");
});

//ROUTES

//CHECK BACKEND
app.get("/", (req, res) => {
  res.json("Hello my friend");
});
//SHOW ALL
app.get("/show_books", async (req, res) => {
  try {
    const allBooks = await client.query("SELECT * FROM books");
    res.json(allBooks.rows);
  } catch (err) {
    console.error(err.message);
  }
});
//SHOW SPECIFIC
app.get("/show_books/:id", async (req, res) => {
  try {
    // console.log(req.params);
    const { id } = req.params;
    const showBook = await client.query("SELECT * FROM books WHERE id = $1", [
      id,
    ]);
    res.json(showBook.rows);
  } catch (err) {
    console.error(err.message);
  }
});
//INSERT A BOOK
app.post("/books", async (req, res) => {
  try {
    // console.log(req.body);
    const { title, description, price } = req.body;
    const newBook = await client.query(
      "INSERT INTO books (title, description, price) VALUES($1,$2,$3) RETURNING *",
      [title, description, price]
    );
    res.json(newBook.rows);
  } catch (err) {
    console.error(err.message);
  }
});
//UPDATE
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, cover } = req.body;
    const updateBook = await client.query(
      "UPDATE books SET title = $1, description = $2, price = $3, cover = $4 WHERE id = $5",
      [title, description, price, cover, id]
    );
    res.json("Book was updated!");
  } catch (err) {
    console.error(err.message);
  }
});
//DELETE BOOK
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBook = client.query("DELETE FROM books WHERE id = $1", [id]);
    res.json("Book was deleted!");
  } catch (err) {
    console.error(err.message);
  }
});
//CHECK CONNECTION
app.listen(8800, () => {
  console.log("Connected!");
});

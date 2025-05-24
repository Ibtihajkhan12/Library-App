import React, { useEffect, useState } from "react";
import { supabase } from "../Config/Supabase"; // Adjust path as needed
import "./BookList.css";

const books = [
  {
    title: "Watchmen",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a2/Watchmen-cover.png",
  },
  {
    title: "City of Bones",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1432730315l/256683.jpg",
  },
  {
    title: "Batman Wedding",
    image: "https://m.media-amazon.com/images/I/81TzPfKtWWL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    title: "Battle of the Labyrinth",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1630542789l/2120932.jpg",
  },
  {
    title: "Shades of Magic",
    image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1540664781l/40158954.jpg",
  },
  {
    title: "Fence",
    image: "https://m.media-amazon.com/images/I/81kzv4epC2L.jpg",
  },
  {
    title: "The Flash",
    image: "https://m.media-amazon.com/images/I/81ClKy5ILZL.jpg",
  },
  {
    title: "Penny Dreadful",
    image: "https://m.media-amazon.com/images/I/71KH1bS1RAL.jpg",
  },
  {
    title: "Batman & Harley",
    image: "https://m.media-amazon.com/images/I/81WhRYGVtsL.jpg",
  },
  {
    title: "Hellboy",
    image: "https://m.media-amazon.com/images/I/91ZfW6mEoGL.jpg",
  },
];

const BookList = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserEmail(data.user.email);
        setUserName(data.user.user_metadata?.full_name || "User");
      }
    };
    getUser();
  }, []);

  return (
    <div className="book-section">
      <h2>Books! Check them out!</h2>

      {/* User info */}
      {userEmail && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <p><strong>Welcome:</strong> {userName}</p>
          <p><strong>Email:</strong> {userEmail}</p>
        </div>
      )}

      <div className="book-container">
        {books.map((book, index) => (
          <div className="book-card" key={index}>
            <img src={book.image} alt={book.title} />
            <p>{book.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;

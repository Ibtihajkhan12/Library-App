import { useEffect, useState } from "react";
import { supabase } from "../Config/Supabase";
import Slider from "react-slick";
import Swal from "sweetalert2";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    const fetchBooks = async () => {
      const { data, error } = await supabase.from("books").select("*");
      if (error) {
        console.error("Error fetching books:", error);
      } else {
        setBooks(data);
      }
      setLoading(false);
    };

    fetchUser();
    fetchBooks();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = () => {
    const found = books.find(
      (book) => book.name.toLowerCase() === searchTerm.trim().toLowerCase()
    );

    if (found) {
      setSearchResult(found);
    } else {
      setSearchResult(null);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Book not found!",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleAddRequest = async (book) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Please log in first",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Check if request already exists for this user and book
    const { data: existingRequests, error: fetchError } = await supabase
      .from("book_requests")
      .select("*")
      .eq("user_id", user.id)
      .eq("book_id", book.id);

    if (fetchError) {
      console.error(fetchError);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to check existing requests.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (existingRequests.length > 0) {
      Swal.fire({
        icon: "info",
        title: "Request Already Sent",
        text: `You have already requested the book "${book.name}".`,
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Insert new book request
    const { error } = await supabase.from("book_requests").insert([
      {
        user_id: user.id,
        user_email: user.email,
        user_name: user.user_metadata?.full_name || user.email,
        book_id: book.id,
        book_name: book.name,
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Error adding request:", error);
      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: `Could not add your book request: ${error.message}`,
        confirmButtonColor: "#d33",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Request Sent",
        text: `Your request for "${book.name}" has been sent to admin.`,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    cssEase: "linear",
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
    );

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      {/* Search Bar */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search book by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            padding: "10px",
            width: "300px",
            maxWidth: "90%",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "10px",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* Slider (Dynamic books) */}
      <div style={{ marginBottom: "30px" }}>
        <Slider {...sliderSettings}>
          {books.map((book) => (
            <div key={book.id} style={{ padding: "0 10px" }}>
              <img
                src={book.url}
                alt={book.name}
                style={{
                  width: "100%",
                  height: isMobile ? "180px" : "250px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <h4
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                {book.name}
              </h4>
            </div>
          ))}
        </Slider>
      </div>

      {/* Book Cards (Grid View) */}
      {!searchResult && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <img
                src={book.url}
                alt={book.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "15px", flexGrow: 1 }}>
                <h3 style={{ margin: "0 0 10px", fontSize: "18px" }}>
                  {book.name}
                </h3>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  {book.description}
                </p>
              </div>
              <div style={{ padding: "0 15px 15px" }}>
                <button
                  onClick={() => handleAddRequest(book)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  Add Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Result */}
      {searchResult && (
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              maxWidth: "350px",
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <img
              src={searchResult.url}
              alt={searchResult.name}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <div style={{ padding: "15px" }}>
              <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
                {searchResult.name}
              </h3>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {searchResult.description}
              </p>
              <button
                onClick={() => handleAddRequest(searchResult)}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "16px",
                  marginTop: "15px",
                }}
              >
                Add Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../Config/Supabase";
// import Slider from "react-slick";
// import Swal from "sweetalert2";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [fullName, setFullName] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResult, setSearchResult] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const books = [
//     {
//       name: "The Great Gatsby",
//       url: "https://covers.openlibrary.org/b/id/10523384-L.jpg",
//       description: "A classic novel by F. Scott Fitzgerald.",
//     },
//     {
//       name: "To Kill a Mockingbird",
//       url: "https://covers.openlibrary.org/b/id/10446285-L.jpg",
//       description: "A novel by Harper Lee about racial injustice.",
//     },
//     {
//       name: "1984",
//       url: "https://covers.openlibrary.org/b/id/10517497-L.jpg",
//       description: "A dystopian novel by George Orwell.",
//     },
//   ];

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 1000,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     cssEase: "linear",
//   };

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       const {
//         data: { user },
//         error: authError,
//       } = await supabase.auth.getUser();

//       if (authError || !user) {
//         console.error("Auth error:", authError);
//         setLoading(false);
//         navigate("/Login");
//         return;
//       }

//       const { data: userData, error: userError } = await supabase
//         .from("users")
//         .select("name")
//         .eq("id", user.id)
//         .single();

//       if (userError) {
//         console.error("Error fetching name:", userError.message);
//       } else {
//         setFullName(userData.name);
//       }

//       const { data: roleData, error: roleError } = await supabase
//         .from("roles")
//         .select("role")
//         .eq("user_id", user.id)
//         .single();

//       if (roleError) {
//         console.error("Error fetching role:", roleError.message);
//       } else if (roleData?.role === "admin") {
//         setTimeout(() => navigate("/AdminDashboard"), 100);
//         return;
//       }

//       setLoading(false);
//     };

//     fetchUserDetails();
//   }, [navigate]);

//   const handleSearch = () => {
//     const found = books.find(
//       (book) => book.name.toLowerCase() === searchTerm.trim().toLowerCase()
//     );

//     if (found) {
//       setSearchResult(found);
//     } else {
//       setSearchResult(null);
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Book not found!",
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "Okay",
//       });
//     }
//   };

//   const handleAddRequest = async (bookName) => {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       Swal.fire("Unauthorized", "Please login first", "warning");
//       navigate("/Login");
//       return;
//     }

//     const { error } = await supabase.from("book_requests").insert([
//       {
//         user_id: user.id,
//         book_name: bookName,
//       },
//     ]);

//    if (error) {
//   console.error("Insert error:", error.message);
//   Swal.fire("Error", `Failed to add request: ${error.message}`, "error");
// }else {
//       Swal.fire("Success", "Book request added successfully", "success");
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div style={styles.headerBar}>
//         <div style={styles.logo}>BookSwap ⇌</div>
//         <div>
//           <button style={styles.navButton} onClick={() => navigate("/Signup")}>
//             Signup
//           </button>
//           <button style={styles.navButton} onClick={() => navigate("/Login")}>
//             Login
//           </button>
//         </div>
//       </div>

//       <div style={styles.container}>
//         <h2>Welcome to Your Project{fullName && `, ${fullName}`}!</h2>

//         <div style={{ marginBottom: "20px" }}>
//           <input
//             type="text"
//             placeholder="Search book by name"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={styles.searchInput}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//           />
//           <button onClick={handleSearch} style={styles.searchButton}>
//             Search
//           </button>
//         </div>

//         <div style={styles.cardsSection}>
//           {books.slice(0, 3).map((book, index) => (
//             <div key={index} style={styles.card}>
//               <img src={book.url} alt={book.name} style={styles.cardImage} />
//               <h3>{book.name}</h3>
//               <p>{book.description}</p>
//               <button
//                 style={styles.cardButton}
//                 onClick={() => handleAddRequest(book.name)}
//               >
//                 Add to Request
//               </button>
//             </div>
//           ))}
//         </div>

//         {searchResult && (
//           <div style={styles.bookCard}>
//             <img
//               src={searchResult.url}
//               alt={searchResult.name}
//               style={styles.bookImage}
//             />
//             <h3>{searchResult.name}</h3>
//             <p>{searchResult.description}</p>
//             <button
//               style={styles.bookButton}
//               onClick={() => handleAddRequest(searchResult.name)}
//             >
//               Add to Request
//             </button>
//           </div>
//         )}

//         {!searchResult && searchTerm === "" && (
//           <>
//             <p>Here are some featured books in the slider:</p>
//             <Slider {...sliderSettings}>
//               {books.map((book, index) => (
//                 <div key={index} style={styles.slide}>
//                   <img src={book.url} alt={book.name} style={styles.image} />
//                   <h4>{book.name}</h4>
//                   <p>{book.description}</p>
//                   <button
//                     style={styles.bookButton}
//                     onClick={() => handleAddRequest(book.name)}
//                   >
//                     Add to Request
//                   </button>
//                 </div>
//               ))}
//             </Slider>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   headerBar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#333",
//     color: "#fff",
//     padding: "10px 20px",
//   },
//   logo: {
//     fontSize: "20px",
//     fontWeight: "bold",
//   },
//   navButton: {
//     marginLeft: "10px",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     border: "none",
//     padding: "8px 14px",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   container: {
//     maxWidth: "900px",
//     margin: "auto",
//     padding: "20px",
//     fontFamily: "Arial",
//     marginTop: "30px",
//     textAlign: "center",
//   },
//   searchInput: {
//     padding: "8px 12px",
//     fontSize: "16px",
//     width: "250px",
//     borderRadius: "6px",
//     border: "1px solid #ccc",
//     marginRight: "10px",
//   },
//   searchButton: {
//     padding: "8px 16px",
//     fontSize: "16px",
//     borderRadius: "6px",
//     border: "none",
//     backgroundColor: "#28a745",
//     color: "white",
//     cursor: "pointer",
//   },
//   cardsSection: {
//     display: "flex",
//     justifyContent: "space-between",
//     gap: "20px",
//     marginBottom: "30px",
//   },
//   card: {
//     flex: "1",
//     backgroundColor: "#fff",
//     borderRadius: "12px",
//     boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
//     padding: "15px",
//     textAlign: "center",
//   },
//   cardImage: {
//     width: "100%",
//     height: "200px",
//     objectFit: "cover",
//     borderRadius: "10px",
//     marginBottom: "15px",
//   },
//   cardButton: {
//     padding: "10px 20px",
//     backgroundColor: "#007bff",
//     border: "none",
//     borderRadius: "6px",
//     color: "#fff",
//     fontWeight: "bold",
//     cursor: "pointer",
//   },
//   slide: {
//     padding: "10px",
//     textAlign: "center",
//   },
//   image: {
//     width: "100%",
//     height: "300px",
//     objectFit: "cover",
//     borderRadius: "10px",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
//   },
//   bookCard: {
//     maxWidth: "400px",
//     margin: "auto",
//     border: "1px solid #ccc",
//     borderRadius: "12px",
//     padding: "20px",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//   },
//   bookImage: {
//     width: "100%",
//     height: "350px",
//     objectFit: "cover",
//     borderRadius: "12px",
//   },
//   bookButton: {
//     marginTop: "15px",
//     padding: "10px 20px",
//     fontSize: "16px",
//     backgroundColor: "#2196F3",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//   },
// };

// export default Dashboard;



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Config/Supabase";
import Slider from "react-slick";
import Swal from "sweetalert2";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const books = [
    {
      name: "The Great Gatsby",
      url: "https://covers.openlibrary.org/b/id/10523384-L.jpg",
      description: "A classic novel by F. Scott Fitzgerald.",
    },
    {
      name: "To Kill a Mockingbird",
      url: "https://covers.openlibrary.org/b/id/10446285-L.jpg",
      description: "A novel by Harper Lee about racial injustice.",
    },
    {
      name: "1984",
      url: "https://covers.openlibrary.org/b/id/10517497-L.jpg",
      description: "A dystopian novel by George Orwell.",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    cssEase: "linear",
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Auth error:", authError);
        setLoading(false);
        navigate("/Login");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();

      if (userError) {
        console.error("Error fetching name:", userError.message);
      } else {
        setFullName(userData.name);
      }

      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roleError) {
        console.error("Error fetching role:", roleError.message);
      } else if (roleData?.role === "admin") {
        setTimeout(() => navigate("/AdminDashboard"), 100);
        return;
      }

      setLoading(false);
    };

    fetchUserDetails();
  }, [navigate]);

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
        confirmButtonText: "Okay",
      });
    }
  };

  const handleAddRequest = async (bookName) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Swal.fire("Unauthorized", "Please login first", "warning");
      navigate("/Login");
      return;
    }

    const { error } = await supabase.from("book_requests").insert([
      {
        user_id: user.id,
        book_name: bookName,
      },
    ]);

    if (error) {
      console.error("Insert error:", error.message);
      Swal.fire("Error", `Failed to add request: ${error.message}`, "error");
    } else {
      Swal.fire("Success", "Book request added successfully", "success");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      Swal.fire("Error", "Failed to logout", "error");
    } else {
      Swal.fire("Logged out", "You have been logged out", "success");
      navigate("/Signup");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div style={styles.headerBar}>
        <div style={styles.logo}>BookSwap ⇌</div>
        <div>
          <button style={styles.navButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.container}>
        <h2>Welcome to Your Project{fullName && `, ${fullName}`}!</h2>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search book by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} style={styles.searchButton}>
            Search
          </button>
        </div>

        <div style={styles.cardsSection}>
          {books.slice(0, 3).map((book, index) => (
            <div key={index} style={styles.card}>
              <img src={book.url} alt={book.name} style={styles.cardImage} />
              <h3>{book.name}</h3>
              <p>{book.description}</p>
              <button
                style={styles.cardButton}
                onClick={() => handleAddRequest(book.name)}
              >
                Add to Request
              </button>
            </div>
          ))}
        </div>

        {searchResult && (
          <div style={styles.bookCard}>
            <img
              src={searchResult.url}
              alt={searchResult.name}
              style={styles.bookImage}
            />
            <h3>{searchResult.name}</h3>
            <p>{searchResult.description}</p>
            <button
              style={styles.bookButton}
              onClick={() => handleAddRequest(searchResult.name)}
            >
              Add to Request
            </button>
          </div>
        )}

        {!searchResult && searchTerm === "" && (
          <>
            <p>Here are some featured books in the slider:</p>
            <Slider {...sliderSettings}>
              {books.map((book, index) => (
                <div key={index} style={styles.slide}>
                  <img src={book.url} alt={book.name} style={styles.image} />
                  <h4>{book.name}</h4>
                  <p>{book.description}</p>
                  <button
                    style={styles.bookButton}
                    onClick={() => handleAddRequest(book.name)}
                  >
                    Add to Request
                  </button>
                </div>
              ))}
            </Slider>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px 20px",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  navButton: {
    marginLeft: "10px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  container: {
    maxWidth: "900px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial",
    marginTop: "30px",
    textAlign: "center",
  },
  searchInput: {
    padding: "8px 12px",
    fontSize: "16px",
    width: "250px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  searchButton: {
    padding: "8px 16px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#28a745",
    color: "white",
    cursor: "pointer",
  },
  cardsSection: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    flex: "1",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    padding: "15px",
    textAlign: "center",
  },
  cardImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  cardButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  slide: {
    padding: "10px",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  bookCard: {
    maxWidth: "400px",
    margin: "auto",
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  bookImage: {
    width: "100%",
    height: "350px",
    objectFit: "cover",
    borderRadius: "12px",
  },
  bookButton: {
    marginTop: "15px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Dashboard;

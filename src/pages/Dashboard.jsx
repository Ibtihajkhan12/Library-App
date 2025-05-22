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
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
//     slidesToShow: isMobile ? 1 : 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     cssEase: "linear",
//   };

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);

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

//       const { data: userData } = await supabase
//         .from("users")
//         .select("name")
//         .eq("id", user.id)
//         .single();

//       if (userData) setFullName(userData.name);

//       const { data: roleData } = await supabase
//         .from("roles")
//         .select("role")
//         .eq("user_id", user.id)
//         .single();

//       if (roleData?.role === "admin") {
//         setTimeout(() => navigate("/AdminDashboard"), 100);
//         return;
//       }

//       setLoading(false);
//     };

//     fetchUserDetails();
//     return () => window.removeEventListener("resize", handleResize);
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

//     if (error) {
//       Swal.fire("Error", `Failed to add request: ${error.message}`, "error");
//     } else {
//       Swal.fire("Success", "Book request added successfully", "success");
//     }
//   };

//   const handleLogout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       Swal.fire("Error", "Failed to logout", "error");
//     } else {
//       Swal.fire("Logged out", "You have been logged out", "success");
//       navigate("/Signup");
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
//       {/* Top Header */}
//       <div style={styles.headerBar}>
//         <div style={styles.logo}>BookSwap ⇌</div>
//         <div style={styles.navGroup}>
//           <button style={styles.navButton} onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </div>

//       <div style={styles.container}>
//         <h2>Welcome to BookSwap{fullName && `, ${fullName}`}!</h2>

//         {/* Search */}
//         <div style={styles.searchSection}>
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

//         {/* Book Cards */}
//         <div style={styles.cardsSection}>
//           {books.map((book, index) => (
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

//         {/* Search Result Card */}
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

//         {/* Slider */}
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
//     flexWrap: "wrap",
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
//   navGroup: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "10px",
//     marginTop: "10px",
//   },
//   navButton: {
//     backgroundColor: "#ff4d4d",
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
//   searchSection: {
//     marginBottom: "20px",
//     display: "flex",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     gap: "10px",
//   },
//   searchInput: {
//     padding: "8px 12px",
//     fontSize: "16px",
//     width: "min(100%, 250px)",
//     borderRadius: "6px",
//     border: "1px solid #ccc",
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
//     flexWrap: "wrap",
//     justifyContent: "center",
//     gap: "20px",
//     marginBottom: "30px",
//   },
//   card: {
//     flex: "1 1 280px",
//     maxWidth: "300px",
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


// import { useEffect, useState } from "react";
// import { supabase } from "../Config/Supabase";
// import Slider from "react-slick";
// import Swal from "sweetalert2";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const Dashboard = () => {
//   const [books, setBooks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResult, setSearchResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);

//     const fetchBooks = async () => {
//       const { data, error } = await supabase.from("books").select("*");
//       if (error) {
//         console.error("Error fetching books:", error);
//       } else {
//         setBooks(data);
//       }
//       setLoading(false);
//     };

//     fetchBooks();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

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
//       });
//     }
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 1000,
//     slidesToShow: isMobile ? 1 : 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     cssEase: "linear",
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       {/* Search Section */}
//       <div>
//         <input
//           type="text"
//           placeholder="Search book by name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//         />
//         <button onClick={handleSearch}>Search</button>
//       </div>

//       {/* Book Cards */}
//       <div>
//         {books.map((book) => (
//           <div key={book.id}>
//             <img src={book.url} alt={book.name} />
//             <h3>{book.name}</h3>
//             <p>{book.description}</p>
//           </div>
//         ))}
//       </div>

//       {/* Search Result */}
//       {searchResult && (
//         <div>
//           <img src={searchResult.url} alt={searchResult.name} />
//           <h3>{searchResult.name}</h3>
//           <p>{searchResult.description}</p>
//         </div>
//       )}

//       {/* Slider */}
//       {!searchResult && searchTerm === "" && (
//         <Slider {...sliderSettings}>
//           {books.map((book) => (
//             <div key={book.id}>
//               <img src={book.url} alt={book.name} />
//               <h4>{book.name}</h4>
//               <p>{book.description}</p>
//             </div>
//           ))}
//         </Slider>
//       )}
//     </div>
//   );
// };

// export default Dashboard;




// import { useEffect, useState } from "react";
// import { supabase } from "../Config/Supabase";
// import Slider from "react-slick";
// import Swal from "sweetalert2";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const Dashboard = () => {
//   const [books, setBooks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResult, setSearchResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);

//     const fetchBooks = async () => {
//       const { data, error } = await supabase.from("books").select("*");
//       if (error) {
//         console.error("Error fetching books:", error);
//       } else {
//         setBooks(data);
//       }
//       setLoading(false);
//     };

//     fetchBooks();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

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
//       });
//     }
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 1000,
//     slidesToShow: isMobile ? 1 : 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     cssEase: "linear",
//   };

//   if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;

//   return (
//     <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
//       {/* Search Bar */}
//       <div style={{ textAlign: "center", marginBottom: "30px" }}>
//         <input
//           type="text"
//           placeholder="Search book by name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//           style={{
//             padding: "10px",
//             width: "300px",
//             maxWidth: "90%",
//             borderRadius: "6px",
//             border: "1px solid #ccc",
//             marginRight: "10px",
//             fontSize: "16px",
//           }}
//         />
//         <button
//           onClick={handleSearch}
//           style={{
//             padding: "10px 20px",
//             borderRadius: "6px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             fontSize: "16px",
//             cursor: "pointer",
//           }}
//         >
//           Search
//         </button>
//       </div>

//       {/* Book Cards (Grid View) */}
//       {!searchResult && (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//             gap: "20px",
//           }}
//         >
//           {books.map((book) => (
//             <div
//               key={book.id}
//               style={{
//                 backgroundColor: "#fff",
//                 borderRadius: "12px",
//                 boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <img
//                 src={book.url}
//                 alt={book.name}
//                 style={{
//                   width: "100%",
//                   height: "180px",
//                   objectFit: "cover",
//                 }}
//               />
//               <div style={{ padding: "15px" }}>
//                 <h3 style={{ margin: "0 0 10px", fontSize: "18px" }}>{book.name}</h3>
//                 <p style={{ fontSize: "14px", color: "#666" }}>{book.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Search Result */}
//       {searchResult && (
//         <div
//           style={{
//             marginTop: "40px",
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <div
//             style={{
//               maxWidth: "350px",
//               width: "100%",
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//               overflow: "hidden",
//             }}
//           >
//             <img
//               src={searchResult.url}
//               alt={searchResult.name}
//               style={{ width: "100%", height: "200px", objectFit: "cover" }}
//             />
//             <div style={{ padding: "15px" }}>
//               <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>{searchResult.name}</h3>
//               <p style={{ fontSize: "14px", color: "#555" }}>{searchResult.description}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Slider */}
//       {!searchResult && searchTerm === "" && (
//         <div style={{ marginTop: "60px" }}>
//           <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Explore More Books</h2>
//           <Slider {...sliderSettings}>
//             {books.map((book) => (
//               <div key={book.id}>
//                 <div
//                   style={{
//                     backgroundColor: "#fff",
//                     margin: "0 10px",
//                     borderRadius: "12px",
//                     overflow: "hidden",
//                     boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//                   }}
//                 >
//                   <img
//                     src={book.url}
//                     alt={book.name}
//                     style={{ width: "100%", height: "180px", objectFit: "cover" }}
//                   />
//                   <div style={{ padding: "15px" }}>
//                     <h4 style={{ margin: "0 0 10px" }}>{book.name}</h4>
//                     <p style={{ fontSize: "14px", color: "#666" }}>{book.description}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


// import { useEffect, useState } from "react";
// import { supabase } from "../Config/Supabase";
// import Slider from "react-slick";
// import Swal from "sweetalert2";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const Dashboard = () => {
//   const [books, setBooks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResult, setSearchResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [user, setUser] = useState(null); // store logged-in user

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);

//     // Get current user on load
//     const fetchUser = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       setUser(user);
//     };

//     const fetchBooks = async () => {
//       const { data, error } = await supabase.from("books").select("*");
//       if (error) {
//         console.error("Error fetching books:", error);
//       } else {
//         setBooks(data);
//       }
//       setLoading(false);
//     };

//     fetchUser();
//     fetchBooks();

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

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
//       });
//     }
//   };

//   const handleAddRequest = async (book) => {
//     if (!user) {
//       Swal.fire({
//         icon: "warning",
//         title: "Please log in first",
//         confirmButtonColor: "#3085d6",
//       });
//       return;
//     }

//     // Check if request already exists for this user and book (optional)
//     const { data: existingRequests, error: fetchError } = await supabase
//       .from("book_requests")
//       .select("*")
//       .eq("user_id", user.id)
//       .eq("book_id", book.id);

//     if (fetchError) {
//       console.error(fetchError);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to check existing requests.",
//         confirmButtonColor: "#d33",
//       });
//       return;
//     }

//     if (existingRequests.length > 0) {
//       Swal.fire({
//         icon: "info",
//         title: "Request Already Sent",
//         text: `You have already requested the book "${book.name}".`,
//         confirmButtonColor: "#3085d6",
//       });
//       return;
//     }

//     // Insert new request
//     const { error } = await supabase.from("book_requests").insert([
//       {
//         user_id: user.id,
//         user_email: user.email,
//         user_name: user.user_metadata?.full_name || user.email,
//         book_id: book.id,
//         book_name: book.name,
//         status: "pending", // default status
//       },
//     ]);

//     if (error) {
//       console.error("Error adding request:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Request Failed",
//         text: "Could not add your book request. Try again later.",
//         confirmButtonColor: "#d33",
//       });
//     } else {
//       Swal.fire({
//         icon: "success",
//         title: "Request Sent",
//         text: `Your request for "${book.name}" has been sent to admin.`,
//         confirmButtonColor: "#3085d6",
//       });
//     }
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 1000,
//     slidesToShow: isMobile ? 1 : 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     cssEase: "linear",
//   };

//   if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;

//   return (
//     <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
//       {/* Search Bar */}
//       <div style={{ textAlign: "center", marginBottom: "30px" }}>
//         <input
//           type="text"
//           placeholder="Search book by name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//           style={{
//             padding: "10px",
//             width: "300px",
//             maxWidth: "90%",
//             borderRadius: "6px",
//             border: "1px solid #ccc",
//             marginRight: "10px",
//             fontSize: "16px",
//           }}
//         />
//         <button
//           onClick={handleSearch}
//           style={{
//             padding: "10px 20px",
//             borderRadius: "6px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             fontSize: "16px",
//             cursor: "pointer",
//           }}
//         >
//           Search
//         </button>
//       </div>

//       {/* Book Cards (Grid View) */}
//       {!searchResult && (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//             gap: "20px",
//           }}
//         >
//           {books.map((book) => (
//             <div
//               key={book.id}
//               style={{
//                 backgroundColor: "#fff",
//                 borderRadius: "12px",
//                 boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <img
//                 src={book.url}
//                 alt={book.name}
//                 style={{
//                   width: "100%",
//                   height: "180px",
//                   objectFit: "cover",
//                 }}
//               />
//               <div style={{ padding: "15px", flexGrow: 1 }}>
//                 <h3 style={{ margin: "0 0 10px", fontSize: "18px" }}>{book.name}</h3>
//                 <p style={{ fontSize: "14px", color: "#666" }}>{book.description}</p>
//               </div>
//               {/* Add Request Button */}
//               <div style={{ padding: "0 15px 15px" }}>
//                 <button
//                   onClick={() => handleAddRequest(book)}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     backgroundColor: "#007bff",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                     fontSize: "16px",
//                   }}
//                 >
//                   Add Request
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Search Result */}
//       {searchResult && (
//         <div
//           style={{
//             marginTop: "40px",
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <div
//             style={{
//               maxWidth: "350px",
//               width: "100%",
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//               overflow: "hidden",
//             }}
//           >
//             <img
//               src={searchResult.url}
//               alt={searchResult.name}
//               style={{ width: "100%", height: "200px", objectFit: "cover" }}
//             />
//             <div style={{ padding: "15px" }}>
//               <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>{searchResult.name}</h3>
//               <p style={{ fontSize: "14px", color: "#555" }}>{searchResult.description}</p>
//               <button
//                 onClick={() => handleAddRequest(searchResult)}
//                 style={{
//                   width: "100%",
//                   padding: "10px",
//                   backgroundColor: "#007bff",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "6px",
//                   cursor: "pointer",
//                   fontSize: "16px",
//                   marginTop: "15px",
//                 }}
//               >
//                 Add Request
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;




// import { useEffect, useState } from "react";
// import { supabase } from "../Config/Supabase";
// import Slider from "react-slick";
// import Swal from "sweetalert2";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const Dashboard = () => {
//   const [books, setBooks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResult, setSearchResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);

//     const fetchUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//     };

//     const fetchBooks = async () => {
//       const { data, error } = await supabase.from("books").select("*");
//       if (error) {
//         console.error("Error fetching books:", error);
//       } else {
//         setBooks(data);
//       }
//       setLoading(false);
//     };

//     fetchUser();
//     fetchBooks();

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

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
//       });
//     }
//   };

//   const handleAddRequest = async (book) => {
//     if (!user) {
//       Swal.fire({
//         icon: "warning",
//         title: "Please log in first",
//         confirmButtonColor: "#3085d6",
//       });
//       return;
//     }

//     const { data: existingRequests, error: fetchError } = await supabase
//       .from("book_requests")
//       .select("*")
//       .eq("user_id", user.id)
//       .eq("book_id", book.id);

//     if (fetchError) {
//       console.error(fetchError);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to check existing requests.",
//         confirmButtonColor: "#d33",
//       });
//       return;
//     }

//     if (existingRequests.length > 0) {
//       Swal.fire({
//         icon: "info",
//         title: "Request Already Sent",
//         text: `You have already requested the book "${book.name}".`,
//         confirmButtonColor: "#3085d6",
//       });
//       return;
//     }

//     const { error } = await supabase.from("book_requests").insert([
//       {
//         user_id: user.id,
//         user_email: user.email,
//         user_name: user.user_metadata?.full_name || user.email,
//         book_id: book.id,
//         book_name: book.name,
//         status: "pending",
//       },
//     ]);

//     if (error) {
//       console.error("Error adding request:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Request Failed",
//         text: "Could not add your book request. Try again later.",
//         confirmButtonColor: "#d33",
//       });
//     } else {
//       Swal.fire({
//         icon: "success",
//         title: "Request Sent",
//         text: `Your request for "${book.name}" has been sent to admin.`,
//         confirmButtonColor: "#3085d6",
//       });
//     }
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 1000,
//     slidesToShow: isMobile ? 1 : 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     cssEase: "linear",
//   };

//   if (loading)
//     return (
//       <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
//     );

//   return (
//     <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
//       {/* === DYNAMIC BOOK SLIDER START === */}
//       {books.length > 0 && (
//         <div style={{ marginBottom: "40px" }}>
//           <Slider {...sliderSettings}>
//             {books.map((book) => (
//               <div
//                 key={book.id}
//                 style={{
//                   padding: "10px",
//                   outline: "none", // removes blue border on focus
//                 }}
//               >
//                 <div
//                   style={{
//                     backgroundColor: "#fff",
//                     borderRadius: "12px",
//                     boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//                     overflow: "hidden",
//                     cursor: "pointer",
//                     height: "300px",
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                   onClick={() => handleAddRequest(book)} // clicking slider card can add request optionally
//                   title={`Request "${book.name}"`}
//                 >
//                   <img
//                     src={book.url}
//                     alt={book.name}
//                     style={{
//                       width: "100%",
//                       maxHeight: "200px",
//                       objectFit: "cover",
//                       borderBottom: "1px solid #eee",
//                     }}
//                   />
//                   <h3
//                     style={{
//                       margin: "15px 0 0",
//                       fontSize: "18px",
//                       textAlign: "center",
//                       padding: "0 10px",
//                     }}
//                   >
//                     {book.name}
//                   </h3>
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </div>
//       )}
//       {/* === DYNAMIC BOOK SLIDER END === */}

//       {/* Search Bar */}
//       <div style={{ textAlign: "center", marginBottom: "30px" }}>
//         <input
//           type="text"
//           placeholder="Search book by name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//           style={{
//             padding: "10px",
//             width: "300px",
//             maxWidth: "90%",
//             borderRadius: "6px",
//             border: "1px solid #ccc",
//             marginRight: "10px",
//             fontSize: "16px",
//           }}
//         />
//         <button
//           onClick={handleSearch}
//           style={{
//             padding: "10px 20px",
//             borderRadius: "6px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             fontSize: "16px",
//             cursor: "pointer",
//           }}
//         >
//           Search
//         </button>
//       </div>

//       {/* Book Cards (Grid View) */}
//       {!searchResult && (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//             gap: "20px",
//           }}
//         >
//           {books.map((book) => (
//             <div
//               key={book.id}
//               style={{
//                 backgroundColor: "#fff",
//                 borderRadius: "12px",
//                 boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <img
//                 src={book.url}
//                 alt={book.name}
//                 style={{
//                   width: "100%",
//                   height: "180px",
//                   objectFit: "cover",
//                 }}
//               />
//               <div style={{ padding: "15px", flexGrow: 1 }}>
//                 <h3 style={{ margin: "0 0 10px", fontSize: "18px" }}>
//                   {book.name}
//                 </h3>
//                 <p style={{ fontSize: "14px", color: "#666" }}>
//                   {book.description}
//                 </p>
//               </div>
//               {/* Add Request Button */}
//               <div style={{ padding: "0 15px 15px" }}>
//                 <button
//                   onClick={() => handleAddRequest(book)}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     backgroundColor: "#007bff",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                     fontSize: "16px",
//                   }}
//                 >
//                   Add Request
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Search Result */}
//       {searchResult && (
//         <div
//           style={{
//             marginTop: "40px",
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <div
//             style={{
//               maxWidth: "350px",
//               width: "100%",
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//               overflow: "hidden",
//             }}
//           >
//             <img
//               src={searchResult.url}
//               alt={searchResult.name}
//               style={{ width: "100%", height: "200px", objectFit: "cover" }}
//             />
//             <div style={{ padding: "15px" }}>
//               <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
//                 {searchResult.name}
//               </h3>
//               <p style={{ fontSize: "14px", color: "#555" }}>
//                 {searchResult.description}
//               </p>
//               <button
//                 onClick={() => handleAddRequest(searchResult)}
//                 style={{
//                   width: "100%",
//                   padding: "10px",
//                   backgroundColor: "#007bff",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "6px",
//                   cursor: "pointer",
//                   fontSize: "16px",
//                   marginTop: "15px",
//                 }}
//               >
//                 Add Request
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;



// import { useEffect, useState } from "react";
// import { supabase } from "../Config/Supabase";
// import Slider from "react-slick";
// import Swal from "sweetalert2";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const Dashboard = () => {
//   const [books, setBooks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResult, setSearchResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);

//     const fetchUser = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       setUser(user);
//     };

//     const fetchBooks = async () => {
//       const { data, error } = await supabase.from("books").select("*");
//       if (error) {
//         console.error("Error fetching books:", error);
//       } else {
//         setBooks(data);
//       }
//       setLoading(false);
//     };

//     fetchUser();
//     fetchBooks();

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

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
//       });
//     }
//   };

//   const handleAddRequest = async (book) => {
//     if (!user) {
//       Swal.fire({
//         icon: "warning",
//         title: "Please log in first",
//         confirmButtonColor: "#3085d6",
//       });
//       return;
//     }

//     const { data: existingRequests, error: fetchError } = await supabase
//       .from("book_requests")
//       .select("*")
//       .eq("user_id", user.id)
//       .eq("book_id", book.id);

//     if (fetchError) {
//       console.error(fetchError);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to check existing requests.",
//         confirmButtonColor: "#d33",
//       });
//       return;
//     }

//     if (existingRequests.length > 0) {
//       Swal.fire({
//         icon: "info",
//         title: "Request Already Sent",
//         text: `You have already requested the book "${book.name}".`,
//         confirmButtonColor: "#3085d6",
//       });
//       return;
//     }

//     const { error } = await supabase.from("book_requests").insert([
//       {
//         user_id: user.id,
//         user_email: user.email,
//         user_name: user.user_metadata?.full_name || user.email,
//         book_id: book.id,
//         book_name: book.name,
//         status: "pending",
//       },
//     ]);

//     if (error) {
//       console.error("Error adding request:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Request Failed",
//         text: "Could not add your book request. Try again later.",
//         confirmButtonColor: "#d33",
//       });
//     } else {
//       Swal.fire({
//         icon: "success",
//         title: "Request Sent",
//         text: `Your request for "${book.name}" has been sent to admin.`,
//         confirmButtonColor: "#3085d6",
//       });
//     }
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 1000,
//     slidesToShow: isMobile ? 1 : 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     cssEase: "linear",
//   };

//   if (loading)
//     return (
//       <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
//     );

//   return (
//     <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
//       {/* Search Bar */}
//       <div style={{ textAlign: "center", marginBottom: "20px" }}>
//         <input
//           type="text"
//           placeholder="Search book by name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//           style={{
//             padding: "10px",
//             width: "300px",
//             maxWidth: "90%",
//             borderRadius: "6px",
//             border: "1px solid #ccc",
//             marginRight: "10px",
//             fontSize: "16px",
//           }}
//         />
//         <button
//           onClick={handleSearch}
//           style={{
//             padding: "10px 20px",
//             borderRadius: "6px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             fontSize: "16px",
//             cursor: "pointer",
//           }}
//         >
//           Search
//         </button>
//       </div>

//       {/* Slider (Dynamic books) */}
//       <div style={{ marginBottom: "30px" }}>
//         <Slider {...sliderSettings}>
//           {books.map((book) => (
//             <div key={book.id} style={{ padding: "0 10px" }}>
//               <img
//                 src={book.url}
//                 alt={book.name}
//                 style={{
//                   width: "100%",
//                   height: isMobile ? "180px" : "250px",
//                   objectFit: "cover",
//                   borderRadius: "10px",
//                 }}
//               />
//               <h4
//                 style={{
//                   textAlign: "center",
//                   marginTop: "10px",
//                   fontSize: "16px",
//                   color: "#333",
//                 }}
//               >
//                 {book.name}
//               </h4>
//             </div>
//           ))}
//         </Slider>
//       </div>

//       {/* Book Cards (Grid View) */}
//       {!searchResult && (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//             gap: "20px",
//           }}
//         >
//           {books.map((book) => (
//             <div
//               key={book.id}
//               style={{
//                 backgroundColor: "#fff",
//                 borderRadius: "12px",
//                 boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <img
//                 src={book.url}
//                 alt={book.name}
//                 style={{
//                   width: "100%",
//                   height: "180px",
//                   objectFit: "cover",
//                 }}
//               />
//               <div style={{ padding: "15px", flexGrow: 1 }}>
//                 <h3 style={{ margin: "0 0 10px", fontSize: "18px" }}>
//                   {book.name}
//                 </h3>
//                 <p style={{ fontSize: "14px", color: "#666" }}>
//                   {book.description}
//                 </p>
//               </div>
//               <div style={{ padding: "0 15px 15px" }}>
//                 <button
//                   onClick={() => handleAddRequest(book)}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     backgroundColor: "#007bff",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                     fontSize: "16px",
//                   }}
//                 >
//                   Add Request
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Search Result */}
//       {searchResult && (
//         <div
//           style={{
//             marginTop: "40px",
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <div
//             style={{
//               maxWidth: "350px",
//               width: "100%",
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//               overflow: "hidden",
//             }}
//           >
//             <img
//               src={searchResult.url}
//               alt={searchResult.name}
//               style={{ width: "100%", height: "200px", objectFit: "cover" }}
//             />
//             <div style={{ padding: "15px" }}>
//               <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
//                 {searchResult.name}
//               </h3>
//               <p style={{ fontSize: "14px", color: "#555" }}>
//                 {searchResult.description}
//               </p>
//               <button
//                 onClick={() => handleAddRequest(searchResult)}
//                 style={{
//                   width: "100%",
//                   padding: "10px",
//                   backgroundColor: "#007bff",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "6px",
//                   cursor: "pointer",
//                   fontSize: "16px",
//                   marginTop: "15px",
//                 }}
//               >
//                 Add Request
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;




// import { useEffect, useState, useCallback } from "react";
// import { supabase } from "../Config/Supabase";
// import Slider from "react-slick";
// import Swal from "sweetalert2";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const LoadingSpinner = () => (
//   <div style={{ textAlign: "center", padding: "50px", fontSize: 24 }}>
//     Loading...
//   </div>
// );

// const Dashboard = () => {
//   const [books, setBooks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResult, setSearchResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [user, setUser] = useState(null);

//   // Debounced resize handler
//   useEffect(() => {
//     let timeoutId;
//     const handleResize = () => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         setIsMobile(window.innerWidth < 768);
//       }, 150);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//       clearTimeout(timeoutId);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   // Fetch user and books on mount
//   useEffect(() => {
//     async function fetchUserAndBooks() {
//       setLoading(true);
//       try {
//         const {
//           data: { user: currentUser },
//           error: userError,
//         } = await supabase.auth.getUser();

//         if (userError) {
//           console.error("Error fetching user:", userError);
//           Swal.fire({
//             icon: "error",
//             title: "User Fetch Error",
//             text: "Failed to get user info.",
//             confirmButtonColor: "#d33",
//           });
//         }
//         setUser(currentUser || null);

//         const { data: booksData, error: booksError } = await supabase
//           .from("books")
//           .select("*");
//         if (booksError) {
//           console.error("Error fetching books:", booksError);
//           Swal.fire({
//             icon: "error",
//             title: "Books Fetch Error",
//             text: "Failed to fetch books.",
//             confirmButtonColor: "#d33",
//           });
//         } else {
//           setBooks(booksData || []);
//         }
//       } catch (err) {
//         console.error("Unexpected error:", err);
//       }
//       setLoading(false);
//     }
//     fetchUserAndBooks();
//   }, []);

//   const handleSearch = useCallback(() => {
//     if (!searchTerm.trim()) return;

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
//       });
//     }
//   }, [searchTerm, books]);

//   const handleAddRequest = async (book) => {
//     if (!user) {
//       Swal.fire({
//         icon: "warning",
//         title: "Please log in first",
//         confirmButtonColor: "#3085d6",
//       });
//       return;
//     }

//     try {
//       const { data: existingRequests, error: fetchError } = await supabase
//         .from("book_requests")
//         .select("*")
//         .eq("user_id", user.id)
//         .eq("book_id", book.id);

//       if (fetchError) throw fetchError;

//       if (existingRequests.length > 0) {
//         Swal.fire({
//           icon: "info",
//           title: "Request Already Sent",
//           text: `You have already requested the book "${book.name}".`,
//           confirmButtonColor: "#3085d6",
//         });
//         return;
//       }

//       const { error: insertError } = await supabase.from("book_requests").insert([
//         {
//           user_id: user.id,
//           user_email: user.email,
//           user_name: user.user_metadata?.full_name || user.email,
//           book_id: book.id,
//           book_name: book.name,
//           status: "pending",
//         },
//       ]);

//       if (insertError) throw insertError;

//       Swal.fire({
//         icon: "success",
//         title: "Request Sent",
//         text: `Your request for "${book.name}" has been sent to admin.`,
//         confirmButtonColor: "#3085d6",
//       });
//     } catch (error) {
//       console.error("Error adding request:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Request Failed",
//         text: "Could not add your book request. Try again later.",
//         confirmButtonColor: "#d33",
//       });
//     }
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 1000,
//     slidesToShow: isMobile ? 1 : 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     cssEase: "linear",
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div style={{ padding: 30, fontFamily: "Arial, sans-serif" }}>
//       {/* Search Bar */}
//       <div
//         style={{
//           textAlign: "center",
//           marginBottom: 20,
//           display: "flex",
//           justifyContent: "center",
//           flexWrap: "wrap",
//           gap: 10,
//         }}
//       >
//         <input
//           type="text"
//           placeholder="Search book by name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//           style={{
//             padding: 10,
//             width: 300,
//             maxWidth: "90%",
//             borderRadius: 6,
//             border: "1px solid #ccc",
//             fontSize: 16,
//           }}
//         />
//         <button
//           onClick={handleSearch}
//           disabled={!searchTerm.trim()}
//           style={{
//             padding: "10px 20px",
//             borderRadius: 6,
//             backgroundColor: searchTerm.trim() ? "#007bff" : "#a0c4ff",
//             color: "white",
//             border: "none",
//             fontSize: 16,
//             cursor: searchTerm.trim() ? "pointer" : "not-allowed",
//           }}
//         >
//           Search
//         </button>
//         {searchResult && (
//           <button
//             onClick={() => {
//               setSearchResult(null);
//               setSearchTerm("");
//             }}
//             style={{
//               padding: "10px 20px",
//               borderRadius: 6,
//               backgroundColor: "#6c757d",
//               color: "white",
//               border: "none",
//               fontSize: 16,
//               cursor: "pointer",
//             }}
//           >
//             Clear Search
//           </button>
//         )}
//       </div>

//       {/* Slider */}
//       <div style={{ marginBottom: 30 }}>
//         <Slider {...sliderSettings}>
//           {books.map((book) => (
//             <div key={book.id} style={{ padding: "0 10px" }}>
//               <img
//                 src={book.url}
//                 alt={book.name}
//                 style={{
//                   width: "100%",
//                   height: isMobile ? 180 : 250,
//                   objectFit: "cover",
//                   borderRadius: 10,
//                 }}
//               />
//               <h4
//                 style={{
//                   textAlign: "center",
//                   marginTop: 10,
//                   fontSize: 16,
//                   color: "#333",
//                 }}
//               >
//                 {book.name}
//               </h4>
//             </div>
//           ))}
//         </Slider>
//       </div>

//       {/* Book Cards Grid */}
//       {!searchResult && (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//             gap: 20,
//           }}
//         >
//           {books.map((book) => (
//             <div
//               key={book.id}
//               style={{
//                 backgroundColor: "#fff",
//                 borderRadius: 12,
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                 overflow: "hidden",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between",
//               }}
//             >
//               <img
//                 src={book.url}
//                 alt={book.name}
//                 style={{ width: "100%", height: 180, objectFit: "cover" }}
//               />
//               <div style={{ padding: 15, flexGrow: 1 }}>
//                 <h3 style={{ margin: "0 0 10px", fontSize: 18 }}>{book.name}</h3>
//                 <p style={{ fontSize: 14, color: "#666" }}>{book.description}</p>
//               </div>
//               <div style={{ padding: "0 15px 15px" }}>
//                 <button
//                   onClick={() => handleAddRequest(book)}
//                   style={{
//                     width: "100%",
//                     padding: 10,
//                     backgroundColor: "#007bff",
//                     color: "white",
//                     border: "none",
//                     borderRadius: 6,
//                     cursor: "pointer",
//                     fontSize: 16,
//                   }}
//                 >
//                   Add Request
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Search Result */}
//       {searchResult && (
//         <div
//           style={{
//             marginTop: 40,
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <div
//             style={{
//               maxWidth: 350,
//               width: "100%",
//               backgroundColor: "#fff",
//               borderRadius: 12,
//               boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//               overflow: "hidden",
//             }}
//           >
//             <img
//               src={searchResult.url}
//               alt={searchResult.name}
//               style={{ width: "100%", height: 200, objectFit: "cover" }}
//             />
//             <div style={{ padding: 15 }}>
//               <h3 style={{ fontSize: 20, marginBottom: 10 }}>{searchResult.name}</h3>
//               <p style={{ fontSize: 14, color: "#555" }}>{searchResult.description}</p>
//               <button
//                 onClick={() => handleAddRequest(searchResult)}
//                 style={{
//                   width: "100%",
//                   padding: 10,
//                   backgroundColor: "#007bff",
//                   color: "white",
//                   border: "none",
//                   borderRadius: 6,
//                   cursor: "pointer",
//                   fontSize: 16,
//                   marginTop: 15,
//                 }}
//               >
//                 Add Request
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;




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

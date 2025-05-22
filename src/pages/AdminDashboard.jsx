// // // // import { useEffect, useState } from "react";
// // // // import { useNavigate } from "react-router-dom";
// // // // import { supabase } from "../Config/Supabase";
// // // // import Swal from "sweetalert2";

// // // // const AdminDashboard = () => {
// // // //   const [requests, setRequests] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const navigate = useNavigate();

// // // //   useEffect(() => {
// // // //     fetchAdminData();
// // // //   }, [navigate]);

// // // //   const fetchAdminData = async () => {
// // // //     const {
// // // //       data: { user },
// // // //       error: authError,
// // // //     } = await supabase.auth.getUser();

// // // //     if (authError || !user) {
// // // //       Swal.fire("Unauthorized", "Please log in", "warning");
// // // //       navigate("/login");
// // // //       return;
// // // //     }

// // // //     const { data: roleData, error: roleError } = await supabase
// // // //       .from("roles")
// // // //       .select("role")
// // // //       .eq("user_id", user.id)
// // // //       .single();

// // // //     if (roleError || roleData?.role !== "admin") {
// // // //       Swal.fire("Access Denied", "You are not authorized", "error");
// // // //       navigate("/");
// // // //       return;
// // // //     }

// // // //     const { data: requests, error: reqError } = await supabase
// // // //       .from("book_requests")
// // // //       .select("*")
// // // //       .order("id", { ascending: false });

// // // //     if (reqError) {
// // // //       console.error("Error fetching book requests:", reqError.message);
// // // //       Swal.fire("Error", "Failed to load book requests", "error");
// // // //       setLoading(false);
// // // //       return;
// // // //     }

// // // //     const { data: users, error: usersError } = await supabase
// // // //       .from("users")
// // // //       .select("id, name, email");

// // // //     if (usersError) {
// // // //       console.error("Error fetching users:", usersError.message);
// // // //       Swal.fire("Error", "Failed to load users", "error");
// // // //       setLoading(false);
// // // //       return;
// // // //     }

// // // //     const enriched = requests.map((req) => {
// // // //       const userInfo = users.find((u) => u.id === req.user_id);
// // // //       return {
// // // //         id: req.id,
// // // //         book_name: req.book_name,
// // // //         name: userInfo?.name || "Unknown",
// // // //         email: userInfo?.email || "Unknown",
// // // //         status: req.status || "pending",
// // // //       };
// // // //     });

// // // //     setRequests(enriched);
// // // //     setLoading(false);
// // // //   };

// // // //   const handleAccept = async (id) => {
// // // //     const { error } = await supabase
// // // //       .from("book_requests")
// // // //       .update({ status: "accepted" })
// // // //       .eq("id", id);

// // // //     if (error) {
// // // //       Swal.fire("Error", "Failed to accept request", "error");
// // // //     } else {
// // // //       Swal.fire("Success", "Book request accepted", "success");
// // // //       fetchAdminData(); // Refresh the list
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div style={styles.container}>
// // // //       <h2 style={styles.title}>Admin Dashboard</h2>

// // // //       {loading ? (
// // // //         <p>Loading...</p>
// // // //       ) : requests.length === 0 ? (
// // // //         <p>No book requests yet.</p>
// // // //       ) : (
// // // //         <div style={styles.tableWrapper}>
// // // //           <table style={styles.table}>
// // // //             <thead>
// // // //               <tr>
// // // //                 <th style={styles.th}>#</th>
// // // //                 <th style={styles.th}>User Name</th>
// // // //                 <th style={styles.th}>Email</th>
// // // //                 <th style={styles.th}>Requested Book</th>
// // // //                 <th style={styles.th}>Status</th>
// // // //                 <th style={styles.th}>Action</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody>
// // // //               {requests.map((req, index) => (
// // // //                 <tr key={req.id}>
// // // //                   <td style={styles.td}>{index + 1}</td>
// // // //                   <td style={styles.td}>{req.name}</td>
// // // //                   <td style={styles.td}>{req.email}</td>
// // // //                   <td style={styles.td}>{req.book_name}</td>
// // // //                   <td style={styles.td}>
// // // //                     {req.status === "accepted" ? "✅ Accepted" : "⏳ Pending"}
// // // //                   </td>
// // // //                   <td style={styles.td}>
// // // //                     {req.status !== "accepted" && (
// // // //                       <button style={styles.btn} onClick={() => handleAccept(req.id)}>
// // // //                         Accept Request
// // // //                       </button>
// // // //                     )}
// // // //                   </td>
// // // //                 </tr>
// // // //               ))}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // const styles = {
// // // //   container: {
// // // //     padding: "20px",
// // // //     maxWidth: "95%",
// // // //     margin: "auto",
// // // //     fontFamily: "Arial, sans-serif",
// // // //   },
// // // //   title: {
// // // //     textAlign: "center",
// // // //     marginBottom: "30px",
// // // //     fontSize: "24px",
// // // //   },
// // // //   tableWrapper: {
// // // //     overflowX: "auto",
// // // //   },
// // // //   table: {
// // // //     width: "100%",
// // // //     borderCollapse: "collapse",
// // // //     minWidth: "600px", // Ensures horizontal scroll on smaller devices
// // // //   },
// // // //   th: {
// // // //     border: "1px solid #ddd",
// // // //     padding: "12px",
// // // //     backgroundColor: "#f2f2f2",
// // // //     fontSize: "14px",
// // // //     whiteSpace: "nowrap",
// // // //   },
// // // //   td: {
// // // //     border: "1px solid #ddd",
// // // //     padding: "10px",
// // // //     textAlign: "center",
// // // //     fontSize: "13px",
// // // //     wordWrap: "break-word",
// // // //   },
// // // //   btn: {
// // // //     padding: "6px 12px",
// // // //     backgroundColor: "#4CAF50",
// // // //     color: "white",
// // // //     border: "none",
// // // //     borderRadius: "4px",
// // // //     cursor: "pointer",
// // // //     fontSize: "13px",
// // // //   },
// // // // };

// // // // export default AdminDashboard;



// // // import { useEffect, useState } from "react";
// // // import { supabase } from "../Config/Supabase";
// // // import Swal from "sweetalert2";
// // // import "./AdminDashboard.css"; 

// // // const AdminDashboard = () => {
// // //   const [books, setBooks] = useState([]);
// // //   const [form, setForm] = useState({ name: "", url: "", description: "" });
// // //   const [editId, setEditId] = useState(null);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     fetchBooks();
// // //   }, []);

// // //   const fetchBooks = async () => {
// // //     const { data, error } = await supabase.from("books").select("*");
// // //     if (error) {
// // //       console.error("Error fetching books:", error);
// // //     } else {
// // //       setBooks(data);
// // //     }
// // //     setLoading(false);
// // //   };

// // //   const handleChange = (e) => {
// // //     setForm({ ...form, [e.target.name]: e.target.value });
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     if (editId) {
// // //       // Update book
// // //       const { error } = await supabase
// // //         .from("books")
// // //         .update(form)
// // //         .eq("id", editId);
// // //       if (error) {
// // //         Swal.fire("Error", "Failed to update book", "error");
// // //       } else {
// // //         Swal.fire("Success", "Book updated successfully", "success");
// // //         setEditId(null);
// // //         setForm({ name: "", url: "", description: "" });
// // //         fetchBooks();
// // //       }
// // //     } else {
// // //       // Add new book
// // //       const { error } = await supabase.from("books").insert([form]);
// // //       if (error) {
// // //         Swal.fire("Error", "Failed to add book", "error");
// // //       } else {
// // //         Swal.fire("Success", "Book added successfully", "success");
// // //         setForm({ name: "", url: "", description: "" });
// // //         fetchBooks();
// // //       }
// // //     }
// // //   };

// // //   const handleEdit = (book) => {
// // //     setEditId(book.id);
// // //     setForm({ name: book.name, url: book.url, description: book.description });
// // //   };

// // //   const handleDelete = async (id) => {
// // //     const { error } = await supabase.from("books").delete().eq("id", id);
// // //     if (error) {
// // //       Swal.fire("Error", "Failed to delete book", "error");
// // //     } else {
// // //       Swal.fire("Success", "Book deleted successfully", "success");
// // //       fetchBooks();
// // //     }
// // //   };

// // //   if (loading) {
// // //     return <div>Loading...</div>;
// // //   }

// // //   return (
// // //     <div>
// // //       <h2>Admin Dashboard</h2>

// // //       {/* Book Form */}
// // //       <form onSubmit={handleSubmit}>
// // //         <input
// // //           type="text"
// // //           name="name"
// // //           placeholder="Book Name"
// // //           value={form.name}
// // //           onChange={handleChange}
// // //           required
// // //         />
// // //         <input
// // //           type="text"
// // //           name="url"
// // //           placeholder="Image URL"
// // //           value={form.url}
// // //           onChange={handleChange}
// // //           required
// // //         />
// // //         <textarea
// // //           name="description"
// // //           placeholder="Description"
// // //           value={form.description}
// // //           onChange={handleChange}
// // //           required
// // //         />
// // //         <button type="submit">{editId ? "Update" : "Add"} Book</button>
// // //       </form>

// // //       {/* Book List */}
// // //       <table>
// // //         <thead>
// // //           <tr>
// // //             <th>Name</th>
// // //             <th>Image URL</th>
// // //             <th>Description</th>
// // //             <th>Actions</th>
// // //           </tr>
// // //         </thead>
// // //         <tbody>
// // //           {books.map((book) => (
// // //             <tr key={book.id}>
// // //               <td>{book.name}</td>
// // //               <td>{book.url}</td>
// // //               <td>{book.description}</td>
// // //               <td>
// // //                 <button onClick={() => handleEdit(book)}>Edit</button>
// // //                 <button onClick={() => handleDelete(book.id)}>Delete</button>
// // //               </td>
// // //             </tr>
// // //           ))}
// // //         </tbody>
// // //       </table>
// // //     </div>
// // //   );
// // // };

// // // export default AdminDashboard;






// // import { useEffect, useState } from "react";
// // import { supabase } from "../Config/Supabase";
// // import Swal from "sweetalert2";

// // const AdminDashboard = () => {
// //   const [books, setBooks] = useState([]);
// //   const [form, setForm] = useState({ name: "", url: "", description: "" });
// //   const [editId, setEditId] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchBooks();
// //   }, []);

// //   const fetchBooks = async () => {
// //     const { data, error } = await supabase.from("books").select("*");
// //     if (error) {
// //       console.error("Error fetching books:", error);
// //     } else {
// //       setBooks(data);
// //     }
// //     setLoading(false);
// //   };

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (editId) {
// //       const { error } = await supabase.from("books").update(form).eq("id", editId);
// //       if (error) {
// //         Swal.fire("Error", "Failed to update book", "error");
// //       } else {
// //         Swal.fire("Success", "Book updated successfully", "success");
// //         setEditId(null);
// //         setForm({ name: "", url: "", description: "" });
// //         fetchBooks();
// //       }
// //     } else {
// //       const { error } = await supabase.from("books").insert([form]);
// //       if (error) {
// //         Swal.fire("Error", "Failed to add book", "error");
// //       } else {
// //         Swal.fire("Success", "Book added successfully", "success");
// //         setForm({ name: "", url: "", description: "" });
// //         fetchBooks();
// //       }
// //     }
// //   };

// //   const handleEdit = (book) => {
// //     setEditId(book.id);
// //     setForm({ name: book.name, url: book.url, description: book.description });
// //   };

// //   const handleDelete = async (id) => {
// //     const { error } = await supabase.from("books").delete().eq("id", id);
// //     if (error) {
// //       Swal.fire("Error", "Failed to delete book", "error");
// //     } else {
// //       Swal.fire("Success", "Book deleted successfully", "success");
// //       fetchBooks();
// //     }
// //   };

// //   if (loading) return <div style={{ textAlign: "center", fontSize: 24, padding: 50 }}>Loading...</div>;

// //   return (
// //     <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "30px", fontFamily: "Segoe UI, sans-serif" }}>
// //       <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "20px", color: "#333" }}>Admin Dashboard</h2>

// //       <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
// //         <input
// //           type="text"
// //           name="name"
// //           placeholder="Book Name"
// //           value={form.name}
// //           onChange={handleChange}
// //           required
// //           style={{ padding: "10px", border: "1px solid #aaa", borderRadius: "6px", fontSize: "16px" }}
// //         />
// //         <input
// //           type="text"
// //           name="url"
// //           placeholder="Image URL"
// //           value={form.url}
// //           onChange={handleChange}
// //           required
// //           style={{ padding: "10px", border: "1px solid #aaa", borderRadius: "6px", fontSize: "16px" }}
// //         />
// //         <textarea
// //           name="description"
// //           placeholder="Description"
// //           value={form.description}
// //           onChange={handleChange}
// //           required
// //           style={{ padding: "10px", border: "1px solid #aaa", borderRadius: "6px", fontSize: "16px" }}
// //         />
// //         <button
// //           type="submit"
// //           style={{
// //             padding: "10px 16px",
// //             backgroundColor: "#007bff",
// //             color: "white",
// //             border: "none",
// //             borderRadius: "6px",
// //             cursor: "pointer",
// //             fontSize: "16px",
// //           }}
// //         >
// //           {editId ? "Update" : "Add"} Book
// //         </button>
// //       </form>

// //       <table style={{ width: "100%", borderCollapse: "collapse" }}>
// //         <thead>
// //           <tr>
// //             <th style={{ padding: "12px", border: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>Name</th>
// //             <th style={{ padding: "12px", border: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>Image</th>
// //             <th style={{ padding: "12px", border: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>Description</th>
// //             <th style={{ padding: "12px", border: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {books.map((book) => (
// //             <tr key={book.id}>
// //               <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{book.name}</td>
// //               <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
// //                 <img src={book.url} alt={book.name} width={80} height={80} style={{ borderRadius: "6px", objectFit: "cover" }} />
// //               </td>
// //               <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{book.description}</td>
// //               <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
// //                 <button
// //                   onClick={() => handleEdit(book)}
// //                   style={{
// //                     backgroundColor: "#28a745",
// //                     color: "white",
// //                     padding: "6px 10px",
// //                     border: "none",
// //                     borderRadius: "4px",
// //                     marginRight: "5px",
// //                     cursor: "pointer",
// //                   }}
// //                 >
// //                   Edit
// //                 </button>
// //                 <button
// //                   onClick={() => handleDelete(book.id)}
// //                   style={{
// //                     backgroundColor: "#dc3545",
// //                     color: "white",
// //                     padding: "6px 10px",
// //                     border: "none",
// //                     borderRadius: "4px",
// //                     cursor: "pointer",
// //                   }}
// //                 >
// //                   Delete
// //                 </button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;





// // import { useEffect, useState } from "react";
// // import { supabase } from "../Config/Supabase";
// // import Swal from "sweetalert2";

// // const AdminDashboard = () => {
// //   const [books, setBooks] = useState([]);
// //   const [form, setForm] = useState({ name: "", url: "", description: "" });
// //   const [editId, setEditId] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchBooks();
// //   }, []);

// //   const fetchBooks = async () => {
// //     const { data, error } = await supabase.from("books").select("*");
// //     if (error) {
// //       console.error("Error fetching books:", error);
// //       Swal.fire("Error", error.message, "error");
// //     } else {
// //       setBooks(data);
// //     }
// //     setLoading(false);
// //   };

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const {
// //       data: { user },
// //       error: userError,
// //     } = await supabase.auth.getUser();

// //     if (userError || !user) {
// //       Swal.fire("Error", "You must be logged in to perform this action", "error");
// //       return;
// //     }

// //     const bookData = {
// //       name: form.name,
// //       url: form.url,          // <-- use url, matching your DB column
// //       description: form.description,
// //       user_id: user.id,       // remove if not needed
// //     };

// //     if (editId) {
// //       const { error } = await supabase
// //         .from("books")
// //         .update(bookData)
// //         .eq("id", editId);

// //       if (error) {
// //         console.error("Update Error:", error);
// //         Swal.fire("Error", error.message, "error");
// //       } else {
// //         Swal.fire("Success", "Book updated successfully", "success");
// //         setEditId(null);
// //         setForm({ name: "", url: "", description: "" });
// //         fetchBooks();
// //       }
// //     } else {
// //       const { error } = await supabase.from("books").insert([bookData]);

// //       if (error) {
// //         console.error("Insert Error:", error);
// //         Swal.fire("Error", error.message, "error");
// //       } else {
// //         Swal.fire("Success", "Book added successfully", "success");
// //         setForm({ name: "", url: "", description: "" });
// //         fetchBooks();
// //       }
// //     }
// //   };

// //   const handleEdit = (book) => {
// //     setEditId(book.id);
// //     setForm({ name: book.name, url: book.url, description: book.description });
// //   };

// //   const handleDelete = async (id) => {
// //     const { error } = await supabase.from("books").delete().eq("id", id);
// //     if (error) {
// //       console.error("Delete Error:", error);
// //       Swal.fire("Error", error.message, "error");
// //     } else {
// //       Swal.fire("Success", "Book deleted successfully", "success");
// //       fetchBooks();
// //     }
// //   };

// //   if (loading) {
// //     return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
// //   }

// //   return (
// //     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
// //       <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Dashboard</h2>

// //       {/* Book Form */}
// //       <form
// //         onSubmit={handleSubmit}
// //         style={{
// //           display: "flex",
// //           flexDirection: "column",
// //           gap: "10px",
// //           maxWidth: "500px",
// //           margin: "auto",
// //           marginBottom: "40px",
// //         }}
// //       >
// //         <input
// //           type="text"
// //           name="name"
// //           placeholder="Book Name"
// //           value={form.name}
// //           onChange={handleChange}
// //           required
// //           style={{ padding: "10px", fontSize: "16px" }}
// //         />
// //         <input
// //           type="text"
// //           name="url"
// //           placeholder="Image URL"
// //           value={form.url}
// //           onChange={handleChange}
// //           required
// //           style={{ padding: "10px", fontSize: "16px" }}
// //         />
// //         <textarea
// //           name="description"
// //           placeholder="Description"
// //           value={form.description}
// //           onChange={handleChange}
// //           required
// //           rows={4}
// //           style={{ padding: "10px", fontSize: "16px" }}
// //         />
// //         <button
// //           type="submit"
// //           style={{
// //             padding: "10px",
// //             fontSize: "16px",
// //             backgroundColor: "#4CAF50",
// //             color: "white",
// //             border: "none",
// //             cursor: "pointer",
// //           }}
// //         >
// //           {editId ? "Update" : "Add"} Book
// //         </button>
// //       </form>

// //       {/* Book List Table */}
// //       <div style={{ overflowX: "auto" }}>
// //         <table
// //           style={{
// //             width: "100%",
// //             borderCollapse: "collapse",
// //             marginBottom: "40px",
// //           }}
// //         >
// //           <thead>
// //             <tr style={{ backgroundColor: "#f2f2f2" }}>
// //               <th style={{ border: "1px solid #ddd", padding: "12px" }}>Name</th>
// //               <th style={{ border: "1px solid #ddd", padding: "12px" }}>Image</th>
// //               <th style={{ border: "1px solid #ddd", padding: "12px" }}>Description</th>
// //               <th style={{ border: "1px solid #ddd", padding: "12px" }}>Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {books.map((book) => (
// //               <tr key={book.id}>
// //                 <td style={{ border: "1px solid #ddd", padding: "12px" }}>{book.name}</td>
// //                 <td style={{ border: "1px solid #ddd", padding: "12px" }}>
// //                   <img
// //                     src={book.url}
// //                     alt={book.name}
// //                     style={{ width: "80px", height: "auto" }}
// //                   />
// //                 </td>
// //                 <td style={{ border: "1px solid #ddd", padding: "12px" }}>{book.description}</td>
// //                 <td style={{ border: "1px solid #ddd", padding: "12px" }}>
// //                   <button
// //                     onClick={() => handleEdit(book)}
// //                     style={{
// //                       padding: "6px 12px",
// //                       marginRight: "6px",
// //                       backgroundColor: "#2196F3",
// //                       color: "#fff",
// //                       border: "none",
// //                       cursor: "pointer",
// //                     }}
// //                   >
// //                     Edit
// //                   </button>
// //                   <button
// //                     onClick={() => handleDelete(book.id)}
// //                     style={{
// //                       padding: "6px 12px",
// //                       backgroundColor: "#f44336",
// //                       color: "#fff",
// //                       border: "none",
// //                       cursor: "pointer",
// //                     }}
// //                   >
// //                     Delete
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;




// // import { useEffect, useState } from "react";
// // import { supabase } from "../Config/Supabase";
// // import Swal from "sweetalert2";

// // const AdminDashboard = () => {
// //   const [books, setBooks] = useState([]);
// //   const [form, setForm] = useState({ name: "", url: "", description: "" });
// //   const [editId, setEditId] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchBooks();
// //   }, []);

// //   const fetchBooks = async () => {
// //     const { data, error } = await supabase.from("books").select("*");
// //     if (error) {
// //       console.error("Error fetching books:", error);
// //       Swal.fire("Error", error.message, "error");
// //     } else {
// //       setBooks(data);
// //     }
// //     setLoading(false);
// //   };

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const {
// //       data: { user },
// //       error: userError,
// //     } = await supabase.auth.getUser();

// //     if (userError || !user) {
// //       Swal.fire("Error", "You must be logged in to perform this action", "error");
// //       return;
// //     }

// //     const bookData = {
// //       name: form.name,
// //       url: form.url,
// //       description: form.description,
// //       user_id: user.id,
// //     };

// //     if (editId) {
// //       const { error } = await supabase
// //         .from("books")
// //         .update(bookData)
// //         .eq("id", editId);

// //       if (error) {
// //         Swal.fire("Error", error.message, "error");
// //       } else {
// //         Swal.fire("Success", "Book updated successfully", "success");
// //         setEditId(null);
// //         setForm({ name: "", url: "", description: "" });
// //         fetchBooks();
// //       }
// //     } else {
// //       const { error } = await supabase.from("books").insert([bookData]);

// //       if (error) {
// //         Swal.fire("Error", error.message, "error");
// //       } else {
// //         Swal.fire("Success", "Book added successfully", "success");
// //         setForm({ name: "", url: "", description: "" });
// //         fetchBooks();
// //       }
// //     }
// //   };

// //   const handleEdit = (book) => {
// //     setEditId(book.id);
// //     setForm({ name: book.name, url: book.url, description: book.description });
// //   };

// //   const handleDelete = async (id) => {
// //     const { error } = await supabase.from("books").delete().eq("id", id);
// //     if (error) {
// //       Swal.fire("Error", error.message, "error");
// //     } else {
// //       Swal.fire("Success", "Book deleted successfully", "success");
// //       fetchBooks();
// //     }
// //   };

// //   if (loading) {
// //     return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
// //   }

// //   return (
// //     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
// //       <h2 style={{ textAlign: "center", marginBottom: "30px" }}>📚 Admin Dashboard</h2>

// //       {/* Book Form */}
// //       <form
// //         onSubmit={handleSubmit}
// //         style={{
// //           background: "#f9f9f9",
// //           padding: "20px",
// //           borderRadius: "8px",
// //           boxShadow: "0 0 10px rgba(0,0,0,0.1)",
// //           maxWidth: "500px",
// //           margin: "0 auto 40px auto",
// //           display: "flex",
// //           flexDirection: "column",
// //           gap: "15px",
// //         }}
// //       >
// //         <input
// //           type="text"
// //           name="name"
// //           placeholder="Book Name"
// //           value={form.name}
// //           onChange={handleChange}
// //           required
// //           style={{ padding: "10px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ccc" }}
// //         />
// //         <input
// //           type="text"
// //           name="url"
// //           placeholder="Image URL"
// //           value={form.url}
// //           onChange={handleChange}
// //           required
// //           style={{ padding: "10px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ccc" }}
// //         />
// //         <textarea
// //           name="description"
// //           placeholder="Description"
// //           value={form.description}
// //           onChange={handleChange}
// //           required
// //           rows={4}
// //           style={{ padding: "10px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ccc" }}
// //         />
// //         <button
// //           type="submit"
// //           style={{
// //             padding: "12px",
// //             fontSize: "16px",
// //             backgroundColor: "#4CAF50",
// //             color: "white",
// //             border: "none",
// //             borderRadius: "4px",
// //             cursor: "pointer",
// //           }}
// //         >
// //           {editId ? "Update" : "Add"} Book
// //         </button>
// //       </form>

// //       {/* Book List Cards */}
// //       <div
// //         style={{
// //           display: "grid",
// //           gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
// //           gap: "20px",
// //         }}
// //       >
// //         {books.map((book) => (
// //           <div
// //             key={book.id}
// //             style={{
// //               background: "#fff",
// //               borderRadius: "8px",
// //               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// //               padding: "16px",
// //               display: "flex",
// //               flexDirection: "column",
// //               justifyContent: "space-between",
// //             }}
// //           >
// //             <img
// //               src={book.url}
// //               alt={book.name}
// //               style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "6px" }}
// //             />
// //             <h3 style={{ marginTop: "10px" }}>{book.name}</h3>
// //             <p style={{ fontSize: "14px", color: "#555" }}>{book.description}</p>
// //             <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
// //               <button
// //                 onClick={() => handleEdit(book)}
// //                 style={{
// //                   padding: "8px 12px",
// //                   backgroundColor: "#2196F3",
// //                   color: "#fff",
// //                   border: "none",
// //                   borderRadius: "4px",
// //                   cursor: "pointer",
// //                 }}
// //               >
// //                 Edit
// //               </button>
// //               <button
// //                 onClick={() => handleDelete(book.id)}
// //                 style={{
// //                   padding: "8px 12px",
// //                   backgroundColor: "#f44336",
// //                   color: "#fff",
// //                   border: "none",
// //                   borderRadius: "4px",
// //                   cursor: "pointer",
// //                 }}
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../Config/Supabase";
// import Swal from "sweetalert2";

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [requests, setRequests] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [form, setForm] = useState({ name: "", url: "", description: "" });
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkAdminAndFetchData();
//   }, [navigate]);

//   const checkAdminAndFetchData = async () => {
//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       Swal.fire("Unauthorized", "Please log in", "warning");
//       navigate("/login");
//       return;
//     }

//     const { data: roleData, error: roleError } = await supabase
//       .from("roles")
//       .select("role")
//       .eq("user_id", user.id)
//       .single();

//     if (roleError || roleData?.role !== "admin") {
//       Swal.fire("Access Denied", "You are not authorized", "error");
//       navigate("/");
//       return;
//     }

//     await fetchBookRequests();
//     await fetchBooks();
//     setLoading(false);
//   };

//   const fetchBookRequests = async () => {
//     const { data: requests, error: reqError } = await supabase
//       .from("book_requests")
//       .select("*")
//       .order("id", { ascending: false });

//     const { data: users, error: usersError } = await supabase
//       .from("users")
//       .select("id, name, email");

//     if (reqError || usersError) {
//       Swal.fire("Error", "Failed to load data", "error");
//       return;
//     }

//     const enriched = requests.map((req) => {
//       const user = users.find((u) => u.id === req.user_id);
//       return {
//         id: req.id,
//         book_name: req.book_name,
//         name: user?.name || "Unknown",
//         email: user?.email || "Unknown",
//         status: req.status || "pending",
//       };
//     });

//     setRequests(enriched);
//   };

//   const handleAccept = async (id) => {
//     const { error } = await supabase
//       .from("book_requests")
//       .update({ status: "accepted" })
//       .eq("id", id);

//     if (error) {
//       Swal.fire("Error", "Failed to accept request", "error");
//     } else {
//       Swal.fire("Success", "Book request accepted", "success");
//       fetchBookRequests();
//     }
//   };

//   const fetchBooks = async () => {
//     const { data, error } = await supabase.from("books").select("*");
//     if (error) {
//       Swal.fire("Error", error.message, "error");
//     } else {
//       setBooks(data);
//     }
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     if (userError || !user) {
//       Swal.fire("Error", "You must be logged in", "error");
//       return;
//     }

//     const bookData = {
//       name: form.name,
//       url: form.url,
//       description: form.description,
//       user_id: user.id,
//     };

//     if (editId) {
//       const { error } = await supabase
//         .from("books")
//         .update(bookData)
//         .eq("id", editId);

//       if (error) {
//         Swal.fire("Error", error.message, "error");
//       } else {
//         Swal.fire("Success", "Book updated", "success");
//         setEditId(null);
//         setForm({ name: "", url: "", description: "" });
//         fetchBooks();
//       }
//     } else {
//       const { error } = await supabase.from("books").insert([bookData]);
//       if (error) {
//         Swal.fire("Error", error.message, "error");
//       } else {
//         Swal.fire("Success", "Book added", "success");
//         setForm({ name: "", url: "", description: "" });
//         fetchBooks();
//       }
//     }
//   };

//   const handleEdit = (book) => {
//     setEditId(book.id);
//     setForm({ name: book.name, url: book.url, description: book.description });
//   };

//   const handleDelete = async (id) => {
//     const { error } = await supabase.from("books").delete().eq("id", id);
//     if (error) {
//       Swal.fire("Error", error.message, "error");
//     } else {
//       Swal.fire("Success", "Book deleted", "success");
//       fetchBooks();
//     }
//   };

//   if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <h2 style={{ textAlign: "center", marginBottom: "30px" }}>📚 Admin Dashboard</h2>

//       {/* Book Request Table */}
//       <div style={{ overflowX: "auto", marginBottom: "40px" }}>
//         <h3>📥 Book Requests</h3>
//         {requests.length === 0 ? (
//           <p>No book requests.</p>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>#</th>
//                 <th style={styles.th}>User Name</th>
//                 <th style={styles.th}>Email</th>
//                 <th style={styles.th}>Requested Book</th>
//                 <th style={styles.th}>Status</th>
//                 <th style={styles.th}>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((req, i) => (
//                 <tr key={req.id}>
//                   <td style={styles.td}>{i + 1}</td>
//                   <td style={styles.td}>{req.name}</td>
//                   <td style={styles.td}>{req.email}</td>
//                   <td style={styles.td}>{req.book_name}</td>
//                   <td style={styles.td}>
//                     {req.status === "accepted" ? "✅ Accepted" : "⏳ Pending"}
//                   </td>
//                   <td style={styles.td}>
//                     {req.status !== "accepted" && (
//                       <button style={styles.btn} onClick={() => handleAccept(req.id)}>
//                         Accept
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Book Add/Edit Form */}
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <h3>{editId ? "✏️ Edit Book" : "➕ Add Book"}</h3>
//         <input
//           type="text"
//           name="name"
//           placeholder="Book Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//           style={styles.input}
//         />
//         <input
//           type="text"
//           name="url"
//           placeholder="Image URL"
//           value={form.url}
//           onChange={handleChange}
//           required
//           style={styles.input}
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           required
//           style={styles.textarea}
//         />
//         <button type="submit" style={styles.btn}>
//           {editId ? "Update Book" : "Add Book"}
//         </button>
//       </form>

//       {/* Book List */}
//       <div>
//         <h3>📗 Book List</h3>
//         {books.length === 0 ? (
//           <p>No books available.</p>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>#</th>
//                 <th style={styles.th}>Image</th>
//                 <th style={styles.th}>Name</th>
//                 <th style={styles.th}>Description</th>
//                 <th style={styles.th}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {books.map((book, i) => (
//                 <tr key={book.id}>
//                   <td style={styles.td}>{i + 1}</td>
//                   <td style={styles.td}>
//                     <img src={book.url} alt={book.name} width="60" />
//                   </td>
//                   <td style={styles.td}>{book.name}</td>
//                   <td style={styles.td}>{book.description}</td>
//                   <td style={styles.td}>
//                     <button style={{ ...styles.btn, marginRight: "8px" }} onClick={() => handleEdit(book)}>
//                       Edit
//                     </button>
//                     <button style={{ ...styles.btn, backgroundColor: "#f44336" }} onClick={() => handleDelete(book.id)}>
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     marginTop: "10px",
//   },
//   th: {
//     border: "1px solid #ddd",
//     padding: "10px",
//     backgroundColor: "#f2f2f2",
//     fontSize: "14px",
//     whiteSpace: "nowrap",
//   },
//   td: {
//     border: "1px solid #ddd",
//     padding: "10px",
//     textAlign: "center",
//     fontSize: "13px",
//   },
//   btn: {
//     padding: "6px 12px",
//     backgroundColor: "#4CAF50",
//     color: "#fff",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontSize: "13px",
//   },
//   form: {
//     background: "#f9f9f9",
//     padding: "20px",
//     borderRadius: "8px",
//     maxWidth: "500px",
//     margin: "0 auto 40px auto",
//     display: "flex",
//     flexDirection: "column",
//     gap: "15px",
//   },
//   input: {
//     padding: "10px",
//     fontSize: "16px",
//     borderRadius: "4px",
//     border: "1px solid #ccc",
//   },
//   textarea: {
//     padding: "10px",
//     fontSize: "16px",
//     borderRadius: "4px",
//     border: "1px solid #ccc",
//     resize: "vertical",
//     minHeight: "60px",
//   },
// };

// export default AdminDashboard;


// import React, { useEffect, useState } from "react";
// import { supabase } from "../Config/Supabase";




// const AdminDashboard = () => {
//   const [requests, setRequests] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [form, setForm] = useState({ name: "", url: "", description: "" });
//   const [editId, setEditId] = useState(null);

//   useEffect(() => {
//     fetchRequests();
//     fetchBooks();
//   }, []);

//   const fetchRequests = async () => {
//     const { data, error } = await supabase.from("book_requests").select("*");
//     if (error) console.error("Error fetching requests:", error.message);
//     else setRequests(data);
//   };

//   const fetchBooks = async () => {
//     const { data, error } = await supabase.from("books").select("*");
//     if (error) console.error("Error fetching books:", error.message);
//     else setBooks(data);
//   };

//   const handleAccept = async (id) => {
//     const { error } = await supabase
//       .from("book_requests")
//       .update({ status: "accepted" })
//       .eq("id", id);

//     if (error) console.error("Error accepting request:", error.message);
//     else fetchRequests();
//   };

//   const handleDelete = async (id) => {
//     const { error } = await supabase.from("books").delete().eq("id", id);
//     if (error) console.error("Error deleting book:", error.message);
//     else fetchBooks();
//   };

//   const handleEdit = (book) => {
//     setForm({
//       name: book.name,
//       url: book.url,
//       description: book.description,
//     });
//     setEditId(book.id);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (editId) {
//       const { error } = await supabase
//         .from("books")
//         .update(form)
//         .eq("id", editId);
//       if (error) console.error("Error updating book:", error.message);
//     } else {
//       const { error } = await supabase.from("books").insert([form]);
//       if (error) console.error("Error adding book:", error.message);
//     }

//     setForm({ name: "", url: "", description: "" });
//     setEditId(null);
//     fetchBooks();
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <h2 style={{ textAlign: "center", marginBottom: "30px" }}>📚 Admin Dashboard</h2>

//       {/* Add/Edit Book Form - at the top */}
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <h3>{editId ? "✏️ Edit Book" : "➕ Add Book"}</h3>
//         <input
//           type="text"
//           name="name"
//           placeholder="Book Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//           style={styles.input}
//         />
//         <input
//           type="text"
//           name="url"
//           placeholder="Image URL"
//           value={form.url}
//           onChange={handleChange}
//           required
//           style={styles.input}
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           required
//           style={styles.textarea}
//         />
//         <button type="submit" style={styles.btn}>
//           {editId ? "Update Book" : "Add Book"}
//         </button>
//       </form>

//       {/* Book Requests */}
//       <div style={{ overflowX: "auto", marginBottom: "40px" }}>
//         <h3>📥 Book Requests</h3>
//         {requests.length === 0 ? (
//           <p>No book requests.</p>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>#</th>
//                 <th style={styles.th}>User Name</th>
//                 <th style={styles.th}>Email</th>
//                 <th style={styles.th}>Requested Book</th>
//                 <th style={styles.th}>Status</th>
//                 <th style={styles.th}>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((req, i) => (
//                 <tr key={req.id}>
//                   <td style={styles.td}>{i + 1}</td>
//                   <td style={styles.td}>{req.name}</td>
//                   <td style={styles.td}>{req.email}</td>
//                   <td style={styles.td}>{req.book_name}</td>
//                   <td style={styles.td}>
//                     {req.status === "accepted" ? "✅ Accepted" : "⏳ Pending"}
//                   </td>
//                   <td style={styles.td}>
//                     {req.status !== "accepted" && (
//                       <button style={styles.btn} onClick={() => handleAccept(req.id)}>
//                         Accept
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Book List */}
//       <div>
//         <h3>📗 Book List</h3>
//         {books.length === 0 ? (
//           <p>No books available.</p>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>#</th>
//                 <th style={styles.th}>Image</th>
//                 <th style={styles.th}>Name</th>
//                 <th style={styles.th}>Description</th>
//                 <th style={styles.th}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {books.map((book, i) => (
//                 <tr key={book.id}>
//                   <td style={styles.td}>{i + 1}</td>
//                   <td style={styles.td}>
//                     <img src={book.url} alt={book.name} width="60" />
//                   </td>
//                   <td style={styles.td}>{book.name}</td>
//                   <td style={styles.td}>{book.description}</td>
//                   <td style={styles.td}>
//                     <button
//                       style={{ ...styles.btn, marginRight: "8px" }}
//                       onClick={() => handleEdit(book)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       style={{ ...styles.btn, backgroundColor: "#f44336" }}
//                       onClick={() => handleDelete(book.id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// const styles = {
//   form: {
//     marginBottom: "40px",
//     padding: "20px",
//     backgroundColor: "#f9f9f9",
//     borderRadius: "8px",
//   },
//   input: {
//     display: "block",
//     width: "100%",
//     padding: "10px",
//     marginBottom: "10px",
//     borderRadius: "4px",
//     border: "1px solid #ccc",
//   },
//   textarea: {
//     display: "block",
//     width: "100%",
//     padding: "10px",
//     height: "80px",
//     marginBottom: "10px",
//     borderRadius: "4px",
//     border: "1px solid #ccc",
//   },
//   btn: {
//     backgroundColor: "#4CAF50",
//     color: "white",
//     padding: "10px 16px",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     marginTop: "20px",
//   },
//   th: {
//     backgroundColor: "#f2f2f2",
//     padding: "10px",
//     border: "1px solid #ddd",
//   },
//   td: {
//     padding: "10px",
//     border: "1px solid #ddd",
//     textAlign: "center",
//   },
// };



// import React, { useEffect, useState } from "react";
// import { supabase } from "../Config/Supabase";

// const AdminDashboard = () => {
//   const [requests, setRequests] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [form, setForm] = useState({ name: "", url: "", description: "" });
//   const [editId, setEditId] = useState(null);

//   useEffect(() => {
//     fetchRequests();
//     fetchBooks();
//   }, []);

//   const fetchRequests = async () => {
//     const { data, error } = await supabase.from("book_requests").select("*");
//     if (error) console.error("Error fetching requests:", error.message);
//     else setRequests(data);
//   };

//   const fetchBooks = async () => {
//     const { data, error } = await supabase.from("books").select("*");
//     if (error) console.error("Error fetching books:", error.message);
//     else setBooks(data);
//   };

//   const handleAccept = async (id) => {
//     const { error } = await supabase
//       .from("book_requests")
//       .update({ status: "accepted" })
//       .eq("id", id);

//     if (error) console.error("Error accepting request:", error.message);
//     else fetchRequests();
//   };

//   const handleDelete = async (id) => {
//     const { error } = await supabase.from("books").delete().eq("id", id);
//     if (error) console.error("Error deleting book:", error.message);
//     else fetchBooks();
//   };

//   const handleEdit = (book) => {
//     setForm({
//       name: book.name,
//       url: book.url,
//       description: book.description,
//     });
//     setEditId(book.id);
//     window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to form on edit
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (editId) {
//       const { error } = await supabase
//         .from("books")
//         .update(form)
//         .eq("id", editId);
//       if (error) console.error("Error updating book:", error.message);
//     } else {
//       const { error } = await supabase.from("books").insert([form]);
//       if (error) console.error("Error adding book:", error.message);
//     }

//     setForm({ name: "", url: "", description: "" });
//     setEditId(null);
//     fetchBooks();
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>📚 Admin Dashboard</h2>

//       {/* Add/Edit Book Form */}
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <h3 style={{ marginBottom: "15px" }}>{editId ? "✏️ Edit Book" : "➕ Add Book"}</h3>
//         <input
//           type="text"
//           name="name"
//           placeholder="Book Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//           style={styles.input}
//         />
//         <input
//           type="text"
//           name="url"
//           placeholder="Image URL"
//           value={form.url}
//           onChange={handleChange}
//           required
//           style={styles.input}
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           required
//           style={styles.textarea}
//         />
//         <button type="submit" style={styles.btn}>
//           {editId ? "Update Book" : "Add Book"}
//         </button>
//       </form>

//       {/* Book List */}
//       <div style={styles.section}>
//         <h3 style={styles.sectionTitle}>📗 Book List</h3>
//         {books.length === 0 ? (
//           <p style={styles.emptyText}>No books available.</p>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>#</th>
//                 <th style={styles.th}>Image</th>
//                 <th style={styles.th}>Name</th>
//                 <th style={styles.th}>Description</th>
//                 <th style={styles.th}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {books.map((book, i) => (
//                 <tr key={book.id} style={i % 2 ? styles.rowOdd : styles.rowEven}>
//                   <td style={styles.td}>{i + 1}</td>
//                   <td style={styles.td}>
//                     <img src={book.url} alt={book.name} width="60" style={{ borderRadius: "4px" }} />
//                   </td>
//                   <td style={styles.td}>{book.name}</td>
//                   <td style={styles.td}>{book.description}</td>
//                   <td style={styles.td}>
//                     <button
//                       style={{ ...styles.btn, marginRight: "8px", backgroundColor: "#2196f3" }}
//                       onClick={() => handleEdit(book)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       style={{ ...styles.btn, backgroundColor: "#f44336" }}
//                       onClick={() => handleDelete(book.id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Book Requests */}
//       <div style={styles.section}>
//         <h3 style={styles.sectionTitle}>📥 Book Requests</h3>
//         {requests.length === 0 ? (
//           <p style={styles.emptyText}>No book requests.</p>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>#</th>
//                 <th style={styles.th}>User Name</th>
//                 <th style={styles.th}>Email</th>
//                 <th style={styles.th}>Requested Book</th>
//                 <th style={styles.th}>Status</th>
//                 <th style={styles.th}>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((req, i) => (
//                 <tr key={req.id} style={i % 2 ? styles.rowOdd : styles.rowEven}>
//                   <td style={styles.td}>{i + 1}</td>
//                   <td style={styles.td}>{req.name}</td>
//                   <td style={styles.td}>{req.email}</td>
//                   <td style={styles.td}>{req.book_name}</td>
//                   <td style={styles.td}>
//                     {req.status === "accepted" ? (
//                       <span style={{ color: "green", fontWeight: "bold" }}>✅ Accepted</span>
//                     ) : (
//                       <span style={{ color: "#ff9800", fontWeight: "bold" }}>⏳ Pending</span>
//                     )}
//                   </td>
//                   <td style={styles.td}>
//                     {req.status !== "accepted" && (
//                       <button style={{ ...styles.btn, backgroundColor: "#4caf50" }} onClick={() => handleAccept(req.id)}>
//                         Accept
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// const styles = {
//   container: {
//     padding: "30px 20px",
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//     maxWidth: "1000px",
//     margin: "auto",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: "40px",
//     fontWeight: "700",
//     fontSize: "2.5rem",
//     color: "#333",
//   },
//   form: {
//     marginBottom: "50px",
//     padding: "25px",
//     backgroundColor: "#fff",
//     borderRadius: "10px",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//     border: "1px solid #ddd",
//     width: "98%",

//   },
//   input: {
//     display: "block",
//     width: "100%",
//     padding: "12px 15px",
//     marginBottom: "15px",
//     borderRadius: "6px",
//     border: "1px solid #ccc",
//     fontSize: "1rem",
//     transition: "border-color 0.3s",
//     width: "95%",

//   },
//   textarea: {
//     display: "block",
//     width: "100%",
//     padding: "12px 15px",
//     height: "100px",
//     marginBottom: "15px",
//     borderRadius: "6px",
//     border: "1px solid #ccc",
//     fontSize: "1rem",
//     resize: "vertical",
//     transition: "border-color 0.3s",
//     width: "95%",
//   },
//   btn: {
//     backgroundColor: "#4caf50",
//     color: "white",
//     padding: "12px 20px",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "1rem",
//     fontWeight: "600",
//     transition: "background-color 0.3s",
//   },
//   section: {
//     marginBottom: "50px",
//   },
//   sectionTitle: {
//     marginBottom: "20px",
//     fontSize: "1.8rem",
//     color: "#444",
//     borderBottom: "2px solid #4caf50",
//     paddingBottom: "6px",
//     fontWeight: "700",
//   },
//   emptyText: {
//     fontStyle: "italic",
//     color: "#666",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//     borderRadius: "8px",
//     overflow: "hidden",
//   },
//   th: {
//     backgroundColor: "#4caf50",
//     color: "white",
//     padding: "12px 15px",
//     textAlign: "center",
//     fontWeight: "700",
//   },
//   td: {
//     padding: "12px 15px",
//     borderBottom: "1px solid #ddd",
//     textAlign: "center",
//     verticalAlign: "middle",
//   },
//   rowOdd: {
//     backgroundColor: "#f9f9f9",
//   },
//   rowEven: {
//     backgroundColor: "#fff",
//   },
// };



  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { supabase } from "../Config/Supabase";
  import Swal from "sweetalert2";

  const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({ name: "", url: "", description: "" });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      checkAuthAndLoadData();
    }, [navigate]);

    const checkAuthAndLoadData = async () => {
      setLoading(true);
      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        Swal.fire("Unauthorized", "Please log in", "warning");
        navigate("/login");
        return;
      }

      // Check user role
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roleError || roleData?.role !== "admin") {
        Swal.fire("Access Denied", "You are not authorized", "error");
        navigate("/");
        return;
      }

      // Fetch books and requests with user info
      await fetchBooks();
      await fetchRequestsWithUsers();
      setLoading(false);
    };

    // Fetch books
    const fetchBooks = async () => {
      const { data, error } = await supabase.from("books").select("*");
      if (error) {
        console.error("Error fetching books:", error.message);
        Swal.fire("Error", "Failed to load books", "error");
      } else {
        setBooks(data);
      }
    };

    // Fetch book requests and enrich with user info
    const fetchRequestsWithUsers = async () => {
      // Fetch requests
      const { data: requestsData, error: reqError } = await supabase
        .from("book_requests")
        .select("*")
        .order("id", { ascending: false });

      if (reqError) {
        console.error("Error fetching requests:", reqError.message);
        Swal.fire("Error", "Failed to load book requests", "error");
        return;
      }

      // Fetch users
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, name, email");

      if (usersError) {
        console.error("Error fetching users:", usersError.message);
        Swal.fire("Error", "Failed to load users", "error");
        return;
      }

      // Map requests with user info
      const enriched = requestsData.map((req) => {
        const userInfo = users.find((u) => u.id === req.user_id);
        return {
          ...req,
          name: userInfo?.name || "Unknown",
          email: userInfo?.email || "Unknown",
          status: req.status || "pending",
        };
      });

      setRequests(enriched);
    };

    // Accept book request
    const handleAccept = async (id) => {
      const { error } = await supabase
        .from("book_requests")
        .update({ status: "accepted" })
        .eq("id", id);

      if (error) {
        Swal.fire("Error", "Failed to accept request", "error");
      } else {
        Swal.fire("Success", "Book request accepted", "success");
        fetchRequestsWithUsers();
      }
    };

    // Delete book
    const handleDelete = async (id) => {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) {
        Swal.fire("Error", "Failed to delete book", "error");
      } else {
        Swal.fire("Success", "Book deleted", "success");
        fetchBooks();
      }
    };

    // Edit book - populate form
    const handleEdit = (book) => {
      setForm({
        name: book.name,
        url: book.url,
        description: book.description,
      });
      setEditId(book.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Handle add/update book form submission
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (editId) {
        const { error } = await supabase
          .from("books")
          .update(form)
          .eq("id", editId);
        if (error) Swal.fire("Error", "Failed to update book", "error");
        else Swal.fire("Success", "Book updated", "success");
      } else {
        const { error } = await supabase.from("books").insert([form]);
        if (error) Swal.fire("Error", "Failed to add book", "error");
        else Swal.fire("Success", "Book added", "success");
      }

      setForm({ name: "", url: "", description: "" });
      setEditId(null);
      fetchBooks();
    };

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading...</p>;

    return (
      <div style={styles.container}>
        <h2 style={styles.title}>📚 Admin Dashboard</h2>

        {/* Add/Edit Book Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3 style={{ marginBottom: "15px" }}>{editId ? "✏️ Edit Book" : "➕ Add Book"}</h3>
          <input
            type="text"
            name="name"
            placeholder="Book Name"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="url"
            placeholder="Image URL"
            value={form.url}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
          <button type="submit" style={styles.btn}>
            {editId ? "Update Book" : "Add Book"}
          </button>
        </form>

        {/* Book List */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📗 Book List</h3>
          {books.length === 0 ? (
            <p style={styles.emptyText}>No books available.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Image</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, i) => (
                  <tr key={book.id} style={i % 2 ? styles.rowOdd : styles.rowEven}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={styles.td}>
                      <img src={book.url} alt={book.name} width="60" style={{ borderRadius: "4px" }} />
                    </td>
                    <td style={styles.td}>{book.name}</td>
                    <td style={styles.td}>{book.description}</td>
                    <td style={styles.td}>
                      <button
                        style={{ ...styles.btn, marginRight: "8px", backgroundColor: "#2196f3" }}
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </button>
                      <button
                        style={{ ...styles.btn, backgroundColor: "#f44336" }}
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Book Requests */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📥 Book Requests</h3>
          {requests.length === 0 ? (
            <p style={styles.emptyText}>No book requests.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>User Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Requested Book</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, i) => (
                  <tr key={req.id} style={i % 2 ? styles.rowOdd : styles.rowEven}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={styles.td}>{req.name}</td>
                    <td style={styles.td}>{req.email}</td>
                    <td style={styles.td}>{req.book_name}</td>
                    <td style={{ ...styles.td, fontWeight: "bold" }}>
                      {req.status === "accepted" ? (
                        <span style={{ color: "green" }}>Accepted</span>
                      ) : (
                        <span style={{ color: "orange" }}>Pending</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {req.status !== "accepted" && (
                        <button
                          style={{ ...styles.btn, backgroundColor: "#4caf50" }}
                          onClick={() => handleAccept(req.id)}
                        >
                          Accept
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "1100px",
      margin: "auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    title: {
      textAlign: "center",
      marginBottom: "30px",
      fontSize: "28px",
    },
    form: {
      marginBottom: "40px",
      border: "1px solid #ccc",
      padding: "20px",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      width: "98%",

    },
    input: {
      display: "block",
      width: "98%",
      marginBottom: "15px",
      padding: "10px",
      fontSize: "16px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    textarea: {
      display: "block",
      width: "98%",
      marginBottom: "15px",
      padding: "10px",
      fontSize: "16px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      resize: "vertical",
      minHeight: "70px",
    },
    btn: {
      padding: "10px 18px",
      fontSize: "16px",
      border: "none",
      borderRadius: "4px",
      color: "white",
      backgroundColor: "#2196f3",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    section: {
      marginTop: "40px",
    },
    sectionTitle: {
      marginBottom: "15px",
      fontSize: "22px",
    },
    emptyText: {
      fontStyle: "italic",
      color: "#555",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      borderBottom: "2px solid #ddd",
      padding: "12px 10px",
      textAlign: "left",
      backgroundColor: "#f1f1f1",
    },
    td: {
      padding: "12px 10px",
      borderBottom: "1px solid #eee",
      verticalAlign: "middle",
    },
    rowOdd: {
      backgroundColor: "#fafafa",
    },
    rowEven: {
      backgroundColor: "white",
    },
  };

  export default AdminDashboard;

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
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      Swal.fire("Unauthorized", "Please log in", "warning");
      navigate("/login");
      return;
    }

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

    await fetchBooks();
    await fetchRequestsWithUsers();
    setLoading(false);
  };

  const fetchBooks = async () => {
    const { data, error } = await supabase.from("books").select("*");
    if (error) {
      console.error("Error fetching books:", error.message);
      Swal.fire("Error", "Failed to load books", "error");
    } else {
      setBooks(data);
    }
  };

  const fetchRequestsWithUsers = async () => {
    const { data: requestsData, error: reqError } = await supabase
      .from("book_requests")
      .select("*")
      .order("id", { ascending: false });

    if (reqError) {
      console.error("Error fetching requests:", reqError.message);
      Swal.fire("Error", "Failed to load book requests", "error");
      return;
    }

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name, email");

    if (usersError) {
      console.error("Error fetching users:", usersError.message);
      Swal.fire("Error", "Failed to load users", "error");
      return;
    }

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

  const handleDelete = async (id) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) {
      Swal.fire("Error", "Failed to delete book", "error");
    } else {
      Swal.fire("Success", "Book deleted", "success");
      fetchBooks();
    }
  };

  const handleEdit = (book) => {
    setForm({
      name: book.name,
      url: book.url,
      description: book.description,
    });
    setEditId(book.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: 50, fontSize: 18 }}>
        Loading...
      </p>
    );

  return (
    <>
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .responsive-container {
            padding: 10px;
          }
          form, .section {
            width: 100% !important;
            padding: 10px !important;
          }
          input, textarea {
            width: 100% !important;
            font-size: 14px !important;
          }
          button {
            width: 100% !important;
            margin-top: 8px !important;
          }
          table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
          th, td {
            padding: 8px 6px !important;
            font-size: 14px !important;
          }
          h2, h3 {
            font-size: 22px !important;
          }
        }
      `}</style>

      <div style={styles.container} className="responsive-container">
        <h2 style={styles.title}>📚 Admin Dashboard</h2>

        {/* Add/Edit Book Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3 style={{ marginBottom: "15px" }}>
            {editId ? "✏️ Edit Book" : "➕ Add Book"}
          </h3>
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
                  <tr
                    key={book.id}
                    style={i % 2 ? styles.rowOdd : styles.rowEven}
                  >
                    <td style={styles.td}>{i + 1}</td>
                    <td style={styles.td}>
                      <img
                        src={book.url}
                        alt={book.name}
                        width="60"
                        style={{ borderRadius: "4px" }}
                      />
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
                  <tr
                    key={req.id}
                    style={i % 2 ? styles.rowOdd : styles.rowEven}
                  >
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
    </>
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
    minHeight: "60px",
  },
  btn: {
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#008080",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  section: {
    marginBottom: "40px",
    width: "100%",
  },
  sectionTitle: {
    marginBottom: "15px",
    fontSize: "24px",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ddd",
    padding: "12px",
    backgroundColor: "#f2f2f2",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "12px",
    verticalAlign: "middle",
  },
  rowOdd: {
    backgroundColor: "#fafafa",
  },
  rowEven: {
    backgroundColor: "#fff",
  },
  emptyText: {
    fontStyle: "italic",
    color: "#666",
  },
};

export default AdminDashboard;

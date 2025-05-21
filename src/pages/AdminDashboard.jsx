// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../Config/Supabase";
// import Swal from "sweetalert2";

// const AdminDashboard = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAdminData = async () => {
//       // Check auth
//       const {
//         data: { user },
//         error: authError,
//       } = await supabase.auth.getUser();

//       if (authError || !user) {
//         Swal.fire("Unauthorized", "Please log in", "warning");
//         navigate("/login");
//         return;
//       }

//       // Check role
//       const { data: roleData, error: roleError } = await supabase
//         .from("roles")
//         .select("role")
//         .eq("user_id", user.id)
//         .single();

//       if (roleError || roleData?.role !== "admin") {
//         Swal.fire("Access Denied", "You are not authorized", "error");
//         navigate("/");
//         return;
//       }

//       // Fetch book requests
//       const { data: requests, error: reqError } = await supabase
//         .from("book_requests")
//         .select("*")
//         .order("id", { ascending: false });

//       if (reqError) {
//         console.error("Error fetching book requests:", reqError.message);
//         Swal.fire("Error", "Failed to load book requests", "error");
//         setLoading(false);
//         return;
//       }

//       // Fetch all users
//       const { data: users, error: usersError } = await supabase
//         .from("users")
//         .select("id, name, email");

//       if (usersError) {
//         console.error("Error fetching users:", usersError.message);
//         Swal.fire("Error", "Failed to load users", "error");
//         setLoading(false);
//         return;
//       }

//       // Combine request and user info
//       const enriched = requests.map((req) => {
//         const userInfo = users.find((u) => u.id === req.user_id);
//         return {
//           id: req.id,
//           book_name: req.book_name,
//           name: userInfo?.name || "Unknown",
//           email: userInfo?.email || "Unknown",
//         };
//       });

//       setRequests(enriched);
//       setLoading(false);
//     };

//     fetchAdminData();
//   }, [navigate]);

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Admin Dashboard</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : requests.length === 0 ? (
//         <p>No book requests yet.</p>
//       ) : (
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={styles.th}>#</th>
//               <th style={styles.th}>User Name</th>
//               <th style={styles.th}>Email</th>
//               <th style={styles.th}>Requested Book</th>
//             </tr>
//           </thead>
//           <tbody>
//             {requests.map((req, index) => (
//               <tr key={req.id}>
//                 <td style={styles.td}>{index + 1}</td>
//                 <td style={styles.td}>{req.name}</td>
//                 <td style={styles.td}>{req.email}</td>
//                 <td style={styles.td}>{req.book_name}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     padding: "40px",
//     maxWidth: "900px",
//     margin: "auto",
//     fontFamily: "Arial, sans-serif",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: "30px",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   th: {
//     border: "1px solid #ddd",
//     padding: "12px",
//     backgroundColor: "#f2f2f2",
//   },
//   td: {
//     border: "1px solid #ddd",
//     padding: "10px",
//     textAlign: "center",
//   },
// };

// export default AdminDashboard;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Config/Supabase";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
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

    const { data: requests, error: reqError } = await supabase
      .from("book_requests")
      .select("*")
      .order("id", { ascending: false });

    if (reqError) {
      console.error("Error fetching book requests:", reqError.message);
      Swal.fire("Error", "Failed to load book requests", "error");
      setLoading(false);
      return;
    }

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name, email");

    if (usersError) {
      console.error("Error fetching users:", usersError.message);
      Swal.fire("Error", "Failed to load users", "error");
      setLoading(false);
      return;
    }

    const enriched = requests.map((req) => {
      const userInfo = users.find((u) => u.id === req.user_id);
      return {
        id: req.id,
        book_name: req.book_name,
        name: userInfo?.name || "Unknown",
        email: userInfo?.email || "Unknown",
        status: req.status || "pending",
      };
    });

    setRequests(enriched);
    setLoading(false);
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
      fetchAdminData(); // Refresh the list
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No book requests yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>User Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Requested Book</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={req.id}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{req.name}</td>
                <td style={styles.td}>{req.email}</td>
                <td style={styles.td}>{req.book_name}</td>
                <td style={styles.td}>
                  {req.status === "accepted" ? "✅ Accepted" : "⏳ Pending"}
                </td>
                <td style={styles.td}>
                  {req.status !== "accepted" && (
                    <button style={styles.btn} onClick={() => handleAccept(req.id)}>
                      Accept Request
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    maxWidth: "1000px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ddd",
    padding: "12px",
    backgroundColor: "#f2f2f2",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
  },
  btn: {
    padding: "6px 12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default AdminDashboard;

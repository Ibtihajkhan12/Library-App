// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../Config/Supabase";
// import Swal from "sweetalert2";

// const ADMIN_SECRET = "Admin123";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [adminKey, setAdminKey] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     const { error, data } = await supabase.auth.signInWithPassword({ email, password });

//     if (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Login Failed",
//         text: error.message,
//       });
//       return;
//     }

//     // Get user ID from logged-in user
//     const userId = data.user?.id;

//     if (!userId) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "User ID not found after login.",
//       });
//       return;
//     }

//     // Fetch the role from 'roles' table
//     const { data: roleData, error: roleError } = await supabase
//       .from("roles")
//       .select("role")
//       .eq("user_id", userId)
//       .single();

//     if (roleError || !roleData) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to fetch user role.",
//       });
//       return;
//     }

//     const userRole = roleData.role;
//     const isAdminKeyValid = adminKey === ADMIN_SECRET;

//     // Logic:
//     // If user role is admin and admin key matches => admin dashboard
//     // If user role is not admin but admin key is entered => deny access
//     // Otherwise => user dashboard

//     if (isAdminKeyValid && userRole !== "admin") {
//       Swal.fire({
//         icon: "error",
//         title: "Access Denied",
//         text: "You are not authorized as admin.",
//       });
//       return; // Don't redirect
//     }

//     Swal.fire({
//       icon: "success",
//       title: "Login Successful!",
//       text: "Redirecting to dashboard...",
//       timer: 2000,
//       timerProgressBar: true,
//       showConfirmButton: false,
//     }).then(() => {
//       if (userRole === "admin") {
//         navigate("/AdminDashboard");
//       } else {
//         navigate("/dashboard");
//       }
//     });
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Login</h2>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         style={styles.input}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         style={styles.input}
//       />
//       <input
//         type="password"
//         placeholder="Admin Key (if admin)"
//         value={adminKey}
//         onChange={(e) => setAdminKey(e.target.value)}
//         style={styles.input}
//       />
//       <button onClick={handleLogin} style={styles.button}>
//         Login
//       </button>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: "400px",
//     margin: "auto",
//     marginTop: "60px",
//     padding: "30px",
//     border: "1px solid #ccc",
//     borderRadius: "12px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//     fontFamily: "Arial, sans-serif",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: "20px",
//     color: "#333",
//   },
//   input: {
//     width: "100%",
//     padding: "10px",
//     marginBottom: "15px",
//     border: "1px solid #ccc",
//     borderRadius: "6px",
//     fontSize: "14px",
//   },
//   button: {
//     width: "100%",
//     padding: "12px",
//     backgroundColor: "#2196F3",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     fontSize: "16px",
//     cursor: "pointer",
//   },
// };

// export default Login;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Config/Supabase";
import Swal from "sweetalert2";

const ADMIN_SECRET = "Admin123";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User ID not found after login.",
      });
      return;
    }

    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (roleError || !roleData) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch user role.",
      });
      return;
    }

    const userRole = roleData.role;
    const isAdminKeyValid = adminKey === ADMIN_SECRET;

    if (isAdminKeyValid && userRole !== "admin") {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You are not authorized as admin.",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Login Successful!",
      text: "Redirecting to dashboard...",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => {
      if (userRole === "admin") {
        navigate("/AdminDashboard");
      } else {
        navigate("/dashboard");
      }
    });
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Admin Key (if admin)"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
};

const styles = {
  outerContainer: {
    padding: "20px",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: "400px",
    padding: "25px",
    border: "1px solid #ccc",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Login;

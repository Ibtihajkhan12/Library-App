// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../Config/Supabase";
// import Swal from "sweetalert2";

// const ADMIN_SECRET = "Admin123";

// const Signup = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [chapter, setChapter] = useState("");
//   const [adminKey, setAdminKey] = useState("");

//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     const finalRole = adminKey === ADMIN_SECRET ? "admin" : "user";

//     const { data, error } = await supabase.auth.signUp({ email, password });

//     if (error) {
//       if (
//         error.message.includes("already registered") ||
//         error.message.includes("User already registered") ||
//         error.message.includes("duplicate")
//       ) {
//         Swal.fire({
//           icon: "warning",
//           title: "User Already Exists",
//           text: "Redirecting to login...",
//           timer: 2500,
//           timerProgressBar: true,
//           showConfirmButton: false,
//         }).then(() => {
//           navigate("/login");
//         });
//         return;
//       }

//       Swal.fire({
//         icon: "error",
//         title: "Signup Failed",
//         text: error.message,
//       });
//       return;
//     }

//     const userId = data.user?.id;

//     if (!userId) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Error getting user ID after signup.",
//       });
//       return;
//     }

//     await supabase.from("roles").insert([{ user_id: userId, role: finalRole }]);
//     await supabase.from("users").insert([
//       {
//         id: userId,
//         email,
//         name,
//         phone,
//         chapter,
//       },
//     ]);

//     Swal.fire({
//       icon: "success",
//       title: "Signup Successful!",
//       text: "Redirecting to login...",
//       timer: 2500,
//       timerProgressBar: true,
//       showConfirmButton: false,
//     }).then(() => {
//       navigate("/login");
//     });
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Signup</h2>

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
//         type="text"
//         placeholder="Full Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         style={styles.input}
//       />

//       <input
//         type="tel"
//         placeholder="Phone"
//         value={phone}
//         onChange={(e) => setPhone(e.target.value)}
//         style={styles.input}
//       />

//       <input
//         type="text"
//         placeholder="Chapter"
//         value={chapter}
//         onChange={(e) => setChapter(e.target.value)}
//         style={styles.input}
//       />

//       <input
//         type="password"
//         placeholder="Admin Key (if admin)"
//         value={adminKey}
//         onChange={(e) => setAdminKey(e.target.value)}
//         style={styles.input}
//       />

//       <button onClick={handleSignup} style={styles.button}>
//         Sign Up
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
//     backgroundColor: "#28a745",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     fontSize: "16px",
//     cursor: "pointer",
//   },
// };

// export default Signup;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Config/Supabase";
import Swal from "sweetalert2";

const ADMIN_SECRET = "Admin123";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [chapter, setChapter] = useState("");
  const [adminKey, setAdminKey] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    const finalRole = adminKey === ADMIN_SECRET ? "admin" : "user";

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (
        error.message.includes("already registered") ||
        error.message.includes("User already registered") ||
        error.message.includes("duplicate")
      ) {
        Swal.fire({
          icon: "warning",
          title: "User Already Exists",
          text: "Redirecting to login...",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate("/login");
        });
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message,
      });
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error getting user ID after signup.",
      });
      return;
    }

    await supabase.from("roles").insert([{ user_id: userId, role: finalRole }]);
    await supabase.from("users").insert([
      {
        id: userId,
        email,
        name,
        phone,
        chapter,
      },
    ]);

    Swal.fire({
      icon: "success",
      title: "Signup Successful!",
      text: "Redirecting to login...",
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => {
      navigate("/login");
    });
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>Signup</h2>

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
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Chapter"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Admin Key (if admin)"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSignup} style={styles.button}>
          Sign Up
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
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Signup;

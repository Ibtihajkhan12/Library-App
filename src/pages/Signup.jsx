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
  const [adminKey, setAdminKey] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (selectedRole === "admin" && adminKey !== ADMIN_SECRET) {
      Swal.fire({
        icon: "error",
        title: "Invalid Admin Key",
        text: "The admin key you entered is incorrect.",
      });
      return;
    }

    const finalRole = selectedRole;

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
        ...(finalRole === "user" && { name, phone }),
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

        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="user"
              checked={selectedRole === "user"}
              onChange={() => setSelectedRole("user")}
            />
            User
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="admin"
              checked={selectedRole === "admin"}
              onChange={() => setSelectedRole("admin")}
            />
            Admin
          </label>
        </div>

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

        {selectedRole === "user" && (
          <>
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
          </>
        )}

        {selectedRole === "admin" && (
          <input
            type="password"
            placeholder="Admin Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            style={styles.input}
          />
        )}

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
  radioGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    marginBottom: "20px",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
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

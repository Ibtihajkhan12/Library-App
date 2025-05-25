import React, { useEffect, useState } from "react";
import { supabase } from "../Config/Supabase";
import Swal from "sweetalert2";
import "./AdminDashboard.css"; // new CSS file

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [viewingRecycleBin, setViewingRecycleBin] = useState(false);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "pending")
      .order("id", { ascending: false });

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      setEvents(data);
      setViewingRecycleBin(false);
    }
  };

  const fetchRecycleBinEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "rejected")
      .order("id", { ascending: false });

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      setEvents(data);
      setViewingRecycleBin(true);
    }
  };

  const handleApprove = async (id) => {
    const { error } = await supabase
      .from("events")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Approved", "Event has been approved", "success");
      fetchPendingEvents();
    }
  };

  const handleReject = async (id) => {
    const { error } = await supabase
      .from("events")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Rejected", "Event has been rejected", "warning");
      fetchPendingEvents();
    }
  };

  const handleRestore = async (id) => {
    const { error } = await supabase
      .from("events")
      .update({ status: "pending" })
      .eq("id", id);

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Restored", "Event restored to pending", "success");
      fetchRecycleBinEvents();
    }
  };

  const handleViewUser = async (user_email) => {
    if (!user_email) {
      Swal.fire("Error", "User email not provided.", "error");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("full_name, email, phone, created_at")
      .eq("email", user_email)
      .single();

    if (error || !data) {
      Swal.fire("Error", "User information not found.", "error");
      return;
    }

    Swal.fire({
      title: "User Information",
      html: `
        <strong>Name:</strong> ${data.full_name || "N/A"}<br/>
        <strong>Email:</strong> ${data.email}<br/>
        <strong>Phone:</strong> ${data.phone || "N/A"}<br/>
        <strong>Joined:</strong> ${new Date(data.created_at).toLocaleDateString()}
      `,
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  return (
    <div>
      <header className="admin-header">
        <h1>EventManager</h1>
        <div className="header-buttons">
          <button onClick={() => window.location.href = "/AdminDashboard"}>Admin Dashboard</button>
          <button
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                Swal.fire("Error", error.message, "error");
              } else {
                window.location.href = "/login";
              }
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="admin-container">
        <h2>{viewingRecycleBin ? "Recycle Bin - Rejected Events" : "Pending Event Requests"}</h2>

        <div className="view-toggle">
          <button onClick={viewingRecycleBin ? fetchPendingEvents : fetchRecycleBinEvents}>
            {viewingRecycleBin ? "Back to Pending Events" : "View Recycle Bin"}
          </button>
        </div>

        {events.length === 0 ? (
          <p className="empty-message">
            {viewingRecycleBin ? "No rejected events found." : "No pending event requests."}
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>User</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.description}</td>
                    <td>{event.user_email || "N/A"}</td>
                    <td className="actions">
                      {!viewingRecycleBin ? (
                        <>
                          <button className="approve" onClick={() => handleApprove(event.id)}>Approve</button>
                          <button className="reject" onClick={() => handleReject(event.id)}>Reject</button>
                        </>
                      ) : (
                        <button className="restore" onClick={() => handleRestore(event.id)}>Restore</button>
                      )}
                      <button className="view" onClick={() => handleViewUser(event.user_email)}>View User</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Config/Supabase";
import Swal from "sweetalert2";

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", description: "" });
  const [editingEvent, setEditingEvent] = useState(null);
  const [participantInputs, setParticipantInputs] = useState({});

  const [participantsData, setParticipantsData] = useState({});

  const [dropdownOpen, setDropdownOpen] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (currentUser) fetchEvents();
  }, [currentUser]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("creator_id", currentUser.id);

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      setEvents(data);
      data.forEach((event) => fetchParticipants(event.id));
    }
  };

  const fetchParticipants = async (eventIds) => {
    let ids = Array.isArray(eventIds) ? eventIds : [eventIds];
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .in("event_id", ids);

    if (error) {
      console.error("Error fetching participants:", error);
      Swal.fire("Error", error.message, "error");
      return;
    }

    const grouped = {};
    ids.forEach((id) => (grouped[id] = []));
    data.forEach((participant) => {
      if (!grouped[participant.event_id]) grouped[participant.event_id] = [];
      grouped[participant.event_id].push(participant);
    });

    setParticipantsData((prev) => ({ ...prev, ...grouped }));
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.description) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    const { error } = await supabase.from("events").insert([
      {
        title: newEvent.title,
        description: newEvent.description,
        status: "pending",
        creator_id: currentUser.id,
      },
    ]);

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Success", "Event submitted for approval", "success");
      setNewEvent({ title: "", description: "" });
      fetchEvents();
    }
  };

  const startEditEvent = (event) => {
    if (event.status !== "pending") {
      Swal.fire("Error", "Only pending events can be edited", "error");
      return;
    }
    setEditingEvent(event);
    setNewEvent({ title: event.title, description: event.description });
  };

  const handleUpdateEvent = async () => {
    if (!newEvent.title || !newEvent.description) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    const { error } = await supabase
      .from("events")
      .update({
        title: newEvent.title,
        description: newEvent.description,
      })
      .eq("id", editingEvent.id)
      .eq("status", "pending")
      .eq("creator_id", currentUser.id);

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Success", "Event updated", "success");
      setEditingEvent(null);
      setNewEvent({ title: "", description: "" });
      fetchEvents();
    }
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setNewEvent({ title: "", description: "" });
  };

  const handleAddParticipant = async (eventId) => {
    const participant = participantInputs[eventId];
    if (
      !participant ||
      !participant.name.trim() ||
      !participant.email.trim() ||
      !participant.phone.trim() ||
      !participant.image_url.trim()
    ) {
      Swal.fire("Error", "Please fill all participant fields, including Image URL", "error");
      return;
    }

    const { error } = await supabase.from("events")
      .update({participante :{
        event_id: eventId,
        participant_name: participant.name.trim(),
        participant_email: participant.email.trim(),
        participant_phone: participant.phone.trim(),
        participant_image_url: participant.image_url.trim(),
      },
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Success", "Participant added", "success");
      setParticipantInputs((prev) => ({
        ...prev,
        [eventId]: { name: "", email: "", phone: "", image_url: "" },
      }));
      fetchParticipants(eventId);
      setDropdownOpen((prev) => ({ ...prev, [eventId]: false })); // close dropdown after adding
    }
  };

  const handleParticipantInputChange = (eventId, field, value) => {
    setParticipantInputs((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: value,
      },
    }));
  };

  const toggleDropdown = (eventId) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!currentUser) return <p>Loading user...</p>;

  const Header = () => {
    const handleLogout = async () => {
      await supabase.auth.signOut();
      navigate("/login");
    };

    const styles = {
      header: {
        backgroundColor: "#1f2937",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      logo: {
        color: "#fff",
        fontSize: "1.5rem",
        fontWeight: "bold",
        textDecoration: "none",
      },
      nav: {
        display: "flex",
        gap: "1rem",
      },
      button: {
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        fontWeight: "500",
        fontSize: "1rem",
      },
      dashboardBtn: {
        backgroundColor: "#3b82f6",
        color: "#fff",
      },
      logoutBtn: {
        backgroundColor: "#ef4444",
        color: "#fff",
      },
    };

    return (
      <header style={styles.header}>
        <div style={styles.logo}>EventManager</div>
        <nav style={styles.nav}>
          <button
            style={{ ...styles.button, ...styles.dashboardBtn }}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button
            style={{ ...styles.button, ...styles.logoutBtn }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </header>
    );
  };

  const styles = {
    container: {
      maxWidth: "960px",
      margin: "0 auto",
      padding: "2rem 1rem",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "1.5rem",
    },
    searchInput: {
      width: "100%",
      maxWidth: "300px",
      padding: "0.5rem",
      borderRadius: "6px",
      border: "1px solid #ccc",
      marginBottom: "1rem",
    },
    formBox: {
      background: "#f9f9f9",
      borderRadius: "8px",
      padding: "1rem",
      boxShadow: "0 0 8px rgba(0,0,0,0.08)",
      marginBottom: "2rem",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      marginBottom: "1rem",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "1rem",
    },
    buttonBlue: {
      backgroundColor: "#2563eb",
      color: "#fff",
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
    },
    buttonYellow: {
      backgroundColor: "#fbbf24",
      color: "#000",
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "6px",
      marginRight: "0.5rem",
      cursor: "pointer",
    },
    buttonGray: {
      backgroundColor: "#6b7280",
      color: "#fff",
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1.5rem",
    },
    card: {
      backgroundColor: "#fff",
      padding: "1rem",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      position: "relative",
    },
    cardTitle: {
      fontSize: "1.125rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
    },
    cardText: {
      fontSize: "0.95rem",
      marginBottom: "0.75rem",
      color: "#4b5563",
    },
    statusText: (status) => ({
      color:
        status === "approved"
          ? "#16a34a"
          : status === "pending"
          ? "#ca8a04"
          : "#ef4444",
      fontWeight: "600",
    }),
    participantList: {
      marginTop: "1rem",
      maxHeight: "150px",
      overflowY: "auto",
      borderTop: "1px solid #e5e7eb",
      paddingTop: "0.75rem",
    },
    participantItem: {
      marginBottom: "0.5rem",
      display: "flex",
      alignItems: "center",
      fontSize: "0.9rem",
      color: "#374151",
    },
    noEvents: {
      textAlign: "center",
      color: "#9ca3af",
      fontStyle: "italic",
    },
  };

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>Welcome, {currentUser.email}</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search events by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        {/* New / Edit Event Form */}
        <div style={styles.formBox}>
          <h3>{editingEvent ? "Edit Event" : "Create New Event"}</h3>
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            style={styles.input}
          />
          <textarea
            placeholder="Event Description"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
            rows={3}
            style={{ ...styles.input, resize: "vertical" }}
          />
          {editingEvent ? (
            <>
              <button onClick={handleUpdateEvent} style={styles.buttonBlue}>
                Update Event
              </button>
              <button
                onClick={cancelEdit}
                style={{ ...styles.buttonGray, marginLeft: "0.5rem" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button onClick={handleCreateEvent} style={styles.buttonBlue}>
              Submit Event
            </button>
          )}
        </div>

        {/* Event Cards */}
        <div style={styles.cardGrid}>
          {filteredEvents.length === 0 ? (
            <p style={styles.noEvents}>No events found.</p>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{event.title}</h3>
                <p style={styles.cardText}>{event.description}</p>
                <p>
                  Status:{" "}
                  <span style={styles.statusText(event.status)}>{event.status}</span>
                </p>

                {/* Edit button only if pending */}
                {event.status === "pending" && (
                  <button
                    style={styles.buttonYellow}
                    onClick={() => startEditEvent(event)}
                  >
                    Edit
                  </button>
                )}

                {/* Participant dropdown for approved events */}
                {event.status === "approved" && (
                  <>
                    <button
                      style={{ ...styles.buttonBlue, marginBottom: "0.75rem" }}
                      onClick={() => toggleDropdown(event.id)}
                    >
                      {dropdownOpen[event.id]
                        ? "Hide Participant Form ▲"
                        : "Add Participant ▼"}
                    </button>

                    {dropdownOpen[event.id] && (
                      <>
                        <h4>Add Participant</h4>
                        <input
                          type="text"
                          placeholder="Name"
                          value={participantInputs[event.id]?.name || ""}
                          onChange={(e) =>
                            handleParticipantInputChange(event.id, "name", e.target.value)
                          }
                          style={{
                            ...styles.input,
                            maxWidth: "250px",
                            display: "inline-block",
                            marginRight: "0.5rem",
                          }}
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={participantInputs[event.id]?.email || ""}
                          onChange={(e) =>
                            handleParticipantInputChange(event.id, "email", e.target.value)
                          }
                          style={{
                            ...styles.input,
                            maxWidth: "250px",
                            display: "inline-block",
                            marginRight: "0.5rem",
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Phone"
                          value={participantInputs[event.id]?.phone || ""}
                          onChange={(e) =>
                            handleParticipantInputChange(event.id, "phone", e.target.value)
                          }
                          style={{
                            ...styles.input,
                            maxWidth: "150px",
                            display: "inline-block",
                            marginRight: "0.5rem",
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={participantInputs[event.id]?.image_url || ""}
                          onChange={(e) =>
                            handleParticipantInputChange(event.id, "image_url", e.target.value)
                          }
                          style={{
                            ...styles.input,
                            maxWidth: "300px",
                            display: "inline-block",
                            marginRight: "0.5rem",
                          }}
                        />
                        <br />
                        <button
                          style={{ ...styles.buttonBlue, marginTop: "0.5rem" }}
                          onClick={() => handleAddParticipant(event.id)}
                        >
                          Add Participant
                        </button>

                        {/* Participant List */}
                        <div style={styles.participantList}>
                          <h5>Participants:</h5>
                          {participantsData[event.id] &&
                          participantsData[event.id].length > 0 ? (
                            participantsData[event.id].map((p) => (
                              <p key={p.id} style={styles.participantItem}>
                                <img
                                  src={p.participant_image_url}
                                  alt={p.participant_name}
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    marginRight: 8,
                                    verticalAlign: "middle",
                                  }}
                                />
                                {p.participant_name} - {p.participant_email} -{" "}
                                {p.participant_phone}
                              </p>
                            ))
                          ) : (
                            <p
                              style={{ fontStyle: "italic", color: "#9ca3af" }}
                            >
                              No participants added yet.
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/Spinner";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Spinner />;

  if (error) return (
    <div style={styles.container}>
      <p style={styles.error}>{error}</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Profile Picture */}
        <div style={styles.avatarWrapper}>
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              style={styles.avatar}
            />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {user.name ? user.name[0].toUpperCase() : "?"}
            </div>
          )}
        </div>

        {/* Name and Role */}
        <h1 style={styles.name}>{user.name}</h1>
        <span style={styles.roleBadge}>{user.role}</span>

        {/* Email */}
        <p style={styles.email}>{user.email}</p>

        {/* Bio */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Bio</h3>
          {user.bio ? (
            <p style={styles.bio}>{user.bio}</p>
          ) : (
            <p style={styles.empty}>
              No bio yet.{" "}
              <Link to="/profile/edit" style={styles.link}>
                Add one
              </Link>
            </p>
          )}
        </div>

        {/* Skills */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Skills</h3>
          {user.skills && user.skills.length > 0 ? (
            <div style={styles.chipsWrapper}>
              {user.skills.map((skill, index) => (
                <span key={index} style={styles.chip}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={styles.empty}>
              No skills extracted yet.
            </p>
          )}
        </div>

        {/* Edit Button */}
        <Link to="/profile/edit" style={styles.editButton}>
          Edit Profile
        </Link>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  avatarWrapper: {
    marginBottom: "8px",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #4f46e5",
  },
  avatarPlaceholder: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    fontWeight: "bold",
  },
  name: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: 0,
  },
  roleBadge: {
    backgroundColor: "#ede9fe",
    color: "#4f46e5",
    padding: "4px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  email: {
    color: "#6b7280",
    fontSize: "14px",
    margin: 0,
  },
  section: {
    width: "100%",
    marginTop: "12px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "8px",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "6px",
  },
  bio: {
    color: "#4b5563",
    lineHeight: "1.7",
    fontSize: "15px",
  },
  chipsWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  chip: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
  },
  empty: {
    color: "#9ca3af",
    fontSize: "14px",
    fontStyle: "italic",
  },
  link: {
    color: "#4f46e5",
    textDecoration: "underline",
  },
  editButton: {
    marginTop: "20px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    padding: "12px 32px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
  },
  error: {
    color: "#ef4444",
    fontSize: "16px",
  },
};
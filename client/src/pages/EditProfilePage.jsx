import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { profileService } from "../services/api";

function EditProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", bio: "", profilePicture: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await profileService.getProfile();
        setFormData({
          name: data.user?.name || "",
          bio: data.user?.bio || "",
          profilePicture: data.user?.profilePicture || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await profileService.updateProfile(formData);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading profile" />;

  return (
    <section className="form-page">
      <h1>Edit Profile</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Bio
          <textarea name="bio" rows="6" value={formData.bio} onChange={handleChange} />
        </label>
        <label>
          Profile picture URL
          <input name="profilePicture" value={formData.profilePicture} onChange={handleChange} />
        </label>
        {error && <p className="form-alert form-alert-error">{error}</p>}
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save profile"}</button>
      </form>
    </section>
  );
}

export default EditProfilePage;

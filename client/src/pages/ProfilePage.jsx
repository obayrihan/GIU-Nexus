import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SkillChip from "../components/SkillChip";
import Spinner from "../components/Spinner";
import { profileService } from "../services/api";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");
  const [skillError, setSkillError] = useState("");

  const loadProfile = async () => {
    const { data } = await profileService.getProfile();
    setProfile(data.user);
  };

  useEffect(() => {
    async function load() {
      try {
        await loadProfile();
      } catch (err) {
        setError(err.response?.data?.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleExtractSkills = async () => {
    setSkillError("");
    setExtracting(true);
    try {
      await profileService.extractSkills();
      await loadProfile();
    } catch (err) {
      setSkillError(err.response?.data?.message || "Could not extract skills.");
    } finally {
      setExtracting(false);
    }
  };

  if (loading) return <Spinner label="Loading profile" />;
  if (error) return <p className="form-alert form-alert-error">{error}</p>;

  return (
    <div className="page-stack">
      <section className="profile-header">
        <div className="avatar">{profile?.profilePicture ? <img src={profile.profilePicture} alt="" /> : profile?.name?.[0]}</div>
        <div className="profile-identity">
          <h1>{profile?.name}</h1>
          <p>{profile?.email}</p>
          <span className="user-chip">{profile?.role}</span>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <h2>Bio</h2>
          <Link to="/profile/edit">Edit profile</Link>
        </div>
        <p>{profile?.bio || "No bio added yet."}</p>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <h2>Skill Chips</h2>
          <button type="button" disabled={extracting} onClick={handleExtractSkills}>
            {extracting ? "Extracting..." : "Extract Skills from Bio"}
          </button>
        </div>
        {skillError && (
          <p className="form-alert form-alert-error">
            {skillError} <Link to="/profile/edit">Update your profile</Link>
          </p>
        )}
        <div className="chip-row">
          {profile?.skills?.length ? profile.skills.map((skill) => <SkillChip key={skill} skill={skill} />) : <p>No skills extracted yet.</p>}
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;

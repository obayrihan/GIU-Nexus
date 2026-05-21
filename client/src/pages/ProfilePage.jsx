import React from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  return (
    <div>
      <h1>My Profile</h1>

      <img
        src="https://via.placeholder.com/150"
        alt="profile"
        width="150"
      />

      <h2>Mostafa</h2>

      <p>Email: mostafa@example.com</p>

      <p>Role: jobSeeker</p>

      <p>Bio: Passionate frontend developer.</p>

      <h3>Skills</h3>

      <div>
        <span>React</span>
        <span>Node.js</span>
        <span>MongoDB</span>
      </div>

      <Link to="/profile/edit">
        Edit Profile
      </Link>
    </div>
  );
};

export default ProfilePage;
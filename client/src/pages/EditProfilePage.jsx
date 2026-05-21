import React from 'react';

const EditProfilePage = () => {
  return (
    <div>
      <h1>Edit Profile</h1>

      <form>
        <div>
          <label>Name</label>
          <input type="text" />
        </div>

        <div>
          <label>Bio</label>
          <textarea rows="5"></textarea>
        </div>

        <div>
          <label>Profile Picture URL</label>
          <input type="text" />
        </div>

        <button type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
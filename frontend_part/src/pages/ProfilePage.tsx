import { useState } from "react";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";
import React from "react";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("IVANNA STASHKO");
  const [email, setEmail] = useState("yonaaani@email.com");
  const [password, setPassword] = useState("password123");
  const [photo, setPhoto] = useState("/user-photo.png");

  const navigate = useNavigate();

  const saveChanges = () => {
      updateUser();
    };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveChanges();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // видаляємо токен
    navigate("/"); // повертаємо на сторінку входу
  };

  const updateUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Email", email);
    formData.append("Password", password);

    // додаємо фото, якщо воно змінилося
    if (photo && !photo.startsWith("/")) {
      const response = await fetch(photo);
      const blob = await response.blob();
      formData.append("Image", blob, "avatar.png");
    }

    const response = await fetch("http://localhost:5000/api/User", {
      method: "PATCH", // або "PUT" залежно від API
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.isSuccess) {
      throw new Error(data.message || "Failed to update profile");
    }

    alert("✅ Profile updated successfully");
    setIsEditing(false);

    // оновлюємо токен, якщо сервер повертає новий
    if (data.message) {
      localStorage.setItem("token", data.message);
    }

  } catch (err: any) {
    console.error("❌ Update profile error:", err);
    alert(err.message || "Failed to update profile");
  }
};


  return (
    <div className="profile-page">
      {/* Банер */}
      <div className="profile-banner">
        <img src="/profile-banner.png" alt="Banner" className="banner-img" />

        {/* Кнопка поверх банера */}
        <img
          src="/edit-profile-button.png"
          alt="Edit profile"
          className="profile-banner-button"
          onClick={() => setIsEditing(true)}
        />

      </div>

      {/* Лінія */}
      <img className="vector1" src="/line.svg" />

      {/* Основний контент */}
      <div className="profile-main">
        {/* Фото користувача */}
        <div className="profile-photo-wrapper">
          <img
            src={photo}
            alt="User"
            className="profile-photo"
            onClick={() =>
              isEditing && document.getElementById("photoInput")?.click()
            }
          />

          <input
            id="photoInput"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPhoto(URL.createObjectURL(file));
              }
            }}
          />
        </div>


        {/* Імʼя + поля */}
        <div className="profile-info">
          <div className="profile-name-block">
            <h1
              className={`profile-name ${isEditing ? "editable" : ""}`}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onInput={(e) => setName(e.currentTarget.textContent || "")}
              onKeyDown={handleKeyDown}
            >
              <span className="name-special">{name[0]}</span>
              <span className="name-middle">{name.slice(1, -1)}</span>
              <span className="name-special">{name[name.length - 1]}</span>
            </h1>

            <p className="profile-subtitle">Personal User Page</p>
          </div>

          {/* Email + Password справа */}
          <div className="profile-credentials">

          {/* Email */}
          <div className="input-group">
            <img src="/email-icon.png" alt="Email" className="input-icon" />
            <span className="input-label">Email</span>
            <input
              type="email"
              value={email}
              readOnly={!isEditing}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input-field"
            />
            </div>

          {/* Password (БЕЗ show/hide) */}
          <div className="input-group">
            <img
              src="/password-icon.png"
              alt="Password"
              className="input-icon"
            />
            <span className="input-label">Password</span>
            <input
              type={isEditing ? "text" : "password"}
              value={password}
              readOnly={!isEditing}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input-field"
            />
          </div>

        </div>
        </div>
      </div>

       {/* Кнопка виходу */}
      <button
        style={{
          marginTop: "330px",
          padding: "10px 20px",
          marginLeft: "1310px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;

// C:\quran-similarity-app\backend\modules\auth\user.model.js
// Added: updatePassword, findById now returns created_at

const db = require("../config/database");

const findByEmail = (email) => {
    console.log("findByEmail query executed");
    return db.get(
        "SELECT id, username, email, password, aqmosProfile FROM users WHERE email = ?",
        [email]
    );
};

const findById = (id) => {
    console.log("findById query executed");
    return db.get(
        "SELECT id, username, email, created_at, aqmosProfile FROM users WHERE id = ?",
        [id]
    );
};

const createUser = (username, email, hashedPassword) =>
    db.run(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
    );

// NEW: update hashed password for a user
const updatePassword = (id, hashedPassword) =>
    db.run(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, id]
    );

// NEW: update AQMOS profile for a user
const updateAqmosProfile = (id, aqmosProfile) =>
    db.run(
        "UPDATE users SET aqmosProfile = ? WHERE id = ?",
        [aqmosProfile, id]
    );

// NEW: clear AQMOS profile for a user
const clearAqmosProfile = (id) =>
    db.run(
        "UPDATE users SET aqmosProfile = NULL WHERE id = ?",
        [id]
    );

module.exports = { findByEmail, findById, createUser, updatePassword, updateAqmosProfile, clearAqmosProfile };
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  profileImage: String,
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;

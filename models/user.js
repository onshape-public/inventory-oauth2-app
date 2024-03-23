// Load required packages
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

// Define our user schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

// Execute before each user.save() call
UserSchema.pre("save", function (callback) {
  // eslint-disable-next-line no-invalid-this
  const user = this;

  // Break out if the password hasn't changed
  if (!user.isModified("password")) {
    return callback();
  }

  // Password changed so we need to hash it
  bcrypt.genSalt(5, (err, salt) => {
    if (err) {
      return callback(err);
    }

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return callback(err);
      }
      user.password = hash;
      callback();
    });
  });
});

UserSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

// Export the Mongoose model
module.exports = mongoose.model("User", UserSchema);

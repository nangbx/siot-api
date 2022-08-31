const cloudinary = require("cloudinary");

cloudinary.config({
	cloud_name: "nh3-ha-noi",
	api_key: "494771685723845",
	api_secret: "ZZztxZqhTHUa0DfIh1aKYlKA1ng",
});

module.exports = { cloudinary };

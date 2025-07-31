const db = require("../config/db");

const getProfile = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM tb_user ORDER BY id DESC");

    const user = users[0];
    res.json({
      success: true,
      status: 0,
      message: "Sukses",
      data: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userImage = req.user.profile_image;

    if (!userEmail) {
      return res.status(400).json({
        status: 108,
        message: "Token tidak tidak valid atau kadaluwarsa",
        data: null,
      });
    }

    const { first_name, last_name } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: "First name dan Last name wajib diisi dengan benar",
      });
    }

    const [result] = await db.query(
      "UPDATE tb_user SET first_name = ?, last_name = ? WHERE email = ?",
      [first_name, last_name, userEmail]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });
    }

    res.json({
      success: true,
      status: 0,
      message: "Update Pofile berhasil",
      data: {
        email: userEmail,
        first_name: first_name,
        last_name: last_name,
        profile_image: userImage || null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateImage = async (req, res) => {
  try {
    const { email, first_name, last_name } = req.user;

    if (!email) {
      return res.status(400).json({
        status: 108,
        message: "Token tidak tidak valid atau kadaluwarsa",
        data: null,
      });
    }

    const file = req.file.filename;

    if (!file) {
      return res.status(400).json({
        status: 102,
        message: "File wajib diisi",
        data: null,
      });
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        status: 102,
        message: "Format Image tidak sesuai",
        data: null,
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/upload/${file}`;

    const [result] = await db.query(
      "UPDATE tb_user SET profile_image = ? WHERE email = ?",
      [file, email]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });
    }

    res.json({
      success: true,
      status: 0,
      message: "Update Profile Image berhasil",
      data: {
        email: email,
        first_name,
        last_name,
        profile_image: imageUrl || null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateImage,
};

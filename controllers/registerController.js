const db = require("../config/db");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;

  if (!email || !password || !first_name) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({status: 102, message: "Parameter email tidak sesuai format", data: null });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password minimal 8 karakter" });
  }

  try {
    const [existing] = await db.query("SELECT * FROM tb_user WHERE email = ?", [
      email,
    ]);

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO tb_user (email, first_name, last_name, password) VALUES (?, ?, ?, ?)",
      [email, first_name, last_name, hashedPassword]
    );

    res.status(201).json({
      success: true,
      status: 0,
      message: "Registrasi berhasil. Silakan login.",
      data: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};


module.exports = {
  register,
};

const db = require("../config/db");

const getAllBalances = async (req, res) => {
  const { email, balance } = req.user;

  if (!email) {
    return res.status(400).json({
      status: 108,
      message: "Token tidak tidak valid atau kadaluwarsa",
      data: null,
    });
  }

  try {
    const [balances] = await db.query("SELECT * FROM tb_user WHERE email = ?", [
      email,
    ]);

    if (balances.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.json({
      success: true,
      status: 0,
      message: "Get Balance Berhasil",
      data: {
        balance: balances[0].balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllBalances,
};

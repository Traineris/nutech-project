const db = require("../config/db");

function getFormattedDate() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const createTopUp = async (req, res) => {
  const { email } = req.user;
  const { top_up_amount } = req.body;

  if (!email) {
    return res.status(400).json({
      status: 108,
      message: "Token tidak tidak valid atau kadaluwarsa",
      data: null,
    });
  }

  if (!Number.isInteger(top_up_amount) || top_up_amount <= 0) {
    return res.status(400).json({
      status: 102,
      message:
        "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
      data: null,
    });
  }

  try {
    const [user] = await db.query("SELECT * FROM tb_user WHERE email = ?", [
      email,
    ]);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    await db.query("UPDATE tb_user SET balance = balance + ? WHERE email = ?", [
      top_up_amount,
      email,
    ]);

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const index = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const invoice_number = `INV${dateStr}-${index}`;
    const created_on = getFormattedDate();

    await db.query(
      `INSERT INTO tb_transaction 
      (invoice_number, transaction_type, total_amount, created_on) 
      VALUES (?, ?, ?, ?)`,
      [invoice_number, "TOPUP", top_up_amount, created_on]
    );

    res.json({
      success: true,
      status: 0,
      message: "Top Up Balance berhasil",
      data: {
        balance: top_up_amount,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createTopUp };

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

const createTransaksi = async (req, res) => {
  const { email } = req.user;
  const { service_code } = req.body;

  if (!email) {
    return res.status(400).json({
      status: 108,
      message: "Token tidak valid atau kadaluwarsa",
      data: null,
    });
  }

  if (!service_code) {
    return res.status(400).json({
      status: 102,
      message: "Service atau Layanan tidak ditemukan",
      data: null,
    });
  }

  try {
    const [users] = await db.query(
      "SELECT * FROM tb_user WHERE email = ?",
      [email]
    );
    const user = users[0];

    if (!user) {
      return res.status(404).json({
        status: 104,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    const userBalance = user.balance;

    const [services] = await db.query(
      "SELECT * FROM tb_service WHERE service_code = ?",
      [service_code]
    );

    if (services.length === 0) {
      return res.status(404).json({
        status: 103,
        message: "Service tidak ditemukan",
        data: null,
      });
    }

    const service = services[0];

    if (userBalance < service.service_tariff) {
      return res.status(400).json({
        status: 105,
        message: "Saldo tidak mencukupi untuk melakukan transaksi",
        data: null,
      });
    }

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const index = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const invoice_number = `INV${dateStr}-${index}`;
    const created_on = getFormattedDate();

    await db.query(
      `INSERT INTO tb_transaction 
      (invoice_number, service_code, service_name, transaction_type, total_amount, created_on) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        invoice_number,
        service_code,
        service.service_name,
        "PAYMENT",
        service.service_tariff,
        created_on,
      ]
    );

    await db.query("UPDATE tb_user SET balance = balance - ? WHERE email = ?", [
      service.service_tariff,
      email,
    ]);

    res.json({
      status: 0,
      message: "Transaksi berhasil",
      data: {
        invoice_number,
        service_code,
        service_name: service.service_name,
        transaction_type: "PAYMENT",
        total_amount: service.service_tariff,
        created_on,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
};

const getTransaksiHistory = async (req, res) => {
  const { email } = req.user;
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 3;

  if (!email) {
    return res.status(400).json({
      status: 108,
      message: "Token tidak valid atau kadaluwarsa",
      data: null,
    });
  }

  try {
    const [rows] = await db.query(
      `SELECT invoice_number, transaction_type, 
              CASE 
                WHEN transaction_type = 'TOPUP' THEN 'Top Up balance'
                ELSE service_name
              END AS description,
              total_amount,
              created_on
        FROM tb_transaction
        ORDER BY created_on DESC
        LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    res.json({
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset,
        limit,
        records: rows.map((row) => ({
          invoice_number: row.invoice_number,
          transaction_type: row.transaction_type,
          description: row.description,
          total_amount: row.total_amount,
          created_on: row.created_on,
        })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
};

module.exports = {
  createTransaksi,
  getTransaksiHistory,
};

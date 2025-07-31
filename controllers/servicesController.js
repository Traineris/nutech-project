const db = require("../config/db");


const getAllServices = async (req, res) => {
  try {
    const [services] = await db.query("SELECT * FROM tb_service ORDER BY id ASC");

    res.json({
      success: true,
      status: 0,
      message: "Sukses",
      data: services,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllServices,
};
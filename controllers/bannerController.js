const db = require("../config/db");


const getAllBanners = async (req, res) => {
  try {
    const [banners] = await db.query("SELECT * FROM tb_banner ORDER BY id ASC");

    res.json({
      success: true,
      status: 0,
      message: "Sukses",
      data: banners,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllBanners,
};
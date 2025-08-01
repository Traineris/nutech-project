const db = require("./db");

const init = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS tb_user (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        password VARCHAR(255),
        profile_image TEXT,
        balance INT DEFAULT 0
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS tb_banner (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        banner_name VARCHAR(255),
        banner_image TEXT,
        description TEXT
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS tb_service (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        service_code VARCHAR(255),
        service_name VARCHAR(255),
        service_icon TEXT,
        service_tariff INT
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS tb_transaction (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        invoice_number VARCHAR(255),
        service_code VARCHAR(255),
        service_name VARCHAR(255),
        transaction_type VARCHAR(255),
        total_amount INT,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Semua tabel berhasil dibuat atau sudah ada.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error saat inisialisasi database:", err.message);
    process.exit(1);
  }
};

init();

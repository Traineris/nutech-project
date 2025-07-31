CREATE TABLE `tb_user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile_image` text DEFAULT NULL,
  `balance` int(11) NOT NULL
);

CREATE TABLE `tb_banner` (
  `id` int(11) NOT NULL,
  `banner_name` varchar(255) DEFAULT NULL,
  `banner_image` text DEFAULT NULL,
  `description` text DEFAULT NULL
);

CREATE TABLE `tb_service` (
  `id` int(11) NOT NULL,
  `service_code` varchar(255) DEFAULT NULL,
  `service_name` varchar(255) DEFAULT NULL,
  `service_icon` text DEFAULT NULL,
  `service_tariff` int(11) NOT NULL
);

CREATE TABLE `tb_transaction` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(255) DEFAULT NULL,
  `service_code` varchar(255) DEFAULT NULL,
  `service_name` varchar(255) DEFAULT NULL,
  `transaction_type` varchar(255) DEFAULT NULL,
  `total_amount` int(11) NOT NULL,
  `created_on` timestamp NULL DEFAULT current_timestamp()
);
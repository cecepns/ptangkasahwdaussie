-- PT Angkasa HWD Aussie — CMS Database
-- Run: mysql -u root -p < sql/database.sql

CREATE DATABASE IF NOT EXISTS aussie_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aussie_cms;

-- ─── Admins ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT 'Administrator',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default admin is created automatically on first server startup
-- Credentials: username=admin, password=admin123 (change via .env)

-- ─── Site Settings (singleton) ────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  company_name VARCHAR(255) NOT NULL DEFAULT 'PT Angkasa HWD Aussie',
  short_name VARCHAR(255) NOT NULL DEFAULT 'Angkasa HWD Aussie',
  tagline TEXT,
  director VARCHAR(255),
  director_title VARCHAR(100) DEFAULT 'Direktur Utama',
  about TEXT,
  emails JSON,
  phones JSON,
  whatsapp JSON,
  address JSON,
  office_hours JSON,
  office_images JSON,
  seo_title VARCHAR(255),
  seo_description TEXT,
  hero_badge VARCHAR(255),
  hero_title VARCHAR(500),
  hero_subtitle TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO site_settings (
  id, company_name, short_name, tagline, director, director_title, about,
  emails, phones, whatsapp, address, office_hours, office_images,
  seo_title, seo_description, hero_badge, hero_title, hero_subtitle
) VALUES (
  1,
  'PT Angkasa HWD Aussie',
  'Angkasa HWD Aussie',
  'The Reliable Solution for your documents on your journey to AUSSIE',
  'Hery Wardanu',
  'Direktur Utama',
  'A genuine and sincere objective of Mr. Hery Wardanu in founding PT. Angkasa HWD Aussie is to provide and assist dedicated, hard-working, honest Indonesian workers in order to find better livelihood abroad, particularly in Australia.',
  '["ptangkasahwdaussie@gmail.com","angkasahwdaussie@gmail.com","hwdaussie@gmail.com"]',
  '[{"label":"Indonesia","number":"+62 823-1302-3434","href":"tel:+6282313023434"},{"label":"Australia","number":"+61 468 293 119","href":"tel:+61468293119"}]',
  '{"number":"6282313023434","href":"https://wa.me/6282313023434","defaultMessage":"Hello PT Angkasa HWD Aussie, I would like to inquire about your document services."}',
  '{"title":"Kantor Pusat","line1":"Gedung Veteran RI, Graha Purna Yudha, Lantai VI","line2":"Jalan Jenderal Sudirman Kav. 50, Karet Semanggi","line3":"RT. 1 / RW 4, Kecamatan Setia Budi","city":"Kota Jakarta Selatan, DKI Jakarta 12930","full":"Gedung Veteran RI, Graha Purna Yudha, Lantai VI, Jalan Jenderal Sudirman Kav. 50, Karet Semanggi, RT. 1 / RW 4, Kecamatan Setia Budi, Kota Jakarta Selatan, DKI Jakarta 12930","mapsUrl":"https://www.google.com/maps/search/Gedung+Veteran+RI+Graha+Purna+Yudha+Jakarta+Selatan","buildingTitle":"Gedung Graha Purna Yudha"}',
  '[{"days":"Monday – Friday","hours":"09:00 – 17:00 WIB"},{"days":"Saturday","hours":"09:00 – 13:00 WIB"}]',
  '[]',
  'PT Angkasa HWD Aussie — Document Services for Australia',
  'Complete document solutions for Indonesian workers journey to Australia. Visa, work permit, legalization, and consultation services.',
  'Trusted Document Solutions',
  'Your Journey to Australia Starts Here',
  NULL
) ON DUPLICATE KEY UPDATE id = id;

-- ─── Services ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(50) NOT NULL DEFAULT 'FileText',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO services (icon, title, description, sort_order) VALUES
('FileText', 'Document Processing', 'Complete assistance for all travel and work-related documents required for your journey to Australia.', 1),
('Plane', 'Visa & Work Permit', 'Guidance and support for visa applications, work permits, and immigration requirements.', 2),
('Stamp', 'Document Legalization', 'Official legalization and authentication of certificates, diplomas, and personal documents.', 3),
('Languages', 'Translation Services', 'Certified translation of documents between Indonesian and English for official submissions.', 4),
('Users', 'Worker Consultation', 'Personalized consultation for Indonesian workers seeking better opportunities in Australia.', 5),
('ShieldCheck', 'Compliance Support', 'Ensure all your documents meet Australian immigration and employer requirements.', 6);

-- ─── Hero Stats ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO stats (value, label, sort_order) VALUES
('100%', 'Dedicated Service', 1),
('AU', 'Australia Focus', 2),
('24/7', 'Support Ready', 3),
('Legal', 'Registered Company', 4);

-- ─── Content Items (values, quick links, bullets) ─────────
CREATE TABLE IF NOT EXISTS content_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_key VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  href VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_group_key (group_key)
);

INSERT INTO content_items (group_key, icon, title, description, href, sort_order) VALUES
('values', 'Heart', 'Genuine Care', 'We sincerely care about every worker''s journey and future abroad.', NULL, 1),
('values', 'Target', 'Clear Mission', 'Helping dedicated Indonesian workers find better livelihood in Australia.', NULL, 2),
('values', 'Globe', 'Australia Focus', 'Specialized expertise in Australian document and immigration requirements.', NULL, 3),
('values', 'User', 'Personal Approach', 'Founded by Mr. Hery Wardanu with a vision to serve honest, hardworking people.', NULL, 4),
('quick_links', 'Users', 'About Us', 'Learn about our mission and the people behind PT Angkasa HWD Aussie.', '/about', 1),
('quick_links', 'FileCheck', 'Our Services', 'Explore complete document solutions for your journey to Australia.', '/services', 2),
('quick_links', 'Shield', 'Legalitas', 'View our official business registration and company documents.', '/legalitas', 3),
('quick_links', 'Briefcase', 'Job Opportunities', 'Browse current job openings and requirements for working in Australia.', '/jobs', 4),
('service_bullets', NULL, 'Visa & work permit assistance', NULL, NULL, 1),
('service_bullets', NULL, 'Document legalization & translation', NULL, NULL, 2),
('service_bullets', NULL, 'Personalized worker consultation', NULL, NULL, 3);

-- ─── Page Sections ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(50) NOT NULL,
  section_key VARCHAR(50) NOT NULL,
  badge VARCHAR(255),
  title VARCHAR(500),
  subtitle TEXT,
  body TEXT,
  image_url VARCHAR(500),
  extra_data JSON,
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_page_section (page, section_key)
);

INSERT INTO page_sections (page, section_key, badge, title, subtitle, body) VALUES
('home', 'why_choose_us', 'Why Choose Us', 'Your Trusted Partner for Australian Documents', 'We specialize in helping Indonesian workers navigate the complex document requirements for working in Australia — with care, expertise, and transparency.', 'With years of dedication to serving hardworking Indonesian workers, we understand every step of the document process and guide you through it with confidence.'),
('home', 'explore', 'Explore', 'Everything You Need to Know', NULL, NULL),
('about', 'intro', 'About Us', 'Building Bridges to a Better Future', 'We are committed to helping Indonesian workers achieve their dreams of working abroad with complete, reliable document support.', NULL),
('about', 'values_header', 'Our Values', 'What We Stand For', 'Guided by sincerity and dedication to every worker we serve.', NULL),
('about', 'vision', 'Our Vision', NULL, NULL, NULL),
('services', 'intro', 'Our Services', 'Complete Document Solutions', 'From visa applications to document legalization, we provide end-to-end support for your journey to Australia.', NULL),
('services', 'grid_header', 'What We Offer', 'Services Tailored for You', 'Every service is designed to simplify your document journey to Australia.', NULL),
('services', 'cta', NULL, NULL, 'Need help with your documents? We are here to assist you every step of the way.', NULL),
('legalitas', 'header', 'Legalitas', 'Official Company Documents', 'PT Angkasa HWD Aussie is a legally registered company. View our official business registration documents below.', NULL),
('legalitas', 'trust_banner', NULL, NULL, 'All documents are official and issued by the relevant Indonesian government authorities.', NULL),
('jobs', 'header', 'Job Opportunities', 'Job Required — Work in Australia', 'Explore the latest job openings in Australia. Click any listing to view full details and apply through our team.', NULL),
('jobs', 'stats_banner', NULL, NULL, 'We connect dedicated Indonesian workers with trusted employers across Australia. Tap a card to view the full job posting.', NULL),
('jobs', 'cta', NULL, 'Interested in a Position?', 'Contact our team for application guidance, document preparation, and full support on your journey to working in Australia.', NULL),
('contact', 'intro', 'Contact Us', 'We Are Here to Help', 'Have questions about your documents? Reach out to us and our team will assist you promptly.', NULL),
('contact', 'office', 'Kantor Pusat', 'Gedung Graha Purna Yudha', NULL, NULL);

-- ─── Legal Documents ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS legal_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doc_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(500),
  file_type ENUM('pdf', 'image') DEFAULT 'pdf',
  sort_order INT DEFAULT 0,
  is_published TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO legal_documents (doc_type, title, description, file_url, file_type, sort_order) VALUES
('NIB', 'NIB PT. Angkasa HWD Aussie', 'Nomor Induk Berusaha (NIB) — legal business registration certificate.', NULL, 'pdf', 1),
('SK', 'SK PT Angkasa HWD Aussie', 'Surat Keputusan (SK) — official company establishment decree.', NULL, 'pdf', 2),
('NPWP', 'NPWP PT. Angkasa HWD Aussie', 'Nomor Pokok Wajib Pajak (NPWP) — official tax identification card.', NULL, 'image', 3);

-- ─── Job Listings ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) DEFAULT 'Australia',
  description TEXT,
  image_url VARCHAR(500),
  alt_text VARCHAR(255),
  status ENUM('active', 'closed') DEFAULT 'active',
  sort_order INT DEFAULT 0,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── Contact Submissions ──────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

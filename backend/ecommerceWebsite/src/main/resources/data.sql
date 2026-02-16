-- Clear existing data in the correct order (respecting foreign key constraints)
TRUNCATE TABLE order_items, orders, cart_items, cart_manager, products, customers CASCADE;

-- Reset the sequence for products to start from 1
ALTER SEQUENCE products_id_seq RESTART WITH 1;

-- Insert products with explicit IDs from 1 to 54
INSERT INTO products (id, name, description, price, image_url, stock, rating) VALUES
(1, 'Urban Backpack', 'Lightweight backpack with laptop sleeve and waterproof coating.', 1499.00, 'https://urbanwolfstore.com/cdn/shop/files/1_a29def20-6ba2-47f9-9343-c6e63a8bac4b.jpg?v=1692709067', 3, 4.5),
(2, 'Noise Canceling Headphones', 'Over-ear headphones with 40h battery life and deep bass.', 4999.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 0, 4.8),
(3, 'Classic Sneakers', 'Comfortable everyday sneakers with breathable mesh.', 2299.00, 'https://images.opumo.com/wordpress/wp-content/uploads/2022/07/opumo-banner-30.jpg', 5, 4.3),
(4, 'Smart Watch', 'Fitness tracking, heart rate monitor, and sleep analytics.', 6999.00, 'https://m.media-amazon.com/images/I/61ovuUb5dkL._AC_SX522_.jpg', 2, 4.7),
(5, 'Minimal Desk Lamp', 'Warm LED desk lamp with adjustable brightness.', 1199.00, 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4', 2, 4.4),
(6, 'Travel Mug', 'Insulated stainless steel mug keeps drinks hot for 6 hours.', 799.00, 'https://images.unsplash.com/photo-1517705008128-361805f42e86', 4, 4.6),
(7, 'Bluetooth Speaker', 'Portable speaker with punchy sound and IPX7 rating.', 2599.00, 'https://images.unsplash.com/photo-1512446816042-444d641267d4', 3, 4.5),
(8, 'Leather Wallet', 'Slim wallet with RFID protection and 6 card slots.', 999.00, 'https://m.media-amazon.com/images/I/91vfcmXEQLL._AC_SY300_SX300_QL70_FMwebp_.jpg', 6, 4.2),
(9, 'Sports Water Bottle', 'BPA-free bottle with leakproof lid.', 499.00, 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/055051/01/fnd/IND/fmt/png/Training-Sportstyle-Training-Spill-Proof-Waterbottle', 1, 4.4),
(10, 'Wireless Mouse', 'Ergonomic mouse with silent clicks.', 699.00, 'https://images.unsplash.com/photo-1527814050087-3793815479db', 7, 4.3),
(11, 'Mechanical Keyboard', 'RGB keyboard with tactile switches.', 3499.00, 'https://m.media-amazon.com/images/I/619FrkkxZ-L._AC_SX466_.jpg', 0, 4.9),
(12, 'Desk Organizer', 'Minimal organizer for pens and notes.', 549.00, 'https://m.media-amazon.com/images/I/71tPS1mVvtL._AC_SL1500_.jpg', 3, 4.1),
(13, 'Ceramic Planter', 'Handcrafted planter for indoor plants.', 799.00, 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6', 5, 4.6),
(14, 'Yoga Mat', 'Non-slip mat with extra cushioning.', 1299.00, 'https://images.unsplash.com/photo-1518611012118-696072aa579a', 5, 4.5),
(15, 'Fitness Bands', 'Resistance bands set for workouts.', 899.00, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', 2, 4.3),
(16, 'Running Cap', 'Lightweight cap with sweat-wicking fabric.', 499.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 4, 4.2),
(17, 'Cotton T-Shirt', 'Soft cotton tee with classic fit.', 599.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 6, 4.4),
(18, 'Denim Jacket', 'Vintage style denim jacket.', 2499.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 1, 4.7),
(19, 'Sunglasses', 'UV-protected polarized sunglasses.', 1199.00, 'https://images.unsplash.com/photo-1517841905240-472988babdf9', 0, 4.5),
(20, 'Classic Watch', 'Minimal analog watch with leather strap.', 1999.00, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d', 3, 4.6),
(21, 'Canvas Tote', 'Reusable tote with reinforced straps.', 699.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 7, 4.2),
(22, 'Leather Belt', 'Genuine leather belt with metal buckle.', 899.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 2, 4.4),
(23, 'Coffee Grinder', 'Stainless steel grinder with adjustable settings.', 1899.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93', 5, 4.8),
(24, 'Tea Kettle', 'Electric kettle with auto shut-off.', 2299.00, 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03', 6, 4.5),
(25, 'Nonstick Pan', 'Durable pan with heat-resistant handle.', 1599.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 4, 4.3),
(26, 'Chef Knife', 'High carbon steel kitchen knife.', 1799.00, 'https://images.unsplash.com/photo-1528712306091-ed0763094c98', 1, 4.7),
(27, 'Cutting Board', 'Bamboo cutting board with juice groove.', 699.00, 'https://images.unsplash.com/photo-1493770348161-369560ae357d', 6, 4.4),
(28, 'Bedside Alarm', 'LED alarm clock with snooze mode.', 1099.00, 'https://images.unsplash.com/photo-1505904267569-1c74e90f30ad', 0, 4.2),
(29, 'Throw Blanket', 'Cozy blanket for couch and bed.', 1499.00, 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4', 3, 4.6),
(30, 'Aroma Diffuser', 'Ultrasonic diffuser with ambient light.', 1799.00, 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6', 5, 4.5),
(31, 'Notebook Set', 'Pack of 3 dotted notebooks.', 499.00, 'https://images.unsplash.com/photo-1519681393784-d120267933ba', 7, 4.3),
(32, 'Gel Pens', 'Smooth writing gel pens set.', 299.00, 'https://images.unsplash.com/photo-1519681393784-d120267933ba', 2, 4.1),
(33, 'Bluetooth Earbuds', 'True wireless earbuds with charging case.', 3299.00, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f', 0, 4.8),
(34, 'Phone Tripod', 'Compact tripod with flexible legs.', 799.00, 'https://images.unsplash.com/photo-1518770660439-4636190af475', 4, 4.4),
(35, 'Portable Charger', '10000mAh power bank with fast charge.', 1599.00, 'https://images.unsplash.com/photo-1518770660439-4636190af475', 1, 4.6),
(36, 'Laptop Stand', 'Aluminum stand for better posture.', 1299.00, 'https://images.unsplash.com/photo-1518770660439-4636190af475', 6, 4.5),
(37, 'Desk Chair', 'Ergonomic chair with lumbar support.', 7499.00, 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4', 0, 4.9),
(38, 'Table Lamp', 'Modern lamp with fabric shade.', 1399.00, 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4', 3, 4.3),
(39, 'Floor Rug', 'Soft rug with geometric pattern.', 3499.00, 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4', 5, 4.6),
(40, 'Wall Clock', 'Silent wall clock with minimalist face.', 999.00, 'https://images.unsplash.com/photo-1505904267569-1c74e90f30ad', 2, 4.4),
(41, 'Picture Frame', 'Wooden frame for 8x10 photos.', 499.00, 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4', 7, 4.2),
(42, 'Cushion Set', 'Set of 2 decorative cushions.', 899.00, 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4', 0, 4.5),
(43, 'Scented Candle', 'Soy wax candle with lavender scent.', 599.00, 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6', 4, 4.3),
(44, 'Wireless Router', 'Dual band router for home wifi.', 2799.00, 'https://images.unsplash.com/photo-1518770660439-4636190af475', 1, 4.7),
(45, 'HDMI Cable', 'High speed HDMI cable 2m.', 299.00, 'https://images.unsplash.com/photo-1518770660439-4636190af475', 6, 4.0),
(46, 'Gaming Controller', 'Wireless controller with vibration.', 2499.00, 'https://images.unsplash.com/photo-1511512578047-dfb367046420', 0, 4.6),
(47, 'Smart Bulb', 'WiFi bulb with app control.', 899.00, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', 3, 4.4),
(48, 'USB Hub', '4-port USB 3.0 hub.', 699.00, 'https://images.unsplash.com/photo-1518770660439-4636190af475', 5, 4.2),
(49, 'Portable SSD', '500GB SSD with USB-C.', 5999.00, 'https://images.unsplash.com/photo-1518770660439-4636190af475', 2, 4.8),
(50, 'Camera Sling Bag', 'Compact bag with padded compartments.', 2199.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 7, 4.5),
(51, 'Fitness Tracker', 'Step tracking with heart rate monitor.', 2999.00, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 0, 4.6),
(52, 'Noise Isolation Earplugs', 'Reusable earplugs with case.', 399.00, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f', 4, 4.3),
(53, 'Travel Adapter', 'Universal adapter with USB ports.', 1299.00, 'https://images.unsplash.com/photo-1518770660439-4636190af475', 1, 4.5),
(54, 'Premium Pen', 'Metal body pen with smooth ink.', 599.00, 'https://images.unsplash.com/photo-1519681393784-d120267933ba', 6, 4.4)
ON CONFLICT (id) DO NOTHING;

-- Reset the products sequence to start from the next available ID
ALTER SEQUENCE products_id_seq RESTART WITH 55;

-- Reset customers sequence and insert sample customers with explicit IDs
ALTER SEQUENCE customers_id_seq RESTART WITH 1;

INSERT INTO customers (id, name, age, sex, date_of_birth, mobile, address, username, password, email) VALUES
(1, 'Rahul Sharma', 28, 'Male', '1998-03-15', '9876543210', '123 MG Road, Delhi, India', 'rahul_sharma', 'pass123', 'rahul.sharma@email.com'),
(2, 'Priya Patel', 25, 'Female', '2001-07-22', '8765432109', '456 Park Street, Mumbai, India', 'priya_p', 'priya@456', 'priya.patel@email.com'),
(3, 'Amit Kumar', 32, 'Male', '1994-11-10', '7654321098', '789 Brigade Road, Bangalore, India', 'amit_k', 'amit2024', 'amit.kumar@email.com'),
(4, 'Sneha Reddy', 24, 'Female', '2002-05-18', '6543210987', '321 Anna Salai, Chennai, India', 'sneha_reddy', 'sneha@789', 'sneha.reddy@email.com')
ON CONFLICT (id) DO NOTHING;

-- Reset customers sequence to start from the next available ID
ALTER SEQUENCE customers_id_seq RESTART WITH 5;

package org.example.ecommercewebsite.config;

import java.util.ArrayList;
import java.util.List;

import org.example.ecommercewebsite.entities.Product;
import org.example.ecommercewebsite.repositories.ProductRepo;
import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// @Component
public class DataSeeder implements CommandLineRunner {
    private final ProductRepo productRepo;

    public DataSeeder(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }

    @Override
    public void run(String... args) {
        if (productRepo.count() > 0) {
            return;
        }

        List<Product> products = new ArrayList<>();
        addProduct(products, "Urban Backpack", "Lightweight backpack with laptop sleeve and waterproof coating.", 1499.00,
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", 0);
        addProduct(products, "Noise Canceling Headphones", "Over-ear headphones with 40h battery life and deep bass.", 4999.00,
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", 40);
        addProduct(products, "Classic Sneakers", "Comfortable everyday sneakers with breathable mesh.", 2299.00,
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77", 80);
        addProduct(products, "Smart Watch", "Fitness tracking, heart rate monitor, and sleep analytics.", 6999.00,
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", 30);
        addProduct(products, "Minimal Desk Lamp", "Warm LED desk lamp with adjustable brightness.", 1199.00,
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4", 60);
        addProduct(products, "Travel Mug", "Insulated stainless steel mug keeps drinks hot for 6 hours.", 799.00,
            "https://images.unsplash.com/photo-1517705008128-361805f42e86", 100);
        addProduct(products, "Bluetooth Speaker", "Portable speaker with punchy sound and IPX7 rating.", 2599.00,
            "https://images.unsplash.com/photo-1512446816042-444d641267d4", 35);
        addProduct(products, "Leather Wallet", "Slim wallet with RFID protection and 6 card slots.", 999.00,
            "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb", 75);
        addProduct(products, "Sports Water Bottle", "BPA-free bottle with leakproof lid.", 499.00,
            "https://images.unsplash.com/photo-1526401485004-2aa7b1d276b4", 120);
        addProduct(products, "Wireless Mouse", "Ergonomic mouse with silent clicks.", 699.00,
            "https://images.unsplash.com/photo-1527814050087-3793815479db", 85);
        addProduct(products, "Mechanical Keyboard", "RGB keyboard with tactile switches.", 3499.00,
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8", 45);
        addProduct(products, "Desk Organizer", "Minimal organizer for pens and notes.", 549.00,
            "https://images.unsplash.com/photo-1519681393784-d120267933ba", 110);
        addProduct(products, "Ceramic Planter", "Handcrafted planter for indoor plants.", 799.00,
            "https://images.unsplash.com/photo-1501004318641-b39e6451bec6", 70);
        addProduct(products, "Yoga Mat", "Non-slip mat with extra cushioning.", 1299.00,
            "https://images.unsplash.com/photo-1518611012118-696072aa579a", 95);
        addProduct(products, "Fitness Bands", "Resistance bands set for workouts.", 899.00,
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438", 150);
        addProduct(products, "Running Cap", "Lightweight cap with sweat-wicking fabric.", 499.00,
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", 130);
        addProduct(products, "Cotton T-Shirt", "Soft cotton tee with classic fit.", 599.00,
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", 200);
        addProduct(products, "Denim Jacket", "Vintage style denim jacket.", 2499.00,
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", 40);
        addProduct(products, "Sunglasses", "UV-protected polarized sunglasses.", 1199.00,
            "https://images.unsplash.com/photo-1517841905240-472988babdf9", 90);
        addProduct(products, "Classic Watch", "Minimal analog watch with leather strap.", 1999.00,
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d", 65);
        addProduct(products, "Canvas Tote", "Reusable tote with reinforced straps.", 699.00,
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", 140);
        addProduct(products, "Leather Belt", "Genuine leather belt with metal buckle.", 899.00,
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", 80);
        addProduct(products, "Coffee Grinder", "Stainless steel grinder with adjustable settings.", 1899.00,
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93", 55);
        addProduct(products, "Tea Kettle", "Electric kettle with auto shut-off.", 2299.00,
            "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03", 45);
        addProduct(products, "Nonstick Pan", "Durable pan with heat-resistant handle.", 1599.00,
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836", 75);
        addProduct(products, "Chef Knife", "High carbon steel kitchen knife.", 1799.00,
            "https://images.unsplash.com/photo-1528712306091-ed0763094c98", 60);
        addProduct(products, "Cutting Board", "Bamboo cutting board with juice groove.", 699.00,
            "https://images.unsplash.com/photo-1493770348161-369560ae357d", 95);
        addProduct(products, "Bedside Alarm", "LED alarm clock with snooze mode.", 1099.00,
            "https://images.unsplash.com/photo-1505904267569-1c74e90f30ad", 70);
        addProduct(products, "Throw Blanket", "Cozy blanket for couch and bed.", 1499.00,
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4", 85);
        addProduct(products, "Aroma Diffuser", "Ultrasonic diffuser with ambient light.", 1799.00,
            "https://images.unsplash.com/photo-1501004318641-b39e6451bec6", 55);
        addProduct(products, "Notebook Set", "Pack of 3 dotted notebooks.", 499.00,
            "https://images.unsplash.com/photo-1519681393784-d120267933ba", 160);
        addProduct(products, "Gel Pens", "Smooth writing gel pens set.", 299.00,
            "https://images.unsplash.com/photo-1519681393784-d120267933ba", 180);
        addProduct(products, "Bluetooth Earbuds", "True wireless earbuds with charging case.", 3299.00,
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f", 50);
        addProduct(products, "Phone Tripod", "Compact tripod with flexible legs.", 799.00,
            "https://images.unsplash.com/photo-1518770660439-4636190af475", 90);
        addProduct(products, "Portable Charger", "10000mAh power bank with fast charge.", 1599.00,
            "https://images.unsplash.com/photo-1518770660439-4636190af475", 100);
        addProduct(products, "Laptop Stand", "Aluminum stand for better posture.", 1299.00,
            "https://images.unsplash.com/photo-1518770660439-4636190af475", 85);
        addProduct(products, "Desk Chair", "Ergonomic chair with lumbar support.", 7499.00,
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4", 25);
        addProduct(products, "Table Lamp", "Modern lamp with fabric shade.", 1399.00,
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4", 70);
        addProduct(products, "Floor Rug", "Soft rug with geometric pattern.", 3499.00,
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4", 30);
        addProduct(products, "Wall Clock", "Silent wall clock with minimalist face.", 999.00,
            "https://images.unsplash.com/photo-1505904267569-1c74e90f30ad", 65);
        addProduct(products, "Picture Frame", "Wooden frame for 8x10 photos.", 499.00,
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4", 120);
        addProduct(products, "Cushion Set", "Set of 2 decorative cushions.", 899.00,
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4", 90);
        addProduct(products, "Scented Candle", "Soy wax candle with lavender scent.", 599.00,
            "https://images.unsplash.com/photo-1501004318641-b39e6451bec6", 110);
        addProduct(products, "Wireless Router", "Dual band router for home wifi.", 2799.00,
            "https://images.unsplash.com/photo-1518770660439-4636190af475", 40);
        addProduct(products, "HDMI Cable", "High speed HDMI cable 2m.", 299.00,
            "https://images.unsplash.com/photo-1518770660439-4636190af475", 200);
        addProduct(products, "Gaming Controller", "Wireless controller with vibration.", 2499.00,
            "https://images.unsplash.com/photo-1511512578047-dfb367046420", 55);
        addProduct(products, "Smart Bulb", "WiFi bulb with app control.", 899.00,
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085", 130);
        addProduct(products, "USB Hub", "4-port USB 3.0 hub.", 699.00,
            "https://images.unsplash.com/photo-1518770660439-4636190af475", 140);
        addProduct(products, "Portable SSD", "500GB SSD with USB-C.", 5999.00,
            "https://images.unsplash.com/photo-1518770660439-4636190af475", 35);
        addProduct(products, "Camera Sling Bag", "Compact bag with padded compartments.", 2199.00,
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", 45);
        addProduct(products, "Fitness Tracker", "Step tracking with heart rate monitor.", 2999.00,
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", 60);
        addProduct(products, "Noise Isolation Earplugs", "Reusable earplugs with case.", 399.00,
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f", 150);
        addProduct(products, "Travel Adapter", "Universal adapter with USB ports.", 1299.00,
            "https://images.unsplash.com/photo-1518770660439-4636190af475", 90);
        addProduct(products, "Premium Pen", "Metal body pen with smooth ink.", 599.00,
            "https://images.unsplash.com/photo-1519681393784-d120267933ba", 170);

        productRepo.saveAll(products);
    }

    private void addProduct(
        List<Product> products,
        String name,
        String description,
        double price,
        String imageUrl,
        int stock
    ) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setImageUrl(imageUrl);
        product.setStock(stock);
        products.add(product);
    }
}

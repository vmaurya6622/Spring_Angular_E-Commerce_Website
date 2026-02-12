🧑 User
id
name
email
password
role (USER, ADMIN)

📦 Product
id
name
description
price
stock
imageUrl
category_id

🗂️ Category

id
name
🛒 Cart
id
user_id

🛍️ CartItem
id
cart_id
product_id
quantity
📑 Order
id
user_id
totalAmount
status
createdAt

📦 OrderItem

id
order_id
product_id
quantity
price
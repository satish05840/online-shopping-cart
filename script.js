
const products = [
    {
        id: 1,
        name: "iPhone 15",
        category: "Electronics",
        price: 59999,
        oldPrice: 69999,
        icon: "bi-phone",
        rating: 4.8
    },
    {
        id: 2,
        name: "MacBook Air",
        category: "Electronics",
        price: 89999,
        oldPrice: 99999,
        icon: "bi-laptop",
        rating: 4.9
    },
    {
        id: 3,
        name: "Smart Watch",
        category: "Accessories",
        price: 2999,
        oldPrice: 3999,
        icon: "bi-smartwatch",
        rating: 4.5
    },
    {
        id: 4,
        name: "Wireless Headphones",
        category: "Accessories",
        price: 2499,
        oldPrice: 3499,
        icon: "bi-headphones",
        rating: 4.6
    },
    {
        id: 5,
        name: "Premium T-Shirt",
        category: "Fashion",
        price: 999,
        oldPrice: 1499,
        icon: "bi-person",
        rating: 4.4
    },
    {
        id: 6,
        name: "Designer Dress",
        category: "Fashion",
        price: 2499,
        oldPrice: 3999,
        icon: "bi-person-standing-dress",
        rating: 4.7
    },
    {
        id: 7,
        name: "Running Shoes",
        category: "Shoes",
        price: 2999,
        oldPrice: 4499,
        icon: "bi-bootstrap",
        rating: 4.8
    },
    {
        id: 8,
        name: "Sports Shoes",
        category: "Shoes",
        price: 3599,
        oldPrice: 4999,
        icon: "bi-bootstrap",
        rating: 4.6
    }
];

let cart = [];
let selectedCategory = "All";
let discountRate = 0;


function showProducts(list = products) {

    const container = document.getElementById("productContainer");

    container.innerHTML = "";

    list.forEach(product => {

        container.innerHTML += `

        <div class="col-sm-6 col-lg-3">

            <div class="product-card">

                <div class="product-image">

                    <span class="sale-badge">
                        SALE
                    </span>

                    <button class="wishlist"
                            onclick="addWishlist(this)">
                        <i class="bi bi-heart"></i>
                    </button>

                    <i class="bi ${product.icon}"></i>

                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h5>${product.name}</h5>

                    <div class="rating">

                        ${getStars(product.rating)}

                        <span>
                            ${product.rating}
                        </span>

                    </div>

                    <div class="product-price">

                        ₹${product.price.toLocaleString("en-IN")}

                        <span class="old-price">
                            ₹${product.oldPrice.toLocaleString("en-IN")}
                        </span>

                    </div>

                    <button class="add-cart"
                            onclick="addToCart(${product.id})">

                        <i class="bi bi-cart-plus"></i>
                        Add to Cart

                    </button>

                </div>

            </div>

        </div>
        `;
    });
}


function getStars(rating) {

    return `
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-half"></i>
    `;
}


function addToCart(id) {

    const product = products.find(p => p.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();

    showToast(product.name + " added to cart");
}


function updateCart() {

    const container = document.getElementById("cartItems");

    container.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="text-center py-5">

                <i class="bi bi-cart-x"
                   style="font-size:60px;color:#aaa"></i>

                <h5 class="mt-3">
                    Your cart is empty
                </h5>

                <p class="text-muted">
                    Add some products to continue.
                </p>

            </div>
        `;

    } else {

        cart.forEach(item => {

            container.innerHTML += `

            <div class="cart-item">

                <div class="cart-item-icon">
                    <i class="bi ${item.icon}"></i>
                </div>

                <div class="cart-item-info">

                    <h6>${item.name}</h6>

                    <div class="cart-price">
                        ₹${item.price.toLocaleString("en-IN")}
                    </div>

                    <div class="qty-control">

                        <button onclick="changeQuantity(${item.id},-1)">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${item.id},1)">
                            +
                        </button>

                        <button class="remove-btn"
                                onclick="removeItem(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>

                    </div>

                </div>

            </div>
            `;
        });
    }

    calculateBill();

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.getElementById("cartCount").innerText = count;
}


function changeQuantity(id, change) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    updateCart();
}


function removeItem(id) {

    cart = cart.filter(item => item.id !== id);

    updateCart();

    showToast("Product removed from cart");
}


function calculateBill() {

    const subtotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    const discount = subtotal * discountRate;

    const taxable = subtotal - discount;

    const gst = taxable * 0.18;

    const delivery = taxable >= 999 || taxable === 0
        ? 0
        : 99;

    const total = taxable + gst + delivery;

    document.getElementById("subtotal").innerText =
        subtotal.toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });

    document.getElementById("discount").innerText =
        discount.toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });

    document.getElementById("gst").innerText =
        gst.toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });

    document.getElementById("delivery").innerText =
        delivery === 0
            ? "FREE"
            : "₹" + delivery;

    document.getElementById("grandTotal").innerText =
        total.toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });
}


function applyCoupon() {

    const code =
        document.getElementById("coupon")
        .value
        .trim()
        .toUpperCase();

    if (code === "SAVE30") {

        discountRate = 0.30;

        showToast("30% discount applied!");

    } else if (code === "SAVE10") {

        discountRate = 0.10;

        showToast("10% discount applied!");

    } else {

        discountRate = 0;

        showToast("Invalid coupon code");

    }

    calculateBill();
}


function openCart() {

    document
        .getElementById("cartDrawer")
        .classList.add("show");

    document
        .getElementById("cartOverlay")
        .classList.add("show");
}


function closeCart() {

    document
        .getElementById("cartDrawer")
        .classList.remove("show");

    document
        .getElementById("cartOverlay")
        .classList.remove("show");
}


function openCheckout() {

    if (cart.length === 0) {

        showToast("Your cart is empty");

        return;
    }

    closeCart();

    const modal =
        new bootstrap.Modal(
            document.getElementById("checkoutModal")
        );

    modal.show();
}


function placeOrder() {

    const form =
        document.getElementById("checkoutForm");

    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }

    const name =
        document.getElementById("customerName").value;

    const mobile =
        document.getElementById("mobile").value;

    const email =
        document.getElementById("email").value;

    const address =
        document.getElementById("address").value;

    const city =
        document.getElementById("city").value;

    const pincode =
        document.getElementById("pincode").value;

    const payment =
        document.getElementById("payment").value;

    const subtotal =
        cart.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );

    const discount =
        subtotal * discountRate;

    const taxable =
        subtotal - discount;

    const gst =
        taxable * 0.18;

    const delivery =
        taxable >= 999 || taxable === 0
            ? 0
            : 99;

    const grandTotal =
        taxable + gst + delivery;

    const invoiceNo =
        "SE-" + Date.now();

    const date =
        new Date().toLocaleString("en-IN");

    let rows = "";

    cart.forEach(item => {

        rows += `
            <tr>

                <td>
                    ${item.name}
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ₹${item.price.toLocaleString("en-IN")}
                </td>

                <td>
                    ₹${(
                        item.price *
                        item.quantity
                    ).toLocaleString("en-IN")}
                </td>

            </tr>
        `;
    });

    document.getElementById("invoiceContent").innerHTML = `

        <div class="invoice">

            <div class="invoice-header">

                <div>

                    <div class="invoice-logo">
                        <i class="bi bi-bag-heart-fill"></i>
                        ShopEase
                    </div>

                    <p>
                        Online Shopping & Billing System
                    </p>

                </div>

                <div class="text-end">

                    <h5>INVOICE</h5>

                    <p>
                        <strong>Invoice:</strong>
                        ${invoiceNo}
                        <br>

                        <strong>Date:</strong>
                        ${date}
                    </p>

                </div>

            </div>

            <hr>

            <div class="row mt-4">

                <div class="col-md-6">

                    <h6>Bill To</h6>

                    <p>
                        <strong>${name}</strong><br>
                        ${mobile}<br>
                        ${email}
                    </p>

                </div>

                <div class="col-md-6">

                    <h6>Delivery Address</h6>

                    <p>
                        ${address}<br>
                        ${city} - ${pincode}
                    </p>

                </div>

            </div>

            <table class="table table-bordered invoice-table">

                <thead>

                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>

                </thead>

                <tbody>
                    ${rows}
                </tbody>

            </table>

            <div class="row justify-content-end mt-4">

                <div class="col-md-5">

                    <div class="bill-row">
                        <span>Subtotal</span>
                        <strong>
                            ₹${subtotal.toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div class="bill-row">
                        <span>Discount</span>
                        <strong>
                            ₹${discount.toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div class="bill-row">
                        <span>GST 18%</span>
                        <strong>
                            ₹${gst.toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div class="bill-row">
                        <span>Delivery</span>
                        <strong>
                            ${delivery === 0 ? "FREE" : "₹" + delivery}
                        </strong>
                    </div>

                    <hr>

                    <div class="total-row">

                        <span>Grand Total</span>

                        <strong>
                            ₹${grandTotal.toLocaleString("en-IN")}
                        </strong>

                    </div>

                    <p class="mt-3">
                        <strong>Payment:</strong>
                        ${payment}
                    </p>

                </div>

            </div>

            <hr>

            <div class="text-center mt-4">

                <h5>Thank You For Shopping With Us! ❤️</h5>

                <p>
                    Your order has been successfully placed.
                </p>

            </div>

        </div>
    `;

    const checkout =
        bootstrap.Modal.getInstance(
            document.getElementById("checkoutModal")
        );

    if (checkout) {
        checkout.hide();
    }

    const invoice =
        new bootstrap.Modal(
            document.getElementById("invoiceModal")
        );

    invoice.show();

    cart = [];

    discountRate = 0;

    updateCart();

    form.reset();
}


function filterProducts() {

    const search =
        document.getElementById("searchBox")
        .value
        .toLowerCase();

    const filtered =
        products.filter(product => {

            const categoryMatch =
                selectedCategory === "All" ||
                product.category === selectedCategory;

            const searchMatch =
                product.name
                    .toLowerCase()
                    .includes(search);

            return categoryMatch && searchMatch;
        });

    showProducts(filtered);
}


function setCategory(category, button) {

    selectedCategory = category;

    document
        .querySelectorAll(".filter-btn")
        .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    filterProducts();
}


function filterCategory(category) {

    selectedCategory = category;

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });

    filterProducts();
}


function addWishlist(button) {

    const icon =
        button.querySelector("i");

    icon.classList.toggle("bi-heart");

    icon.classList.toggle("bi-heart-fill");

    icon.style.color = "#ef4f91";

    showToast("Wishlist updated");
}


function copyCoupon() {

    navigator.clipboard.writeText("SAVE30");

    showToast("Coupon SAVE30 copied!");
}


function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


function toggleDarkMode() {

    document
        .body
        .classList
        .toggle("dark-mode");

    const icon =
        document.querySelector(
            ".icon-btn i"
        );

    if (
        document.body.classList.contains(
            "dark-mode"
        )
    ) {

        icon.className =
            "bi bi-sun";

    } else {

        icon.className =
            "bi bi-moon-stars";
    }
}


showProducts();

updateCart();

// Persist cart items in localStorage so cart.html can read them
document.addEventListener('DOMContentLoaded', () => {
  // Update cart count in navbar on every page load
  updateCartCount();

  // If we're on index.html, hook up "Add to Cart" buttons
  const addButtons = document.querySelectorAll('.add-to-cart');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      addToCart({ name, price });
      updateCartCount();
      alert(`${name} added to cart.`);
    });
  });

  // If we're on cart.html, render the cart table
  if (window.location.pathname.includes('cart.html')) {
    renderCartTable();
    // Hook up clear/checkout buttons
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    document.getElementById('checkout-btn').addEventListener('click', () => {
      alert('Redirecting to checkout (not implemented).');
    });
  }
});

// Add an item (object with name & price) to localStorage cart array
function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Update the number in “Cart (X)” in the navbar
function updateCartCount() {
  const countSpans = document.querySelectorAll('#cart-count, #cart-count-2');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  countSpans.forEach(span => {
    span.textContent = cart.length;
  });
}

// Render the cart contents on cart.html
function renderCartTable() {
  const cartTableBody = document.getElementById('cart-items');
  const totalCell = document.getElementById('cart-total');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartTableBody.innerHTML = '';

  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td><button class="remove-btn" data-index="${idx}">Remove</button></td>
    `;
    cartTableBody.appendChild(tr);
  });

  totalCell.textContent = '$' + total.toFixed(2);

  // Hook up remove buttons
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCartTable();
      updateCartCount();
    });
  });
}

// Clear entire cart
function clearCart() {
  if (confirm('Clear all items from cart?')) {
    localStorage.removeItem('cart');
    renderCartTable();
    updateCartCount();
  }
}

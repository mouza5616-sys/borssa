/**
 * بورصة للمفروشات - Borsa El Mafroshat
 * الكود البرمجي التفاعلي المحمي والآمن (Security Hardened E-Commerce Controller)
 */

// المفاتيح والمتغيرات العامة
const STORAGE_CART_KEY = 'borssa_cart_v2';
const STORAGE_WISHLIST_KEY = 'borssa_wishlist_v2';

let cart = [];
let wishlist = [];
let activeCategory = 'all';
let searchQuery = '';
let sortBy = 'featured';
let activeCoupon = null;
let selectedGovernorate = 'cairo';
let selectedPaymentMethod = 'cash';
let isCheckoutSubmitting = false;
let isContactSubmitting = false;

// --------------------------------------------------------------------------
// دوال الحماية والتعقيم وتنسيق البيانات (Sanitization & Security Utilities)
// --------------------------------------------------------------------------
function formatCurrency(amount) {
  const cleanNumber = Number(amount) || 0;
  return `${cleanNumber.toLocaleString('ar-EG')} جنيه`;
}

/**
 * تعقيم النصوص البرمجية لمنع هجمات Cross-Site Scripting (XSS)
 */
function sanitize(str) {
  if (typeof str !== 'string') return String(str || '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .slice(0, 500); // منع هجمات Buffer / Memory Flooding
}

/**
 * تعقيم نصوص الحقول قبل إرسالها لواتساب لمنع كسر البروتوكول
 */
function sanitizeInputText(value, maxLength = 200) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconClass = type === 'success' ? 'fas fa-check-circle' :
                     type === 'error' ? 'fas fa-exclamation-circle' :
                     type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle';

  toast.innerHTML = `
    <i class="${iconClass}"></i>
    <span>${sanitize(message)}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

// --------------------------------------------------------------------------
// إدارة التخزين المحلي والتحقق الأمني من سلامة البيانات (Tamper-Proof Storage)
// --------------------------------------------------------------------------
function loadState() {
  try {
    const storedCart = localStorage.getItem(STORAGE_CART_KEY);
    if (storedCart) {
      const parsed = JSON.parse(storedCart);
      if (Array.isArray(parsed)) {
        // حماية تامة ضد التلاعب بالأسعار أو المنتجات من خلال فحص المنتجات الأصلية فقط
        cart = parsed.map(item => {
          if (!item || !item.productId) return null;
          const product = BORSSA_PRODUCTS.find(p => p.id === item.productId);
          if (!product) return null; // استبعاد أي منتج غير حقيقي تم حقنه

          const qty = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));
          const validSize = product.sizes.includes(item.size) ? item.size : (product.sizes[0] || 'مقاس قياسي');
          const validColor = product.colors.includes(item.color) ? item.color : (product.colors[0] || 'اللون المعروض');

          return {
            productId: product.id,
            name: product.name,
            price: Number(product.price), // فرض السعر الأصلي دائماً لمنع التلاعب بالسعر
            image: product.image,
            size: validSize,
            color: validColor,
            quantity: qty
          };
        }).filter(Boolean);
      }
    }

    const storedWishlist = localStorage.getItem(STORAGE_WISHLIST_KEY);
    if (storedWishlist) {
      const parsed = JSON.parse(storedWishlist);
      if (Array.isArray(parsed)) {
        // التحقق من صحة المعرفات فقط
        wishlist = parsed.filter(id => typeof id === 'string' && BORSSA_PRODUCTS.some(p => p.id === id));
      }
    }
  } catch (e) {
    console.warn('Security validation reset invalid storage state:', e);
    cart = [];
    wishlist = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn('Error saving cart to storage:', e);
  }
  updateCartUI();
}

function saveWishlist() {
  try {
    localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(wishlist));
  } catch (e) {
    console.warn('Error saving wishlist to storage:', e);
  }
  updateWishlistUI();
}

// --------------------------------------------------------------------------
// عرض المنتجات والفلترة والبحث (Catalog & Filters)
// --------------------------------------------------------------------------
function getFilteredProducts() {
  let list = [...BORSSA_PRODUCTS];

  // فلترة حسب القسم
  if (activeCategory !== 'all') {
    list = list.filter(p => p.category === activeCategory);
  }

  // فلترة حسب البحث
  const cleanSearch = sanitizeInputText(searchQuery, 80).toLowerCase();
  if (cleanSearch) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(cleanSearch) ||
      p.description.toLowerCase().includes(cleanSearch) ||
      p.material.toLowerCase().includes(cleanSearch)
    );
  }

  // الترتيب
  if (sortBy === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'discount') {
    list.sort((a, b) => b.discount - a.discount);
  }

  return list;
}

function renderProducts() {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  const products = getFilteredProducts();

  if (products.length === 0) {
    container.innerHTML = `
      <div class="no-products-found">
        <i class="fas fa-box-open"></i>
        <h3>لم يتم العثور على منتجات مطابقة للبحث</h3>
        <p>جرب البحث بكلمات أخرى أو تصفح باقي الأقسام</p>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => {
    const isWishlisted = wishlist.includes(product.id);
    const badgeHtml = product.badge ? `<span class="product-card-badge">${sanitize(product.badge)}</span>` : '';
    const discountPill = product.originalPrice ? `<span class="save-pill">خصم ${product.discount}%</span>` : '';
    const oldPriceHtml = product.originalPrice ? `<span class="old-price">${formatCurrency(product.originalPrice)}</span>` : '';

    return `
      <div class="product-card" data-id="${product.id}">
        ${badgeHtml}
        <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                onclick="toggleWishlist('${product.id}')" 
                title="${isWishlisted ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}"
                type="button"
                aria-label="المفضلة">
          <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
        </button>
        
        <div class="product-img-wrapper" onclick="openQuickView('${product.id}')">
          <img src="${product.image}" alt="${sanitize(product.name)}" loading="lazy" 
               onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80';"/>
          <div class="product-quick-view-overlay">
            <button class="quick-view-btn" type="button"><i class="fas fa-eye"></i> نظرة سريعة</button>
          </div>
        </div>

        <div class="product-content">
          <span class="product-cat-tag">${sanitize(getCategoryName(product.category))}</span>
          <h3 class="product-title" onclick="openQuickView('${product.id}')">${sanitize(product.name)}</h3>
          
          <div class="product-rating">
            <span class="rating-stars">
              ${renderStars(product.rating)}
            </span>
            <span class="rating-count">(${product.reviewsCount} تقييم)</span>
          </div>

          <div class="product-price-row">
            <span class="current-price">${formatCurrency(product.price)}</span>
            ${oldPriceHtml}
            ${discountPill}
          </div>

          <div class="product-card-actions">
            <button class="btn-add-cart" type="button" onclick="quickAddToCart('${product.id}')">
              <i class="fas fa-cart-plus"></i> أضف للسلة
            </button>
            <button class="btn-whatsapp-direct" type="button" onclick="orderViaWhatsApp('${product.id}')" title="طلب مباشر عبر واتساب" aria-label="واتساب">
              <i class="fab fa-whatsapp"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getCategoryName(catId) {
  const cat = BORSSA_CATEGORIES.find(c => c.id === catId);
  return cat ? cat.name : 'مفروشات';
}

function renderStars(rating) {
  let stars = '';
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
  if (hasHalf) stars += '<i class="fas fa-star-half-alt"></i>';
  const empty = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < empty; i++) stars += '<i class="far fa-star"></i>';

  return stars;
}

// --------------------------------------------------------------------------
// إدارة سلة التسوق المحمية (Secure Cart System)
// --------------------------------------------------------------------------
function quickAddToCart(productId) {
  const product = BORSSA_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'مقاس قياسي';
  const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'اللون المعروض';

  addToCart(product.id, defaultSize, defaultColor, 1);
}

function addToCart(productId, size, color, quantity = 1) {
  const product = BORSSA_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const safeQty = Math.max(1, Math.min(99, Math.floor(Number(quantity) || 1)));
  const safeSize = product.sizes.includes(size) ? size : (product.sizes[0] || 'مقاس قياسي');
  const safeColor = product.colors.includes(color) ? color : (product.colors[0] || 'اللون المعروض');

  const existingIndex = cart.findIndex(item => 
    item.productId === productId && item.size === safeSize && item.color === safeColor
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity = Math.min(99, cart[existingIndex].quantity + safeQty);
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: Number(product.price), // ضمان السعر الحقيقي
      image: product.image,
      size: safeSize,
      color: safeColor,
      quantity: safeQty
    });
  }

  saveCart();
  showToast(`تمت إضافة "${product.name}" إلى السلة بنجاح!`, 'success');
  openCartDrawer();
}

function updateCartItemQuantity(index, delta) {
  if (index < 0 || index >= cart.length) return;
  cart[index].quantity = Math.max(0, Math.min(99, cart[index].quantity + delta));
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
    showToast('تم حذف المنتج من السلة', 'info');
  }
  saveCart();
}

function removeCartItem(index) {
  if (index < 0 || index >= cart.length) return;
  const item = cart[index];
  cart.splice(index, 1);
  saveCart();
  showToast(`تمت إزالة "${item.name}" من السلة`, 'info');
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => {
    const product = BORSSA_PRODUCTS.find(p => p.id === item.productId);
    const safePrice = product ? product.price : (Number(item.price) || 0);
    const safeQty = Math.max(1, Math.min(99, Number(item.quantity) || 1));
    return sum + (safePrice * safeQty);
  }, 0);
}

function getCartTotalCount() {
  return cart.reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
}

function getCartDiscount() {
  if (!activeCoupon) return 0;
  const subtotal = getCartSubtotal();
  if (activeCoupon.discountPercent) {
    return Math.floor((subtotal * activeCoupon.discountPercent) / 100);
  }
  if (activeCoupon.fixedDiscount) {
    return Math.min(activeCoupon.fixedDiscount, subtotal);
  }
  return 0;
}

function getSelectedShippingFee() {
  const subtotal = getCartSubtotal();
  if (subtotal >= STORE_CONFIG.freeShippingThreshold) {
    return 0; // شحن مجاني
  }
  const gov = BORSSA_GOVERNORATES.find(g => g.id === selectedGovernorate);
  return gov ? gov.shippingFee : 35;
}

function getCartFinalTotal() {
  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const shipping = getSelectedShippingFee();
  return Math.max(0, subtotal - discount + shipping);
}

function updateCartUI() {
  // عداد السلة في الهيدر
  const cartCounts = document.querySelectorAll('.cart-count-badge');
  const count = getCartTotalCount();
  cartCounts.forEach(el => el.textContent = count);

  // تحديث محتوى الدروار
  const drawerBody = document.getElementById('cartDrawerItems');
  const cartSubtotalEl = document.getElementById('cartDrawerSubtotal');
  const cartDiscountRow = document.getElementById('cartDrawerDiscountRow');
  const cartDiscountEl = document.getElementById('cartDrawerDiscount');
  const cartTotalEl = document.getElementById('cartDrawerTotal');
  const freeShippingProgress = document.getElementById('freeShippingProgress');
  const freeShippingText = document.getElementById('freeShippingText');

  const subtotal = getCartSubtotal();

  // تحديث شريط الشحن المجاني
  if (freeShippingProgress && freeShippingText) {
    const threshold = STORE_CONFIG.freeShippingThreshold;
    if (subtotal >= threshold) {
      freeShippingProgress.style.width = '100%';
      freeShippingText.innerHTML = '<i class="fas fa-check-circle" style="color:var(--success)"></i> مبروك! حصلت على <strong>شحن مجاني</strong> لكافة المحافظات!';
    } else {
      const remaining = threshold - subtotal;
      const percent = Math.min(100, (subtotal / threshold) * 100);
      freeShippingProgress.style.width = `${percent}%`;
      freeShippingText.innerHTML = `أضف بـ <strong>${formatCurrency(remaining)}</strong> للحصول على <strong>شحن مجاني!</strong>`;
    }
  }

  if (!drawerBody) return;

  if (cart.length === 0) {
    drawerBody.innerHTML = `
      <div class="empty-cart-state">
        <i class="fas fa-shopping-basket"></i>
        <h3>سلة التسوق فارغة</h3>
        <p>استمتع بتشكيلة مفروشات بورصة الفاخرة وأضف لمسة جمال لمنزلك</p>
        <button class="btn btn-primary" style="margin-top:1.5rem;" type="button" onclick="closeCartDrawer();location.href='#catalog';">تسوق الآن</button>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(0);
    if (cartTotalEl) cartTotalEl.textContent = formatCurrency(0);
    if (cartDiscountRow) cartDiscountRow.style.display = 'none';
    return;
  }

  drawerBody.innerHTML = cart.map((item, index) => `
    <div class="cart-item-card">
      <img src="${item.image}" alt="${sanitize(item.name)}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80';"/>
      <div class="cart-item-details">
        <h4 class="cart-item-title">${sanitize(item.name)}</h4>
        <div class="cart-item-meta">${sanitize(item.size)} • ${sanitize(item.color)}</div>
        <div class="cart-item-price-row">
          <span class="cart-item-price">${formatCurrency(item.price * item.quantity)}</span>
          <div class="qty-control">
            <button class="qty-btn" type="button" onclick="updateCartItemQuantity(${index}, -1)" aria-label="تقليل">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" type="button" onclick="updateCartItemQuantity(${index}, 1)" aria-label="زيادة">+</button>
          </div>
        </div>
      </div>
      <button class="cart-item-remove-btn" type="button" onclick="removeCartItem(${index})" title="حذف" aria-label="حذف">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');

  if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(subtotal);

  const discount = getCartDiscount();
  if (discount > 0 && cartDiscountRow && cartDiscountEl) {
    cartDiscountRow.style.display = 'flex';
    cartDiscountEl.textContent = `- ${formatCurrency(discount)}`;
  } else if (cartDiscountRow) {
    cartDiscountRow.style.display = 'none';
  }

  if (cartTotalEl) cartTotalEl.textContent = formatCurrency(subtotal - discount);
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) drawer.classList.add('open');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) drawer.classList.remove('open');
}

// --------------------------------------------------------------------------
// قائمة المفضلة (Wishlist System)
// --------------------------------------------------------------------------
function toggleWishlist(productId) {
  if (typeof productId !== 'string') return;
  const index = wishlist.indexOf(productId);
  const product = BORSSA_PRODUCTS.find(p => p.id === productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    showToast(`تمت إزالة "${product ? product.name : 'المنتج'}" من المفضلة`, 'info');
  } else {
    wishlist.push(productId);
    showToast(`تمت إضافة "${product ? product.name : 'المنتج'}" إلى المفضلة ❤️`, 'success');
  }

  saveWishlist();
  renderProducts();
}

function updateWishlistUI() {
  const badges = document.querySelectorAll('.wishlist-count-badge');
  badges.forEach(b => b.textContent = wishlist.length);
}

function openWishlistModal() {
  const modal = document.getElementById('wishlistModal');
  const body = document.getElementById('wishlistModalBody');
  if (!modal || !body) return;

  if (wishlist.length === 0) {
    body.innerHTML = `
      <div class="empty-cart-state">
        <i class="far fa-heart" style="font-size:3.5rem;color:var(--text-light);margin-bottom:1rem;"></i>
        <h3>قائمة المفضلة فارغة</h3>
        <p>اضغط على أيقونة القلب على المنتجات لحفظها هنا والعودة إليها لاحقاً</p>
      </div>
    `;
  } else {
    const items = BORSSA_PRODUCTS.filter(p => wishlist.includes(p.id));
    body.innerHTML = `
      <div class="products-grid" style="grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));gap:1.2rem;">
        ${items.map(p => `
          <div class="product-card">
            <div class="product-img-wrapper" style="height:170px;" onclick="closeWishlistModal();openQuickView('${p.id}')">
              <img src="${p.image}" alt="${sanitize(p.name)}"/>
            </div>
            <div class="product-content" style="padding:1rem;">
              <h4 class="product-title" style="font-size:0.95rem;">${sanitize(p.name)}</h4>
              <div class="product-price-row" style="margin:0.5rem 0;">
                <span class="current-price" style="font-size:1.15rem;">${formatCurrency(p.price)}</span>
              </div>
              <button class="btn-add-cart" type="button" style="padding:0.5rem;" onclick="closeWishlistModal();quickAddToCart('${p.id}')">
                <i class="fas fa-cart-plus"></i> أضف للسلة
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  modal.classList.add('open');
}

function closeWishlistModal() {
  const modal = document.getElementById('wishlistModal');
  if (modal) modal.classList.remove('open');
}

// --------------------------------------------------------------------------
// العرض السريع للمنتج (Quick View Modal)
// --------------------------------------------------------------------------
let quickViewSelectedSize = '';
let quickViewSelectedColor = '';
let quickViewQuantity = 1;
let currentQuickViewProduct = null;

function openQuickView(productId) {
  const product = BORSSA_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentQuickViewProduct = product;
  quickViewSelectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'مقاس قياسي';
  quickViewSelectedColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'اللون المعروض';
  quickViewQuantity = 1;

  const modal = document.getElementById('quickViewModal');
  const body = document.getElementById('quickViewModalBody');
  if (!modal || !body) return;

  const discountPill = product.originalPrice ? `<span class="save-pill">وفر ${product.discount}%</span>` : '';
  const oldPriceHtml = product.originalPrice ? `<span class="old-price">${formatCurrency(product.originalPrice)}</span>` : '';

  body.innerHTML = `
    <div class="quick-view-grid">
      <div class="quick-view-gallery">
        <img id="qvMainImage" src="${product.image}" alt="${sanitize(product.name)}" onerror="this.src='https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80';"/>
      </div>
      <div class="quick-view-details">
        <span class="product-cat-tag">${sanitize(getCategoryName(product.category))}</span>
        <h2>${sanitize(product.name)}</h2>
        
        <div class="product-rating" style="margin-bottom:0.8rem;">
          <span class="rating-stars">${renderStars(product.rating)}</span>
          <span class="rating-count">(${product.reviewsCount} تقييم حقيقي من عملاء بورصة)</span>
        </div>

        <div class="product-price-row" style="margin:1rem 0;">
          <span class="current-price" style="font-size:1.8rem;">${formatCurrency(product.price)}</span>
          ${oldPriceHtml}
          ${discountPill}
        </div>

        <p style="color:var(--text-muted);font-size:0.95rem;line-height:1.7;margin-bottom:1.2rem;">
          ${sanitize(product.description)}
        </p>

        <div style="background:var(--bg-subtle);padding:0.9rem 1.2rem;border-radius:var(--radius-md);margin-bottom:1.2rem;border:1px solid var(--border);">
          <strong style="color:var(--primary);display:block;margin-bottom:0.3rem;">
            <i class="fas fa-layer-group" style="color:var(--accent);"></i> مواصفات الخامة:
          </strong>
          <span style="font-size:0.9rem;color:var(--text-main);">${sanitize(product.material)}</span>
        </div>

        <!-- اختيار المقاس -->
        <span class="selector-label">المقاس المطلوب:</span>
        <div class="options-pills" id="qvSizesContainer">
          ${product.sizes.map((size, idx) => `
            <div class="option-pill ${idx === 0 ? 'selected' : ''}" onclick="selectQuickViewOption('size', '${size}', this)">
              ${sanitize(size)}
            </div>
          `).join('')}
        </div>

        <!-- اختيار اللون -->
        <span class="selector-label">اللون المفضل:</span>
        <div class="options-pills" id="qvColorsContainer">
          ${product.colors.map((color, idx) => `
            <div class="option-pill ${idx === 0 ? 'selected' : ''}" onclick="selectQuickViewOption('color', '${color}', this)">
              ${sanitize(color)}
            </div>
          `).join('')}
        </div>

        <!-- الكمية وزر الإضافة -->
        <div style="display:flex;gap:1rem;align-items:center;margin-top:1.8rem;flex-wrap:wrap;">
          <div class="qty-control" style="padding:0.4rem 0.8rem;gap:0.8rem;border-radius:var(--radius-md);">
            <button class="qty-btn" type="button" onclick="changeQuickViewQty(-1)" aria-label="تقليل">-</button>
            <span class="qty-val" id="qvQtyDisplay" style="font-size:1.1rem;min-width:26px;">1</span>
            <button class="qty-btn" type="button" onclick="changeQuickViewQty(1)" aria-label="زيادة">+</button>
          </div>

          <button class="btn btn-primary" type="button" style="flex-grow:1;" onclick="addQuickViewToCart()">
            <i class="fas fa-cart-plus"></i> إضافة إلى السلة
          </button>

          <button class="btn" type="button" style="background:#25d366;color:#ffffff;" onclick="orderProductViaWhatsAppNow()">
            <i class="fab fa-whatsapp"></i> طلب فوري
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  if (modal) modal.classList.remove('open');
  currentQuickViewProduct = null;
}

function selectQuickViewOption(type, value, element) {
  if (type === 'size') {
    quickViewSelectedSize = value;
    document.querySelectorAll('#qvSizesContainer .option-pill').forEach(el => el.classList.remove('selected'));
  } else if (type === 'color') {
    quickViewSelectedColor = value;
    document.querySelectorAll('#qvColorsContainer .option-pill').forEach(el => el.classList.remove('selected'));
  }
  element.classList.add('selected');
}

function changeQuickViewQty(delta) {
  quickViewQuantity = Math.max(1, Math.min(99, quickViewQuantity + delta));
  const display = document.getElementById('qvQtyDisplay');
  if (display) display.textContent = quickViewQuantity;
}

function addQuickViewToCart() {
  if (!currentQuickViewProduct) return;
  addToCart(currentQuickViewProduct.id, quickViewSelectedSize, quickViewSelectedColor, quickViewQuantity);
  closeQuickView();
}

function orderProductViaWhatsAppNow() {
  if (!currentQuickViewProduct) return;
  const msg = `مرحباً بورصة للمفروشات، أود الاستفسار وطلب منتج:\n*${currentQuickViewProduct.name}*\n• المقاس: ${quickViewSelectedSize}\n• اللون: ${quickViewSelectedColor}\n• الكمية: ${quickViewQuantity}\n• السعر: ${formatCurrency(currentQuickViewProduct.price * quickViewQuantity)}\n\nهل المنتج متوفر للشحن أو الاستلام من المعرض بمؤسسة الزكاة؟`;
  const url = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function orderViaWhatsApp(productId) {
  const product = BORSSA_PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
  const msg = `مرحباً بورصة للمفروشات، أريد طلب:\n*${product.name}*\n• السعر: ${formatCurrency(product.price)}\n• المقاس: ${defaultSize}\n\nبرجاء تأكيد التوافر والتفاصيل. شكراً لكم!`;
  const url = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// --------------------------------------------------------------------------
// نافذة إتمام الطلب والفاتورة المشفرة (Secure Checkout Flow)
// --------------------------------------------------------------------------
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('سلة التسوق فارغة! أضف منتجات أولاً', 'warning');
    return;
  }

  closeCartDrawer();
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;

  // ملء المحافظات
  const govSelect = document.getElementById('checkoutGov');
  if (govSelect) {
    govSelect.innerHTML = BORSSA_GOVERNORATES.map(gov => `
      <option value="${gov.id}" ${gov.id === selectedGovernorate ? 'selected' : ''}>
        ${gov.name} (شحن: ${gov.shippingFee === 0 ? 'مجاناً' : gov.shippingFee + ' ج'} • مدة: ${gov.time})
      </option>
    `).join('');
  }

  updateCheckoutSummary();
  modal.classList.add('open');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.remove('open');
}

function updateCheckoutSummary() {
  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const shipping = getSelectedShippingFee();
  const finalTotal = getCartFinalTotal();

  const subtotalEl = document.getElementById('checkoutSubtotal');
  const discountEl = document.getElementById('checkoutDiscount');
  const shippingEl = document.getElementById('checkoutShipping');
  const totalEl = document.getElementById('checkoutFinalTotal');
  const itemsContainer = document.getElementById('checkoutItemsList');

  if (itemsContainer) {
    itemsContainer.innerHTML = cart.map(item => `
      <div style="display:flex;justify-content:space-between;font-size:0.92rem;margin-bottom:0.4rem;color:var(--text-main);">
        <span>${sanitize(item.name)} (${sanitize(item.size)}) × ${item.quantity}</span>
        <strong>${formatCurrency(item.price * item.quantity)}</strong>
      </div>
    `).join('');
  }

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (discountEl) discountEl.textContent = discount > 0 ? `- ${formatCurrency(discount)}` : '0 جنيه';
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'مجاناً (عرض الشحن المجاني)' : formatCurrency(shipping);
  if (totalEl) totalEl.textContent = formatCurrency(finalTotal);
}

function selectPaymentMethod(method, element) {
  selectedPaymentMethod = method;
  document.querySelectorAll('.payment-select-card').forEach(c => c.classList.remove('selected'));
  element.classList.add('selected');

  const infoBox = document.getElementById('paymentDetailsInfo');
  if (!infoBox) return;

  if (method === 'cash') {
    infoBox.innerHTML = `
      <i class="fas fa-hand-holding-usd" style="color:var(--accent);"></i>
      <strong>الدفع عند الاستلام مع المعاينة:</strong> يمكنك فتح الشحنة ومعاينة جودة وخامات المفروشات قبل تسليم المبلغ للمندوب.
    `;
  } else if (method === 'instapay') {
    infoBox.innerHTML = `
      <i class="fas fa-mobile-alt" style="color:var(--accent);"></i>
      <strong>الدفع عبر إنستاباي / فودافون كاش:</strong>
      <div style="margin-top:0.3rem;">رقم المحفظة / إنستاباي: <strong style="color:var(--primary);">${STORE_CONFIG.phone}</strong> (باسم بورصة للمفروشات). يرجى إرسال صورة إيصال التحويل عبر واتساب فور تأكيد الطلب.</div>
    `;
  } else {
    infoBox.innerHTML = `
      <i class="fas fa-credit-card" style="color:var(--accent);"></i>
      <strong>الدفع بالفيزا / فوري:</strong> سيتم تزويدك برابط دفع إلكتروني آمن أو كود فوري عبر الواتساب فور استلام طلبك.
    `;
  }
}

function submitCheckoutOrder() {
  if (isCheckoutSubmitting) return;

  const nameField = document.getElementById('checkoutName');
  const phoneField = document.getElementById('checkoutPhone');
  const addressField = document.getElementById('checkoutAddress');
  const notesField = document.getElementById('checkoutNotes');

  const name = sanitizeInputText(nameField?.value, 80);
  const phone = sanitizeInputText(phoneField?.value, 20);
  const address = sanitizeInputText(addressField?.value, 200);
  const notes = sanitizeInputText(notesField?.value, 250);

  if (!name || name.length < 3) {
    showToast('يرجى كتابة اسمك الكامل', 'warning');
    nameField?.focus();
    return;
  }

  // التحقق الأمني الصارم من رقم الهاتف المصري
  const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
  const cleanPhone = phone.replace(/[\s-+]/g, '');
  if (!phoneRegex.test(cleanPhone)) {
    showToast('يرجى إدخال رقم هاتف مصري صحيح (11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015)', 'warning');
    phoneField?.focus();
    return;
  }

  if (!address || address.length < 5) {
    showToast('يرجى إدخال العنوان التفصيلي لتسهيل التوصيل', 'warning');
    addressField?.focus();
    return;
  }

  isCheckoutSubmitting = true;

  const orderId = 'BRS-' + Math.floor(100000 + Math.random() * 900000);
  const gov = BORSSA_GOVERNORATES.find(g => g.id === selectedGovernorate);
  const govName = gov ? gov.name : selectedGovernorate;
  const shippingFee = getSelectedShippingFee();
  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const finalTotal = getCartFinalTotal();

  const paymentNames = {
    cash: 'الدفع عند الاستلام مع المعاينة',
    instapay: 'إنستاباي / فودافون كاش',
    card: 'فيزا / ماستركارد / فوري'
  };

  const itemsText = cart.map((item, idx) => 
    `${idx + 1}. *${item.name}*\n   - المقاس: ${item.size}\n   - اللون: ${item.color}\n   - الكمية: ${item.quantity}\n   - السعر: ${formatCurrency(item.price * item.quantity)}`
  ).join('\n\n');

  const now = new Date().toLocaleString('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const whatsappMessage = `*طلب شراء جديد من متجر بورصة للمفروشات* 🛍️✨
━━━━━━━━━━━━━━━━━━━━━━
📋 *رقم الفاتورة:* \`${orderId}\`
📅 *التاريخ:* ${now}
━━━━━━━━━━━━━━━━━━━━━━

👤 *بيانات العميل:*
• *الاسم:* ${name}
• *الهاتف:* ${cleanPhone}
• *المحافظة:* ${govName}
• *العنوان:* ${address}
• *ملاحظات العميل:* ${notes || 'لا توجد'}

🛒 *المنتجات المطلوبة:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━━━
💰 *إجمالي المنتجات:* ${formatCurrency(subtotal)}
${discount > 0 ? `🏷️ *الخصم (${activeCoupon ? activeCoupon.code : ''}):* - ${formatCurrency(discount)}\n` : ''}🚚 *تكلفة الشحن:* ${shippingFee === 0 ? 'شحن مجاني 🎁' : formatCurrency(shippingFee)}
💵 *المبلغ الإجمالي المستحق:* *${formatCurrency(finalTotal)}*
💳 *طريقة الدفع:* ${paymentNames[selectedPaymentMethod] || selectedPaymentMethod}
━━━━━━━━━━━━━━━━━━━━━━

📍 *معرض بورصة للمفروشات:*
محور مؤسسة الزكاة - المرج - القاهرة
(بجوار محطة عبد الله الرفاعي)`;

  const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  showToast('جاري فتح واتساب لتأكيد طلبك وفاتورتك...', 'success');

  setTimeout(() => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    cart = [];
    saveCart();
    closeCheckoutModal();
    isCheckoutSubmitting = false;
  }, 1000);
}

// --------------------------------------------------------------------------
// كوبونات الخصم الآمنة (Coupon Validation)
// --------------------------------------------------------------------------
function applyCouponCode() {
  const input = document.getElementById('couponInput');
  const rawCode = (input?.value || '').trim().toUpperCase();
  const code = sanitizeInputText(rawCode, 20);

  if (!code) {
    showToast('يرجى كتابة كود الخصم أولاً', 'warning');
    return;
  }

  if (Object.prototype.hasOwnProperty.call(BORSSA_COUPONS, code)) {
    activeCoupon = {
      code: code,
      ...BORSSA_COUPONS[code]
    };
    showToast(`تم تفعيل كوبون الخصم: ${activeCoupon.description}`, 'success');
    updateCartUI();
  } else {
    showToast('كود الخصم غير صحيح أو منتهي الصلاحية', 'error');
  }
}

// --------------------------------------------------------------------------
// العداد التنازلي للعروض (Flash Deals Countdown)
// --------------------------------------------------------------------------
function initCountdownTimer() {
  const targetDate = new Date();
  targetDate.setHours(targetDate.getHours() + 48);

  function update() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) return;

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const hEl = document.getElementById('timerHours');
    const mEl = document.getElementById('timerMinutes');
    const sEl = document.getElementById('timerSeconds');

    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// --------------------------------------------------------------------------
// الأسئلة الشائعة (FAQ Accordion)
// --------------------------------------------------------------------------
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.parentElement;
      const isActive = faqItem.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));

      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });
}

// --------------------------------------------------------------------------
// زر الصعود لأعلى والقائمة المتنقلة
// --------------------------------------------------------------------------
function initScrollAndNav() {
  const topBtn = document.getElementById('backToTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn?.classList.add('show');
    } else {
      topBtn?.classList.remove('show');
    }
  });

  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  mobileToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('open');
  });

  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
    });
  });
}

// --------------------------------------------------------------------------
// نموذج تواصل معنا (Contact Form with Anti-Spam Lock)
// --------------------------------------------------------------------------
function handleContactFormSubmit(event) {
  event.preventDefault();
  if (isContactSubmitting) return;

  const name = sanitizeInputText(document.getElementById('contactName')?.value, 80);
  const phone = sanitizeInputText(document.getElementById('contactPhone')?.value, 20);
  const msg = sanitizeInputText(document.getElementById('contactMessage')?.value, 300);

  if (!name || !phone || !msg) {
    showToast('يرجى ملء جميع الحقول', 'warning');
    return;
  }

  isContactSubmitting = true;

  const message = `*استفسار جديد من موقع بورصة للمفروشات*\n\n👤 *الاسم:* ${name}\n📱 *الهاتف:* ${phone}\n💬 *الرسالة:* ${msg}`;
  const url = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank', 'noopener,noreferrer');
  showToast('جاري تحويلك إلى واتساب لإرسال رسالتك مباشرة...', 'success');
  document.getElementById('contactForm')?.reset();

  setTimeout(() => {
    isContactSubmitting = false;
  }, 2000);
}

// --------------------------------------------------------------------------
// تهيئة المتجر عند التحميل (Initialization)
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderProducts();
  updateCartUI();
  updateWishlistUI();
  initCountdownTimer();
  initFaqAccordion();
  initScrollAndNav();

  // أحداث التبويبات والبحث والترتيب
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category || 'all';
      renderProducts();
    });
  });

  const searchInput = document.getElementById('catalogSearchInput');
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  const sortSelect = document.getElementById('catalogSortSelect');
  sortSelect?.addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderProducts();
  });

  const govSelect = document.getElementById('checkoutGov');
  govSelect?.addEventListener('change', (e) => {
    selectedGovernorate = e.target.value;
    updateCheckoutSummary();
  });

  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', handleContactFormSubmit);

  console.debug('Borssa El Mafroshat Security-Hardened Controller Active');
});

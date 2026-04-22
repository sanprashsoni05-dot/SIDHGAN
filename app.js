const STORE_KEY = 'sidhgan_products_v1';
const FIRM = {
  name: 'SIDHGAN JEWELLERS',
  whatsappNumber: '919999999999', // Replace with your number
  callNumber: '+91-99999-99999' // Replace with your number
};

const defaultProducts = [
  {
    id: crypto.randomUUID(),
    name: 'Royal Kundan Bridal Set',
    category: 'Kundan',
    price: 149999,
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=80',
    description: 'Premium bridal kundan set with intricate handcrafted detailing.'
  },
  {
    id: crypto.randomUUID(),
    name: 'Heritage Jadau Choker',
    category: 'Jadau',
    price: 89999,
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=1000&q=80',
    description: 'Traditional jadau work with regal stone placement and polish.'
  },
  {
    id: crypto.randomUUID(),
    name: 'Modern Diamond Ring',
    category: 'Modern',
    price: 39999,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=80',
    description: 'Minimal modern ring style ideal for gifting and daily wear.'
  },
  {
    id: crypto.randomUUID(),
    name: 'Traditional Temple Necklace',
    category: 'Traditional',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1620421680010-0766ff230392?auto=format&fit=crop&w=1000&q=80',
    description: 'Classic traditional necklace inspired by heritage temple motifs.'
  }
];

let products = loadProducts();
let activeCategory = 'All';

const productGrid = document.getElementById('productGrid');
const categoryFilters = document.getElementById('categoryFilters');
const searchInput = document.getElementById('searchInput');
const productForm = document.getElementById('productForm');
const jsonOutput = document.getElementById('jsonOutput');
const statProducts = document.getElementById('statProducts');

function loadProducts() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    localStorage.setItem(STORE_KEY, JSON.stringify(defaultProducts));
    return [...defaultProducts];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [...defaultProducts];
  }
}

function saveProducts(next) {
  products = next;
  localStorage.setItem(STORE_KEY, JSON.stringify(products));
  renderAll();
}

function inr(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function getCategories() {
  return ['All', ...new Set(products.map((p) => p.category))];
}

function getFilteredProducts() {
  const q = searchInput.value.trim().toLowerCase();
  return products.filter((p) => {
    const categoryOk = activeCategory === 'All' || p.category === activeCategory;
    const searchOk = !q || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q);
    return categoryOk && searchOk;
  });
}

function makeWhatsAppLink(productName = '') {
  const text = encodeURIComponent(
    `Namaste ${FIRM.name}, mujhe ${productName || 'aapki jewellery collection'} ke bare mein inquiry karni hai.`
  );
  return `https://wa.me/${FIRM.whatsappNumber}?text=${text}`;
}

function renderFilters() {
  categoryFilters.innerHTML = '';
  getCategories().forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${cat === activeCategory ? 'active' : ''}`;
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      activeCategory = cat;
      renderAll();
    });
    categoryFilters.appendChild(btn);
  });
}

function renderProducts() {
  const items = getFilteredProducts();
  productGrid.innerHTML = items
    .map(
      (p) => `
      <article class="product-card">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <div class="product-body">
          <h3>${p.name}</h3>
          <p class="meta">${p.category}</p>
          <p class="price">${inr(p.price)}</p>
          <p class="meta">${p.description}</p>
          <div class="card-actions">
            <a class="btn btn-primary" href="${makeWhatsAppLink(p.name)}" target="_blank" rel="noopener">WhatsApp</a>
            <a class="btn btn-secondary" href="tel:${FIRM.callNumber}">Call</a>
          </div>
        </div>
      </article>
    `
    )
    .join('');
}

function renderStats() {
  statProducts.textContent = `${products.length}+`;
}

function renderJson() {
  jsonOutput.value = JSON.stringify(products, null, 2);
}

function renderAll() {
  renderFilters();
  renderProducts();
  renderStats();
  renderJson();
}

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(productForm);
  const product = {
    id: crypto.randomUUID(),
    name: fd.get('name').toString().trim(),
    category: fd.get('category').toString(),
    price: Number(fd.get('price')),
    image: fd.get('image').toString().trim(),
    description: fd.get('description').toString().trim()
  };

  if (!product.name || !product.image || !product.description || !product.price) return;
  saveProducts([product, ...products]);
  productForm.reset();
});

document.getElementById('exportJson').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sidhgan-products.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('copyJson').addEventListener('click', async () => {
  await navigator.clipboard.writeText(JSON.stringify(products, null, 2));
  alert('Products JSON copied. Paste in Blogger HTML mode.');
});

document.getElementById('resetProducts').addEventListener('click', () => {
  if (!confirm('Reset to default products?')) return;
  saveProducts([...defaultProducts]);
});

searchInput.addEventListener('input', renderProducts);

function bootContactLinks() {
  const wa = makeWhatsAppLink();
  const tel = `tel:${FIRM.callNumber}`;
  ['heroWhatsapp', 'contactWhatsapp'].forEach((id) => {
    document.getElementById(id).href = wa;
    document.getElementById(id).target = '_blank';
    document.getElementById(id).rel = 'noopener';
  });
  ['heroCall', 'contactCall'].forEach((id) => {
    document.getElementById(id).href = tel;
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
bootContactLinks();
renderAll();

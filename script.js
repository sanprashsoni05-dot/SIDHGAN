const CONTACT = {
  phone: '+919999999999',
  whatsapp: '919999999999',
  firm: 'SIDHGAN JEWELLERS'
};

const defaultProducts = [
  {
    id: crypto.randomUUID(),
    name: 'Royal Kundan Bridal Set',
    price: '₹2,35,000',
    category: 'Kundan',
    image: 'images/royal-kundan-bridal-set.jpg',
    description: 'Heavy bridal kundan set with matching earrings and maang tikka.'
  },
  {
    id: crypto.randomUUID(),
    name: 'Classic Jadau Choker',
    price: '₹1,65,000',
    category: 'Jadau',
    image: 'images/classic-jadau-choker.jpg',
    description: 'Traditional jadau craftsmanship with premium finish.'
  },
  {
    id: crypto.randomUUID(),
    name: 'Modern Diamond Fusion Necklace',
    price: '₹98,000',
    category: 'Modern',
    image: 'images/modern-fusion-necklace.jpg',
    description: 'Minimal modern statement piece for premium events.'
  },
  {
    id: crypto.randomUUID(),
    name: 'Traditional Temple Haar',
    price: '₹1,22,000',
    category: 'Traditional',
    image: 'images/traditional-temple-haar.jpg',
    description: 'South-inspired temple design with antique detailing.'
  }
];

const storageKey = 'sidhgan_products_v1';
let products = JSON.parse(localStorage.getItem(storageKey) || 'null') || defaultProducts;

const productGrid = document.getElementById('productGrid');
const searchBox = document.getElementById('searchBox');
const categoryFilter = document.getElementById('categoryFilter');
const resetFilters = document.getElementById('resetFilters');
const productForm = document.getElementById('productForm');
const jsonOutput = document.getElementById('jsonOutput');

function saveProducts() {
  localStorage.setItem(storageKey, JSON.stringify(products));
}

function buildWhatsAppLink(productName = '') {
  const msg = productName
    ? `Namaste ${CONTACT.firm}, mujhe "${productName}" ke baare mein inquiry karni hai.`
    : `Namaste ${CONTACT.firm}, mujhe jewellery collections ke baare mein inquiry karni hai.`;
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;
}

function renderProducts() {
  const term = searchBox.value.toLowerCase().trim();
  const cat = categoryFilter.value;

  const filtered = products.filter((p) => {
    const byCat = cat === 'all' || p.category === cat;
    const byTerm = !term || [p.name, p.description, p.category].join(' ').toLowerCase().includes(term);
    return byCat && byTerm;
  });

  productGrid.innerHTML = filtered.map((p) => `
    <article class="product-card">
      <img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/600x400/1b1b1f/d7af53?text=SIDHGAN+JEWELLERS'" />
      <div class="content">
        <span class="chip">${p.category}</span>
        <h4>${p.name}</h4>
        <div class="price">${p.price}</div>
        <p>${p.description || ''}</p>
        <div class="card-actions">
          <a class="btn primary" href="${buildWhatsAppLink(p.name)}" target="_blank" rel="noopener">WhatsApp</a>
          <a class="btn secondary" href="tel:${CONTACT.phone}">Call</a>
        </div>
      </div>
    </article>
  `).join('');

  if (!filtered.length) {
    productGrid.innerHTML = '<p>No products found. Filters reset karke try karein.</p>';
  }
}

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newProduct = {
    id: crypto.randomUUID(),
    name: document.getElementById('pName').value.trim(),
    price: document.getElementById('pPrice').value.trim(),
    image: document.getElementById('pImage').value.trim(),
    category: document.getElementById('pCategory').value,
    description: document.getElementById('pDesc').value.trim()
  };

  products.unshift(newProduct);
  saveProducts();
  renderProducts();
  productForm.reset();
});

document.getElementById('exportJson').addEventListener('click', () => {
  jsonOutput.value = JSON.stringify(products, null, 2);
});

document.getElementById('importJson').addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      products = parsed;
      saveProducts();
      renderProducts();
      jsonOutput.value = 'Import successful ✅';
    } else {
      jsonOutput.value = 'Invalid JSON format. Array expected.';
    }
  } catch {
    jsonOutput.value = 'JSON parse error. File check karein.';
  }
});

searchBox.addEventListener('input', renderProducts);
categoryFilter.addEventListener('change', renderProducts);
resetFilters.addEventListener('click', () => {
  searchBox.value = '';
  categoryFilter.value = 'all';
  renderProducts();
});

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('whatsappMain').href = buildWhatsAppLink();

renderProducts();

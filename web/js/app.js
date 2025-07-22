const apiUrl = 'https://www.amiiboapi.com/api/amiibo/';
const grid = document.getElementById('amiiboGrid');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');

const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalSeries = document.getElementById('modalSeries');
const modalGame = document.getElementById('modalGame');
const modalType = document.getElementById('modalType');

let allAmiibos = [];

fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    allAmiibos = data.amiibo;
    renderAmiibos(allAmiibos);
  })
  .catch(() => {
    grid.innerHTML = '<p style="color:red;">Failed to load Amiibo data.</p>';
  });

function renderAmiibos(amiibos) {
  grid.innerHTML = '';
  amiibos.forEach(amiibo => {
    const card = document.createElement('div');
    card.className = 'amiibo-card';
    card.innerHTML = `
      <img src="${amiibo.image}" alt="${amiibo.name}" />
      <p>${amiibo.name}</p>
    `;

    card.addEventListener('click', () => openModal(amiibo));

    grid.appendChild(card);
  });
}

function openModal(amiibo) {
  modalImage.src = amiibo.image;
  modalImage.alt = amiibo.name;
  modalName.textContent = amiibo.name;
  modalSeries.textContent = `Series: ${amiibo.amiiboSeries}`;
  modalGame.textContent = `Game Series: ${amiibo.gameSeries}`;
  modalType.textContent = `Type: ${amiibo.type}`;
  modal.style.display = 'flex';
}

modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal if clicking outside modal content
modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Close modal on ESC key
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.style.display === 'flex') {
    modal.style.display = 'none';
  }
});

searchInput.addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  const filtered = allAmiibos.filter(a => a.name.toLowerCase().includes(query));
  renderAmiibos(filtered);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
});

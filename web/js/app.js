// Fetch Amiibo API
const apiUrl = 'https://www.amiiboapi.com/api/amiibo/';
const grid = document.getElementById('amiiboGrid');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');

let allAmiibos = [];

fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    allAmiibos = data.amiibo;
    renderAmiibos(allAmiibos);
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
    grid.appendChild(card);
  });
}

searchInput.addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  const filtered = allAmiibos.filter(a => a.name.toLowerCase().includes(query));
  renderAmiibos(filtered);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
});

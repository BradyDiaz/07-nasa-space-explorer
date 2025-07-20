// Your existing elements
const gallery = document.getElementById('gallery');
const fetchBtn = document.getElementById('fetchBtn');
const modal = document.getElementById('modal');
const modalMedia = document.getElementById('modalMedia');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeModal = document.getElementById('closeModal');
const spaceFact = document.getElementById('spaceFact');
const dateRangeDisplay = document.getElementById('dateRangeDisplay'); // NEW element to show date range

const NASA_KEY = "Y4uava2PUALUmEK8YB92xJtHpr2QpW1x7Ryvvzby";

const facts = [
  "Venus is the hottest planet in our solar system.",
  "A day on Venus is longer than a year on Venus.",
  "Neutron stars can spin 600 times per second.",
  "The footprints on the Moon will be there for millions of years.",
  "Jupiter has over 90 known moons.",
  "The Moon is slowly drifting away from Earth."
];

// Show a random space fact
spaceFact.innerText = `🚀 Did You Know? ${facts[Math.floor(Math.random() * facts.length)]}`;

// Format date for display (e.g., July 20, 2025)
const formatDateForDisplay = (d) =>
  d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// Call setupDateInputs with your inputs
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
setupDateInputs(startInput, endInput);

fetchBtn.addEventListener('click', async () => {
  const start = startInput.value;
  const end = endInput.value;

  if (!start) {
    alert('Please select a start date');
    return;
  }
  if (!end) {
    alert('Date range is invalid');
    return;
  }

  if (dateRangeDisplay) {
    dateRangeDisplay.textContent = `Showing images from ${formatDateForDisplay(new Date(start))} to ${formatDateForDisplay(new Date(end))}`;
  }

  gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">🔄</div><p>Loading space photos…</p></div>`;

  try {
    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&start_date=${start}&end_date=${end}`);
    const data = await res.json();

    if (data.error) {
      gallery.innerHTML = `<div class="placeholder"><p>${data.error.message}</p></div>`;
      return;
    }

    gallery.innerHTML = "";
    data.reverse().forEach(item => {
      const card = document.createElement('div');
      card.className = 'gallery-item';
      card.innerHTML = `
        ${item.media_type === 'image'
          ? `<img src="${item.url}" alt="${item.title}" />`
          : `<iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>`
        }
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      `;
      card.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modalTitle.textContent = item.title;
        modalDate.textContent = item.date;
        modalExplanation.textContent = item.explanation;
        modalMedia.innerHTML = item.media_type === 'image'
          ? `<img src="${item.hdurl || item.url}" alt="${item.title}" />`
          : `<iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>`;
      });
      gallery.appendChild(card);
    });
  } catch (err) {
    gallery.innerHTML = `<div class="placeholder"><p>Error fetching images. Please try again later.</p></div>`;
    console.error(err);
  }
});

closeModal.addEventListener('click', () => modal.classList.add('hidden'));
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

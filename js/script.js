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
  "The Moon is slowly drifting away from Earth.",
  "Mars has the tallest volcano in the solar system, Olympus Mons, which is nearly 22 km high.",
  "Saturn's rings are made mostly of ice particles ranging from tiny grains to chunks as big as mountains.",
  "Neptune was the first planet discovered through mathematical prediction before it was seen through a telescope.",
  "A teaspoon of neutron star material would weigh about 6 billion tons on Earth.",
  "The Milky Way galaxy is estimated to contain over 100 billion stars.",
  "Black holes warp spacetime so strongly that not even light can escape their pull.",
  "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.",
  "The Hubble Space Telescope has helped discover that the universe is expanding at an accelerating rate.",
  "Some stars, called pulsars, emit beams of radiation that sweep across space like lighthouse beams.",
  "The Great Red Spot on Jupiter is a giant storm that has been raging for at least 400 years.",
  "Comets are remnants from the early solar system, made of ice, dust, and rocky materials.",
  "The universe is approximately 13.8 billion years old.",
  "Our solar system orbits the center of the Milky Way galaxy once every 225-250 million years.",
  "Dark matter makes up about 27% of the universe, but it cannot be seen directly.",
  "Space is not completely empty — it contains a thin soup of particles and radiation called the interstellar medium.",
  "The James Webb Space Telescope can see infrared light from some of the earliest galaxies formed after the Big Bang.",
  "Some exoplanets orbit so close to their stars that their years last only a few Earth days.",
  "A single galaxy can contain multiple supermassive black holes if it merges with others.",
  "The cosmic microwave background radiation is the afterglow of the Big Bang and fills the entire universe."
];


// Show a random space fact
spaceFact.innerText = `🚀 Did You Know? ${facts[Math.floor(Math.random() * facts.length)]}`;

// Format date for display (e.g., July 20, 2025)
const formatDateForDisplay = (d) =>
  d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// Call setupDateInputs with your inputs (make sure this function is defined in your other JS file)
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

  // Show the date range nicely
  if (dateRangeDisplay) {
    dateRangeDisplay.textContent = `Showing images from ${formatDateForDisplay(new Date(start))} to ${formatDateForDisplay(new Date(end))}`;
  }

  gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">👨‍🚀</div><p>Exploring the cosmos…</p></div>`;


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

      // Detect video type and embed accordingly
      let mediaHTML = '';
      if (item.media_type === 'image') {
        mediaHTML = `<img src="${item.url}" alt="${item.title}" />`;
      } else {
        const url = item.url.toLowerCase();
        if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
          // Embed YouTube/Vimeo iframe
          mediaHTML = `<iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>`;
        } else {
          // Assume direct video URL - use video tag
          mediaHTML = `<video controls src="${item.url}" style="width: 100%; height: 200px;"></video>`;
        }
      }

      card.innerHTML = `
        ${mediaHTML}
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      `;

      card.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modalTitle.textContent = item.title;
        modalDate.textContent = item.date;
        modalExplanation.textContent = item.explanation;

        if (item.media_type === 'image') {
          modalMedia.innerHTML = `<img src="${item.hdurl || item.url}" alt="${item.title}" />`;
        } else {
          const url = item.url.toLowerCase();
          if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
            modalMedia.innerHTML = `<iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>`;
          } else {
            modalMedia.innerHTML = `<video controls src="${item.url}" style="width: 100%; height: auto;"></video>`;
          }
        }
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

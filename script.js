const apiUrl =
  'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';

const apiToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MzI4OTczODY3ZjIwZTdlZDlkMjIyZmUyNzhkMWU4OCIsIm5iZiI6MTc0MDgxODA0Mi43ODksInN1YiI6IjY3YzJjNjdhNmU3NjgwOTAwNzZkZGE1NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EjxNAWUwkXEasfvKDxpugn3w6uWolkq2O3Ae8Y656go';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${apiToken}`,
  },
};

let allMovies = []; // Store all movies for searching

// Function to fetch popular movies
function fetchPopularMovies() {
  fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Fetched Movies:', data.results); // Debugging: Check if data is received
      allMovies = data.results; // Store movies for search functionality
      displayMovies(allMovies); // Update UI
    })
    .catch((error) => console.error('Error fetching movies:', error));
}

// Function to display movies dynamically
function displayMovies(movies) {
  const movieContainer = document.querySelector('#popular-movies .grid');
  movieContainer.innerHTML = ''; // Clear existing content

  if (!movies || movies.length === 0) {
    movieContainer.innerHTML =
      '<p class="text-gray-500 text-center">No movies found.</p>';
    return;
  }

  movies.forEach((movie) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add(
      'card',
      'p-4',
      'bg-white',
      'rounded-lg',
      'shadow-lg'
    );

    movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-full h-auto rounded mb-2">
            <h3 class="text-lg font-semibold">${movie.title}</h3>
            <p class="text-sm text-gray-600">${movie.release_date}</p>
            <button class="favorite-btn mt-2 px-3 py-1 bg-blue-500 text-white rounded">Add to Favorites</button>
        `;

    movieContainer.appendChild(movieCard);
  });
}

// Function to filter movies based on search input
function searchMovies() {
  const searchInput = document.getElementById('search-bar').value.toLowerCase();

  const filteredMovies = allMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchInput)
  );

  displayMovies(filteredMovies); // Update displayed movies
}

// ---------- SEARCH MODAL FUNCTIONALITY ---------- //
const searchInput = document.getElementById('search-bar'); // Your search bar input
const searchModal = document.getElementById('searchModal'); // Modal
const searchResultsContainer = document.getElementById('searchResults'); // Results container
const closeSearchModal = document.getElementById('closeSearchModal'); // Close button

const searchApiBaseUrl =
  'https://api.themoviedb.org/3/search/movie?language=en-US&query=';

// Function to fetch movies from API based on search query
async function fetchSearchResults(query) {
  if (!query.trim()) return; // Avoid empty searches

  try {
    const response = await fetch(`${searchApiBaseUrl}${query}&page=1`, options);
    if (!response.ok) throw new Error('Failed to fetch search results');

    const data = await response.json();
    displaySearchResults(data.results);
  } catch (error) {
    console.error('Error searching movies:', error);
  }
}

// Function to display search results in the modal
function displaySearchResults(movies) {
  searchResultsContainer.innerHTML = ''; // Clear previous results

  if (!movies.length) {
    searchResultsContainer.innerHTML =
      '<p class="text-gray-500 text-center">No movies found.</p>';
    return;
  }

  movies.forEach((movie) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('p-4', 'bg-gray-100', 'rounded-lg', 'shadow');

    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-full h-auto rounded mb-2">
      <h3 class="text-lg font-semibold">${movie.title}</h3>
      <p class="text-sm text-gray-600">${movie.release_date}</p>
    `;

    searchResultsContainer.appendChild(movieCard);
  });

  searchModal.classList.remove('hidden'); // Show modal
}

// Event listener for search input (when pressing Enter)
searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    fetchSearchResults(searchInput.value);
  }
});

// Close modal when clicking "×"
closeSearchModal.addEventListener('click', () => {
  searchModal.classList.add('hidden');
});

// Close modal when clicking outside of it
searchModal.addEventListener('click', (event) => {
  if (event.target === searchModal) {
    searchModal.classList.add('hidden');
  }
});

// Fetch movies when the page loads
document.addEventListener('DOMContentLoaded', fetchPopularMovies);

const apiUrl = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
const apiToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MzI4OTczODY3ZjIwZTdlZDlkMjIyZmUyNzhkMWU4OCIsIm5iZiI6MTc0MDgxODA0Mi43ODksInN1YiI6IjY3YzJjNjdhNmU3NjgwOTAwNzZkZGE1NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EjxNAWUwkXEasfvKDxpugn3w6uWolkq2O3Ae8Y656go';
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiToken}`, // Ensure backticks around the template literal
    },
  };

  // Function to display movies dynamically
function displayMovies(movies) {
  favoriteMovies = getFavoriteMovies(); // Ensure fresh data from localStorage

  const movieContainer = document.querySelector('#popular-movies .grid');
  movieContainer.innerHTML = ''; // Clear existing content

  if (!movies || movies.length === 0) {
    movieContainer.innerHTML =
      '<p class="text-gray-500 text-center">No movies found.</p>';
    return;
  }

  movies.forEach((movie) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('card', 'p-4', 'bg-white', 'rounded-lg', 'shadow-lg');

    const isFavorite = favoriteMovies.some((fav) => fav.id === movie.id);

    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-full h-auto rounded mb-2">
      <h3 class="text-lg font-semibold">${movie.title}</h3>
      <p class="text-sm text-gray-600">${movie.release_date}</p>
      <button class="favorite-btn mt-2 px-3 py-1 ${isFavorite ? 'bg-red-500' : 'bg-blue-500'} text-white rounded" onclick="toggleFavorite(${movie.id})">
        ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    `;

    movieContainer.appendChild(movieCard);
  });
}

let allMovies = []; // Store all movies for searching
let favoriteMovies = getFavoriteMovies(); // Get favorite movies from localStorage

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
      console.log('Fetched Movies:', data); // Log the whole response to check structure
      allMovies = data.results; // Store movies for search functionality
      displayMovies(allMovies); // Update UI
    })
    .catch((error) => console.error('Error fetching movies:', error));
}


// Function to get favorite movies from localStorage
function getFavoriteMovies() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

// Function to add a movie to favorites
function addToFavorites(movie) {
  const favorites = getFavoriteMovies();
  if (!favorites.some((fav) => fav.id === movie.id)) {
    favorites.push(movie);
    saveFavoriteMovies(favorites);
  }
}

// Function to toggle favorite status
function toggleFavorite(movieId) {
  const movie = allMovies.find((movie) => movie.id === movieId);
  if (!movie) return;

  const isFavorite = favoriteMovies.some((fav) => fav.id === movie.id);

  if (isFavorite) {
    removeFromFavorites(movieId);
  } else {
    addToFavorites(movie);
  }

  favoriteMovies = getFavoriteMovies(); // Update the local favoriteMovies array
  displayMovies(allMovies); // Re-display the movies with updated favorite status
}

// Function to remove a movie from favorites
function removeFromFavorites(movieId) {
  // Remove from the favoriteMovies array
  favoriteMovies = favoriteMovies.filter((movie) => movie.id !== movieId);
  
  // Save the updated list of favorite movies to localStorage
  saveFavoriteMovies(favoriteMovies);
  
  // Remove the movie card from the UI
  const movieCard = document.querySelector(`#favorite-movie-${movieId}`);
  if (movieCard) {
    movieCard.remove(); // This removes the specific movie card element
  }

  // Re-display the updated favorite movies
  displayFavoriteMovies();
}

// Function to save favorite movies to localStorage
function saveFavoriteMovies(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to display favorite movies
function displayFavoriteMovies() {
  const favoriteMovies = getFavoriteMovies();
  const favoriteMoviesContainer = document.querySelector('#favorite-movie-list');
  favoriteMoviesContainer.innerHTML = ''; // Clear existing content

  if (favoriteMovies.length === 0) {
    document.getElementById('no-favorites-msg').classList.remove('hidden');
  } else {
    document.getElementById('no-favorites-msg').classList.add('hidden');
    favoriteMovies.forEach((movie) => {
      const movieCard = document.createElement('div');
      movieCard.classList.add('card', 'p-4', 'bg-white', 'rounded-lg', 'shadow-lg');

      movieCard.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-full h-auto rounded mb-2">
        <h3 class="text-lg font-semibold">${movie.title}</h3>
        <p class="text-sm text-gray-600">${movie.release_date}</p>
        <button class="favorite-btn mt-2 px-3 py-1 bg-blue-500 text-white rounded" onclick="removeFromFavorites(${movie.id})">Remove from Favorites</button>
      `;
      favoriteMoviesContainer.appendChild(movieCard);
    });
  }
}

// ---------- FAVORITES LINK AND DISPLAY ---------- //
// Event listener for "Favorites" link in navbar
document.getElementById('favorite-link').addEventListener('click', () => {
  document.querySelector('#popular-movies').classList.add('hidden');
  document.querySelector('#favorite-movies').classList.remove('hidden');
  displayFavoriteMovies(); // Display favorite movies
});

// Event listener for "Back to Popular Movies" link
document.getElementById('back-to-popular').addEventListener('click', () => {
  document.querySelector('#favorite-movies').classList.add('hidden');
  document.querySelector('#popular-movies').classList.remove('hidden');
});

// Fetch movies when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, fetching movies...');
  fetchPopularMovies();
});
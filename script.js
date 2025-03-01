const apiUrl = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';

// 🔹 Replace with your actual TMDB Bearer Token
const apiToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MzI4OTczODY3ZjIwZTdlZDlkMjIyZmUyNzhkMWU4OCIsIm5iZiI6MTc0MDgxODA0Mi43ODksInN1YiI6IjY3YzJjNjdhNmU3NjgwOTAwNzZkZGE1NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EjxNAWUwkXEasfvKDxpugn3w6uWolkq2O3Ae8Y656go';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${apiToken}`
  }
};

// Function to fetch popular movies
function fetchPopularMovies() {
  fetch(apiUrl, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    })
    .then(data => {
      console.log("Fetched Movies:", data.results); // Debugging: Check if data is received
      displayMovies(data.results); //  Update UI
    })
    .catch(error => console.error('Error fetching movies:', error));
}

// Function to display movies dynamically
function displayMovies(movies) {
    const movieContainer = document.querySelector('#popular-movies .grid');
    movieContainer.innerHTML = ''; // Clear existing content

    if (!movies || movies.length === 0) {
        movieContainer.innerHTML = '<p class="text-gray-500 text-center">No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('card', 'p-4', 'bg-white', 'rounded-lg', 'shadow-lg');

        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-full h-auto rounded mb-2">
            <h3 class="text-lg font-semibold">${movie.title}</h3>
            <p class="text-sm text-gray-600">${movie.release_date}</p>
            <button class="favorite-btn mt-2 px-3 py-1 bg-blue-500 text-white rounded">Add to Favorites</button>
        `;

        movieContainer.appendChild(movieCard);
    });
}

// fetch popular movies when reload the page
document.addEventListener('DOMContentLoaded', fetchPopularMovies);

const token = localStorage.getItem("access_token");
console.log(token)
const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
    },
});

if (!response.ok) {
    throw new Error('error fetching');
}
const data = await response.json();
console.log(data);   
const genre_array = data.genres;

async function filteredGenres(content) {
    const filteredGenres = genre_array.filter((genre) =>
        genre.toLowerCase().includes(content.toLowerCase())
    );
    return filteredGenres;
}

const genre_search = document.getElementById("genre_id");
const genre_results = document.getElementById("genre_results");

genre_search.addEventListener('input', async () => {
    const searchbox_content = genre_search.value.trim();
    const filtered = await filteredGenres(searchbox_content);
    showFilteredGenres(filtered);
});

genre_search.addEventListener('blur', () => {
    genre_results.innerHTML = "";
});

function showFilteredGenres(filteredGenres) {
    genre_results.innerHTML = "";
    
    if (filteredGenres.length === 0) {
        return;
    }

    let limit = 0;
    filteredGenres.forEach(genre => {
        limit++;

        if (limit <= 5) {
            const genreItem = document.createElement("div");
            genreItem.className = "form-control";
            genreItem.textContent = genre;
            genre_results.appendChild(genreItem);
        }

    });
}

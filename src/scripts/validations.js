function isValid() {
    const playlistNameValue = document.getElementById("playlist_id").value;
    const descriptionValue = document.getElementById("description_id").value;
    const genre = document.getElementById("genre_id").value;

    if (!playlistNameValue || !descriptionValue || !genre) {
        alert("Please fill all fields.");
        return false;
    }

    return true;
}

export { isValid };
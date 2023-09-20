document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("access_token");
    const user_id = localStorage.getItem("user_id");
    const create_button = document.getElementById("create_button");

    create_button.addEventListener("click", async function() {
        const playlistNameValue = document.getElementById("playlist_id").value;
        const descriptionValue = document.getElementById("description_id").value;
        const isPublicValue = document.getElementById("playlist_public_id").checked;
        const genre = document.getElementById("genre_id").value;
        const tracksNumber = +document.getElementById("customRange").value;

        console.log("playlist name: ", playlistNameValue);
        console.log("description; ", descriptionValue);
        console.log("isPublic: ", isPublicValue);
        console.log("genre: ", genre);
        console.log("tracksNumber: ", tracksNumber);

        //const spotify_id = await createPlaylist(user_id, playlistNameValue, descriptionValue, isPublicValue);

        let offset = 0;
        const limit = defineLimit(tracksNumber);
        let tracksList = await fetchTracks(genre, offset, limit);
        const selectedTracks = await selectRandomTracks(tracksList, tracksNumber);
        console.log("list of tracks: ", selectedTracks);
    })

    async function createPlaylist(user_id, playlistNameValue, descriptionValue, isPublicValue) {
        const body = JSON.stringify({
            "name": playlistNameValue,
            "description": descriptionValue,
            "public": isPublicValue,
        });

        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }

        try {
            const response = await fetch(
                `https://api.spotify.com/v1/users/${user_id}/playlists`,   
                {
                    method: "POST",
                    headers: headers,
                    body: body,
                }
            );

            if (response.ok) {
                const data = await response.json();
                return data.id;
            } else {
                console.log("error creating playlist");
            }
        } catch (error) {
            console.log("error: ", error)
        }
    }

    async function fetchTracks(genre, offset, limit) {
        let tracksList = [];

        // itll call the api 10 times
        for (let apiRequestCount = 0; apiRequestCount < 10; apiRequestCount++) {
            const headers = {
                "Authorization": `Bearer ${token}`,
            }
            let endpoint = configureEndPoint(genre, offset, limit, apiRequestCount);

            try {
                const response = await fetch(
                    endpoint,
                    {
                        method: "GET",
                        headers: headers,
                    }
                );
    
                if (response.ok) {
                    const data = await response.json();
    
                    if (data !== undefined) {
                        if (data.tracks && data.tracks.items) {
                            console.log(data.tracks.items);
                            for (let i = 0; i < data.tracks.items.length; i++) {
                                tracksList.push(data.tracks.items[i].name);
                            }
                        } else {
                            console.log("no tracks found");
                        }
                    } else {
                        console.log("no data found");
                    }
                    
                } else {
                    console.log("error in the response");
                }
            } catch (error) {
                console.log("error in fetching tracks: ", error);
            }

            offset = offset + limit;

        }
        return tracksList;
    }

    function configureEndPoint(genre, offset, limit, request) {
        //first request
        if (request == 0) {
            return `https://api.spotify.com/v1/search?q=genre%3A${genre}&type=track&limit=${limit}&offset=0`
        } else {
            let newOffset = offset + limit;
            return `https://api.spotify.com/v1/search?q=genre%3A${genre}&type=track&limit=${limit}&offset=${newOffset}`
        }
    }

    function defineLimit(limit) {
        if (limit >= 50) return 50; else return limit;
    }

    function selectRandomTracks(tracksList, tracksNumber) {
        const shuffledTracks = tracksList.sort(() => 0.5 - Math.random());
        return shuffledTracks.slice(0, tracksNumber);
    }
});


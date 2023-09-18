document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("access_token");
    const user_id = localStorage.getItem("user_id");
    const create_button = document.getElementById("create_button");

    create_button.addEventListener("click", async function() {
        const playlistNameValue = document.getElementById("playlist_id").value;
        const descriptionValue = document.getElementById("description_id").value;
        const isPublicValue = document.getElementById("playlist_public_id").checked;

        console.log("playlist name: ", playlistNameValue);
        console.log("description; ", descriptionValue);
        console.log("isPublic: ", isPublicValue);

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
                console.log("playlist created");
            } else {
                console.log("error creating playlist");
            }
        } catch (error) {
            console.log("error: ", error)
        }

    })
});


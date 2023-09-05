document.addEventListener("DOMContentLoaded", function() {
    const range_input = document.getElementById("customRange");
    const range_output = document.getElementById("number_tracks");
    
    range_input.addEventListener('input', () => {
        const currentValue = range_input.value;
        range_output.innerHTML = currentValue;
    });
});

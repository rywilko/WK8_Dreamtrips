// Supabase connection
const supabaseUrl = "https://zrooogsxbyxmdvlyjjky.supabase.co";
const supabaseKey = "sb_publishable_swMZABBxxJnIHOvgme0q4g_flP4fN_m";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


// ============================
// Destination Recommendation
// ============================

document.getElementById("recommendBtn").addEventListener("click", () => {
    const style = document.getElementById("style").value;
    const climate = document.getElementById("climate").value;
    const resultDiv = document.getElementById("recommendationResult");

    if (!style || !climate) {
        resultDiv.innerHTML = "Please select both travel style and climate.";
        return;
    }

    let recommendation = "";

    if (style === "relaxing" && climate === "hot") {
        recommendation = "Maldives – Perfect for relaxing beach luxury.";
    } else if (style === "adventure" && climate === "cool") {
        recommendation = "Switzerland – Ideal for hiking and mountain adventures.";
    } else if (style === "luxury" && climate === "hot") {
        recommendation = "Dubai – Luxury resorts and sunshine.";
    } else {
        recommendation = "Japan – A romantic mix of culture and exploration.";
    }

    resultDiv.innerHTML = recommendation;
});


// ============================
// Itinerary CRUD
// ============================

const form = document.getElementById("itineraryForm");
const itineraryList = document.getElementById("itineraryList");
const formMessage = document.getElementById("formMessage");

// Load items on page load
document.addEventListener("DOMContentLoaded", loadItinerary);

async function loadItinerary() {
    const { data, error } = await supabase
        .from("itinerary_items")
        .select("*")
        .order("day_number", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    itineraryList.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `
            <strong>Day ${item.day_number} – ${item.destination}</strong>
            <p>${item.activity} (${item.accommodation})</p>
            <p>${item.notes || ""}</p>
            <button onclick="deleteItem(${item.id})">Delete</button>
            <hr>
        `;
        itineraryList.appendChild(div);
    });
}


// Add item
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const destination = document.getElementById("destination").value.trim();
    const day = parseInt(document.getElementById("day").value);
    const activity = document.getElementById("activity").value.trim();
    const accommodation = document.getElementById("accommodation").value.trim();
    const notes = document.getElementById("notes").value.trim();

    // Validation
    if (!destination || !activity || !accommodation) {
        formMessage.textContent = "Please fill in all required fields.";
        return;
    }

    if (isNaN(day) || day < 1 || day > 30) {
        formMessage.textContent = "Day number must be between 1 and 30.";
        return;
    }

    if (notes.length > 200) {
        formMessage.textContent = "Notes must be under 200 characters.";
        return;
    }

    const { error } = await supabase
        .from("itinerary_items")
        .insert([{ destination, day_number: day, activity, accommodation, notes }]);

    if (error) {
        formMessage.textContent = "Error adding itinerary item.";
        console.error(error);
    } else {
        formMessage.textContent = "Itinerary item added successfully!";
        form.reset();
        loadItinerary();
    }
});


// Delete item
async function deleteItem(id) {
    await supabase
        .from("itinerary_items")
        .delete()
        .eq("id", id);

    loadItinerary();
}

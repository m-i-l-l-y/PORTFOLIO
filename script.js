// 🔧 Step 1: Handle Form Submission
const form = document.getElementById("testimonial-form");

form.addEventListener("submit", async function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const position = document.getElementById("position").value.trim();
  let rating = parseInt(document.getElementById("rating").value, 10);
  const testimonial = document.getElementById("testimonial").value.trim();

  // ✅ Ensure rating is between 1–5
  rating = Math.min(Math.max(rating, 1), 5);

  if (name && position && testimonial) {
    const response = await fetch("http://localhost/cms_projects/wordpress/wp-json/wp/v2/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa("yourusername:yourapplicationpassword") // replace with your WP username + generated Application Password
      },
      body: JSON.stringify({
        author_name: name,
        content: testimonial,
        meta: {
          position: position,
          rating: rating
        },
        post: 1 // ID of the WordPress post/page where testimonials attach
      })
    });

    if (response.ok) {
      alert("Testimonial submitted successfully!");
      form.reset();
      loadTestimonials(); // refresh testimonials after submission
    } else {
      alert("Error submitting testimonial.");
    }
  } else {
    alert("Please fill in all fields before submitting.");
  }
});

// 🔧 Step 2: Load Testimonials from WordPress
async function loadTestimonials() {
  const res = await fetch("http://localhost/cms_projects/wordpress/wp-json/wp/v2/comments?post=1");
  const comments = await res.json();

  const testimonialsRow = document.querySelector("#testimonials .row");
  testimonialsRow.innerHTML = "";

  comments.forEach(c => {
    const col = document.createElement("div");
    col.className = "col-lg-3 col-md-6 mb-4";
    col.innerHTML = `
      <div class="card shadow-sm border-0 h-100">
        <img src="https://via.placeholder.com/150x100?text=${encodeURIComponent(c.author_name)}" 
             class="card-img-top" alt="${c.author_name}">
        <div class="card-body">
          <p class="card-text">"${c.content.rendered}"</p>
          <div class="text-warning mb-2">
            ${"★".repeat(c.meta?.rating || 5)}${"☆".repeat(5 - (c.meta?.rating || 5))}
          </div>
          <h6 class="card-subtitle text-muted mt-3">${c.author_name}, ${c.meta?.position || ""}</h6>
        </div>
      </div>
    `;
    testimonialsRow.appendChild(col);
  });
}

// Load testimonials on page load
loadTestimonials();
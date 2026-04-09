// Handle testimonial form submission
const alertBox = document.getElementById("testimonial-alert");

document.getElementById("testimonial-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const position = document.getElementById("position").value;
  const rating = document.getElementById("rating").value;
  const testimonial = document.getElementById("testimonial").value;

  try {
    const res = await fetch("http://localhost/cms_projects/wordpress/wp-json/wp/v2/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa("yourusername:yourapplicationpassword")
      },
      body: JSON.stringify({
        author_name: name,
        content: testimonial,
        meta: {
          position: position,
          rating: rating
        },
        post: 8 // Testimonials page ID
      })
    });

    if (res.ok) {
      alertBox.innerHTML = `
        <div class="alert alert-success mt-3" role="alert">
          Thank you! Your testimonial is live.
        </div>
      `;
      document.getElementById("testimonial-form").reset();
      loadTestimonials();
    } else {
      alertBox.innerHTML = `
        <div class="alert alert-danger mt-3" role="alert">
          Oops! Something went wrong. Please try again.
        </div>
      `;
    }
  } catch (error) {
    console.error(error);
    alertBox.innerHTML = `
      <div class="alert alert-danger mt-3" role="alert">
        Error submitting testimonial.
      </div>
    `;
  }
});

// Load testimonials and render as Bootstrap cards
async function loadTestimonials() {
  try {
    const res = await fetch("http://localhost/cms_projects/wordpress/wp-json/wp/v2/comments?post=8");
    const testimonials = await res.json();

    const container = document.getElementById("testimonials-container");
    container.innerHTML = testimonials.map(t => renderTestimonialCard(t)).join('');
  } catch (error) {
    console.error("Error loading testimonials:", error);
  }
}

// Render a single testimonial card
function renderTestimonialCard(t) {
  const stars = '★'.repeat(t.meta?.rating || 0);
  return `
    <div class="col-md-6">
      <div class="card mb-3 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${t.author_name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${t.meta?.position || ''}</h6>
          <p class="card-text">${t.content.rendered}</p>
          <div class="text-warning">${stars}</div>
        </div>
      </div>
    </div>
  `;
}

// Load testimonials on page load
document.addEventListener("DOMContentLoaded", loadTestimonials);
// --- Function to format currency (assuming INR) ---
const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
};

// --- Function to render a single course card HTML ---
const renderCourseCard = (course) => {
    // Sets the starting visibility class based on the JSON data
    const visibilityClass = course.initial_visibility === 'hidden' ? 'hidden-course' : 'visible-course';
    
    return `
        <div class="course-card-v2 course-item ${visibilityClass}" 
             data-order="${course.order}" 
             data-discount="${course.discount_rate}">
            <img 
                src="${course.image}" 
                alt="${course.name}" 
                loading="lazy" 
                class="card-image"
            >
            <div class="card-content">
                <h4>${course.name}</h4>
                <span class="discount-badge">${course.discount_rate}% off</span>
                <div class="price-area">
                    <span class="price-original">${formatCurrency(course.old_rate)}</span>
                    <span class="price-discounted">${formatCurrency(course.new_rate)}</span>
                </div>
            </div>
        </div>
    `;
};

// --- Main function to fetch and render courses ---
const loadAndRenderCourses = async () => {
    const courseListContainer = document.getElementById('course-list');
    if (!courseListContainer) return;

    try {
        const response = await fetch('courses.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let courses = await response.json();

        // 1. Sort the courses based on the 'order' property
        courses.sort((a, b) => a.order - b.order);

        // 2. Generate and inject the HTML
        const coursesHtml = courses.map(renderCourseCard).join('');
        courseListContainer.innerHTML = coursesHtml;

    } catch (error) {
        console.error('Failed to load courses:', error);
        courseListContainer.innerHTML = '<p style="color:red; text-align:center;">Failed to load recommended courses. Please try again later.</p>';
    }
};

// --- Course Toggle Logic (Updated for dynamic data) ---
function toggleCourseVisibility() {
    const courses = document.querySelectorAll('#course-list .course-item');
    const toggleButton = document.getElementById('toggle-courses-btn');
    
    // Check state based on the button text
    let isHidden = toggleButton.textContent.includes('View All');

    // Courses with order 1, 2, 3, 4 (index 0-3) are always visible.
    const toggleThresholdIndex = 4;

    if (isHidden) {
        // EXPAND: Show all courses
        for (let i = toggleThresholdIndex; i < courses.length; i++) {
            // Use a slight delay for a nice staggered animation effect
            setTimeout(() => {
                courses[i].classList.remove('hidden-course');
                courses[i].classList.add('visible-course');
            }, 100 * (i - toggleThresholdIndex)); 
        }
        toggleButton.textContent = 'Show Less';
    } else {
        // COLLAPSE: Hide courses
        for (let i = courses.length - 1; i >= toggleThresholdIndex; i--) {
            // Use a slight delay for a nice staggered animation effect
            setTimeout(() => {
                courses[i].classList.remove('visible-course');
                courses[i].classList.add('hidden-course');
            }, 100 * (courses.length - 1 - i));
        }
        
        // Scroll back to the top of the course list after hiding
        setTimeout(() => {
            document.getElementById('course-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500); 
        
        toggleButton.textContent = 'View All Courses';
    }
}

// Ensure the main course loader runs when the document is ready
document.addEventListener('DOMContentLoaded', loadAndRenderCourses);

// Attach the toggle function to the window object so it can be called from HTML
window.toggleCourseVisibility = toggleCourseVisibility;
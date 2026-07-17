/* ==========================================
   GALERI REUNI SMPN 1 UNGARAN 1998
   app.js
========================================== */

const API_URL = "https://spensa-gallery.spensa98smpn1ungaran.workers.dev";

const gallery = document.getElementById("gallery");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");

const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewerImage");
const caption = document.getElementById("caption");

const searchInput = document.getElementById("searchInput");
const photoCount = document.getElementById("photoCount");

const closeViewer = document.getElementById("closeViewer");
const nextPhoto = document.getElementById("nextPhoto");
const prevPhoto = document.getElementById("prevPhoto");

const topButton = document.getElementById("topButton");

let photos = [];
let filtered = [];
let current = 0;

/* ==========================================
   LOAD GALLERY
========================================== */

loadGallery();

async function loadGallery() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("HTTP Error : " + response.status);
        }

        photos = await response.json();

        filtered = [...photos];

        renderGallery(filtered);

        loading.style.display = "none";

    } catch (error) {

        console.error(error);

        loading.innerHTML = "Gagal memuat galeri.";

    }

}

/* ==========================================
   RENDER
========================================== */

function renderGallery(list) {

    gallery.innerHTML = "";

    photoCount.textContent = list.length;

    if (list.length === 0) {

        emptyState.style.display = "block";

        return;

    }

    emptyState.style.display = "none";

    list.forEach((photo, index) => {

        const card = document.createElement("div");

        card.className = "photo-card";

        card.innerHTML = `
            <img
                src="${photo.thumb}"
                alt="${photo.name}"
                loading="lazy"
                data-index="${index}">
        `;

        gallery.appendChild(card);

    });

    bindClick();

}

/* ==========================================
   CLICK PHOTO
========================================== */

function bindClick() {

    document.querySelectorAll(".photo-card img").forEach(img => {

        img.onclick = () => {

            current = parseInt(img.dataset.index);

            openViewer();

        };

    });

}

/* ==========================================
   OPEN VIEWER
========================================== */

function openViewer() {

    viewer.classList.add("show");

    viewerImage.src = filtered[current].full;

    caption.textContent = filtered[current].name;

    document.body.style.overflow = "hidden";

    preloadNext();

}

/* ==========================================
   CLOSE VIEWER
========================================== */

function closeLightbox() {

    viewer.classList.remove("show");

    document.body.style.overflow = "";

}

/* ==========================================
   NEXT
========================================== */

function next() {

    current++;

    if (current >= filtered.length) {

        current = 0;

    }

    openViewer();

}

/* ==========================================
   PREVIOUS
========================================== */

function prev() {

    current--;

    if (current < 0) {

        current = filtered.length - 1;

    }

    openViewer();

}

/* ==========================================
   PRELOAD NEXT IMAGE
========================================== */

function preloadNext() {

    if (filtered.length === 0) return;

    const nextIndex = (current + 1) % filtered.length;

    const img = new Image();

    img.src = filtered[nextIndex].full;

}

/* ==========================================
   SEARCH
========================================== */

searchInput.addEventListener("input", () => {

    const keyword = searchInput.value.toLowerCase();

    filtered = photos.filter(photo =>

        photo.name.toLowerCase().includes(keyword)

    );

    renderGallery(filtered);

});

/* ==========================================
   BUTTONS
========================================== */

closeViewer.onclick = closeLightbox;

nextPhoto.onclick = next;

prevPhoto.onclick = prev;

/* ==========================================
   KEYBOARD
========================================== */

document.addEventListener("keydown", (e) => {

    if (!viewer.classList.contains("show")) return;

    if (e.key === "Escape") {

        closeLightbox();

    }

    if (e.key === "ArrowRight") {

        next();

    }

    if (e.key === "ArrowLeft") {

        prev();

    }

});

/* ==========================================
   CLICK OUTSIDE
========================================== */

viewer.onclick = (e) => {

    if (e.target === viewer) {

        closeLightbox();

    }

};

/* ==========================================
   TOUCH SWIPE
========================================== */

let startX = 0;

viewer.addEventListener("touchstart", (e) => {

    startX = e.touches[0].clientX;

});

viewer.addEventListener("touchend", (e) => {

    const endX = e.changedTouches[0].clientX;

    const diff = startX - endX;

    if (diff > 60) {

        next();

    }

    if (diff < -60) {

        prev();

    }

});

/* ==========================================
   BACK TO TOP
========================================== */

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        topButton.classList.add("show");

    } else {

        topButton.classList.remove("show");

    }

});

topButton.onclick = () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};
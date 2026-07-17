/* ==========================================
   SPENSA 98 PHOTO ARCHIVE
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

const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");

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
            throw new Error("HTTP " + response.status);
        }

        photos = await response.json();

        filtered = [...photos];

        renderGallery(filtered);

        loading.style.display = "none";

    } catch (err) {

        console.error(err);

        loading.innerHTML = "<p>❌ Gagal memuat galeri.</p>";

    }

}

/* ==========================================
   RENDER GALLERY
========================================== */

function renderGallery(list) {

    gallery.innerHTML = "";

    photoCount.textContent = list.length;

    if (!list.length) {

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
                draggable="false"
                data-index="${index}">
        `;

        gallery.appendChild(card);

    });

    document.querySelectorAll(".photo-card img").forEach(img => {

        img.addEventListener("click", () => {

            current = Number(img.dataset.index);

            openViewer();

        });

    });

}

/* ==========================================
   OPEN VIEWER
========================================== */

function openViewer() {

    const photo = filtered[current];

    const preload = new Image();

    preload.onload = () => {

        viewerImage.src = preload.src;

    };

    preload.src = photo.full;

    caption.textContent = photo.name;

    viewer.classList.add("show");

    document.body.style.overflow = "hidden";

    preloadNext();

}

/* ==========================================
   CLOSE
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
   PRELOAD
========================================== */

function preloadNext() {

    if (!filtered.length) return;

    const nextIndex = (current + 1) % filtered.length;

    const img = new Image();

    img.src = filtered[nextIndex].full;

}

/* ==========================================
   SEARCH
========================================== */

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const keyword = searchInput.value.toLowerCase();

        filtered = photos.filter(photo =>
            photo.name.toLowerCase().includes(keyword)
        );

        renderGallery(filtered);

    });

}

/* ==========================================
   DOWNLOAD
========================================== */

if (downloadBtn) {

    downloadBtn.onclick = () => {

        window.open(filtered[current].full, "_blank");

    };

}

/* ==========================================
   SHARE
========================================== */

if (shareBtn) {

    shareBtn.onclick = async () => {

        if (!navigator.share) return;

        try {

            await navigator.share({

                title: filtered[current].name,

                text: "SPENSA 98 Photo Archive",

                url: filtered[current].full

            });

        } catch (e) {}

    };

}

/* ==========================================
   BUTTONS
========================================== */

closeViewer.onclick = closeLightbox;

nextPhoto.onclick = next;

prevPhoto.onclick = prev;

/* ==========================================
   KEYBOARD
========================================== */

document.addEventListener("keydown", e => {

    if (!viewer.classList.contains("show")) return;

    switch (e.key) {

        case "Escape":
            closeLightbox();
            break;

        case "ArrowRight":
            next();
            break;

        case "ArrowLeft":
            prev();
            break;

    }

});

/* ==========================================
   CLICK OUTSIDE
========================================== */

viewer.addEventListener("click", e => {

    if (e.target === viewer) {

        closeLightbox();

    }

});

/* ==========================================
   SWIPE
========================================== */

let startX = 0;

viewer.addEventListener("touchstart", e => {

    startX = e.touches[0].clientX;

});

viewer.addEventListener("touchend", e => {

    const diff = startX - e.changedTouches[0].clientX;

    if (diff > 60) {

        next();

    } else if (diff < -60) {

        prev();

    }

});

/* ==========================================
   SCROLL TOP
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
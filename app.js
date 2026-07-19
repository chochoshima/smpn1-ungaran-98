/* ==========================================
   GALERI REUNI SMPN 1 UNGARAN 1998
   app.js
========================================== */

const API_URL = "https://spensa-gallery.spensa98smpn1ungaran.workers.dev";

/* ==========================================
   ELEMENT
========================================== */

const gallery = document.getElementById("gallery");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");

const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewerImage");
const caption = document.getElementById("caption");
const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");
const photoCount = document.getElementById("photoCount");

const closeViewer = document.getElementById("closeViewer");
const nextPhoto = document.getElementById("nextPhoto");
const prevPhoto = document.getElementById("prevPhoto");

const topButton = document.getElementById("topButton");

/* ==========================================
   DATA
========================================== */

let photos = [];
let current = 0;

/* ==========================================
   LOAD GALLERY
========================================== */

let accessCode = sessionStorage.getItem("accessCode");

if (!accessCode) {

    accessCode = prompt("Masukkan Kode Akses Alumni");

    if (!accessCode) {

        document.body.innerHTML = "<h2 style='text-align:center;margin-top:80px'>Akses dibatalkan</h2>";

        throw new Error("Akses dibatalkan");

    }

    sessionStorage.setItem("accessCode", accessCode);

}

loadGallery();

async function loadGallery() {

    try {

        const response = await fetch(API_URL, {
    headers: {
        "x-access-code": accessCode
    }
});

if (response.status === 401) {

    sessionStorage.removeItem("accessCode");

    alert("Kode akses salah!");

    location.reload();

    return;

        if (!response.ok) {
            throw new Error("HTTP Error : " + response.status);
        }

        photos = await response.json();

        renderGallery();

        loading.style.display = "none";

    } catch (error) {

        console.error(error);

        loading.innerHTML = "<p>Gagal memuat galeri.</p>";

    }

}

/* ==========================================
   BIND CLICK
========================================== */

function bindClick() {

    gallery.querySelectorAll("img").forEach(img => {

        img.onclick = () => {

            current = Number(img.dataset.index);

            openViewer();

        };

    });

}

/* ==========================================
   RENDER GALLERY
========================================== */

function renderGallery() {

    gallery.innerHTML = "";

    photoCount.textContent = photos.length;

    if (photos.length === 0) {

        emptyState.style.display = "block";

        return;

    }

    emptyState.style.display = "none";

    photos.forEach((photo, index) => {

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

function openViewer() {

    viewer.classList.add("show");

    viewerImage.src = photos[current].full;

    caption.textContent = photos[current].name;

    document.body.style.overflow = "hidden";

    preloadNext();

}

/* ==========================================
   OPEN VIEWER
========================================== */

function openViewer(){

    const photo = photos[current];

    if(!photo) return;

    viewerImage.src = "";

    viewerImage.src = photo.full;

    caption.textContent = photo.name;

    viewer.classList.add("show");

    document.body.style.overflow = "hidden";

    preloadNext();

}

/* ==========================================
   CLOSE VIEWER
========================================== */

function closeLightbox(){

    viewer.classList.remove("show");

    viewerImage.src = "";

    document.body.style.overflow = "";

}

/* ==========================================
   NEXT PHOTO
========================================== */

function next() {

    current++;

    if (current >= photos.length) {

        current = 0;

    }

    openViewer();

}

/* ==========================================
   PREVIOUS PHOTO
========================================== */

function prev() {

    current--;

    if (current < 0) {

        current = photos.length - 1;

    }

    openViewer();

}

/* ==========================================
   PRELOAD NEXT IMAGE
========================================== */

function preloadNext() {

    if (photos.length === 0) return;

    const nextIndex = (current + 1) % photos.length;

    const img = new Image();

    img.src = photos[nextIndex].full;

}

/* ==========================================
   BUTTON
========================================== */

closeViewer.onclick = closeLightbox;

nextPhoto.onclick = next;

prevPhoto.onclick = prev;

/* ==========================================
   KEYBOARD
========================================== */

document.addEventListener("keydown", (e) => {

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

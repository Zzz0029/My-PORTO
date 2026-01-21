// ThreeJS Scene Setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// Wait for DOM to load if script is in head, but we usually put it at end of body.
// Just in case, we check if container exists or wait.
const container = document.getElementById('canvas-container');
if (container) {
    container.appendChild(renderer.domElement);
}

// Particle System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500; // Reduced for cleaner look

const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    // Spread them out more for a vast data-space feel
    posArray[i] = (Math.random() - 0.5) * 18;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Create Cyber Texture
const canvas = document.createElement('canvas');
canvas.width = 32; canvas.height = 32;
const ctx = canvas.getContext('2d');
ctx.beginPath();
ctx.arc(16, 16, 10, 0, Math.PI * 2);
ctx.fillStyle = '#ffffff';
ctx.fill();
const particleTexture = new THREE.CanvasTexture(canvas);

// Material
const material = new THREE.PointsMaterial({
    size: 0.035,
    map: particleTexture,
    transparent: true,
    color: 0x00f0ff,
    blending: THREE.AdditiveBlending,
    opacity: 0.8
});

// Mesh
const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

// Secondary System (Purple Data Streams)
const secondaryGeo = new THREE.BufferGeometry();
const secCount = 500;
const secPos = new Float32Array(secCount * 3);
for (let i = 0; i < secCount * 3; i++) secPos[i] = (Math.random() - 0.5) * 20;
secondaryGeo.setAttribute('position', new THREE.BufferAttribute(secPos, 3));
const secMat = new THREE.PointsMaterial({
    size: 0.05,
    map: particleTexture,
    transparent: true,
    color: 0xb000ff,
    blending: THREE.AdditiveBlending
});
const secMesh = new THREE.Points(secondaryGeo, secMat);
scene.add(secMesh);

camera.position.z = 3;

// Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Rotation
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;

    secMesh.rotation.y -= 0.0015;
    secMesh.rotation.x -= 0.001;

    // Mouse ease
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

    renderer.render(scene, camera);
}

animate();

// Responsive Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;

        // Simulation of sending
        btn.innerText = 'ENCRYPTING & SENDING...';
        btn.classList.add('opacity-75');

        setTimeout(() => {
            document.getElementById('formStatus').classList.remove('hidden');
            btn.innerText = 'TRANSMISSION COMPLETE';
            btn.classList.remove('bg-cyber-blue', 'text-black');
            btn.classList.add('bg-matrix-green', 'text-black');
            e.target.reset();

            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.remove('bg-matrix-green', 'opacity-75');
                btn.classList.add('bg-cyber-blue');
                document.getElementById('formStatus').classList.add('hidden');
            }, 3000);
        }, 1500);
    });
}

// --- DYNAMIC CONTENT LOADING ---

document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioData();
});

async function loadPortfolioData() {
    try {
        const res = await fetch('/api/data');
        const data = await res.json();

        renderHOF(data.hof);
        renderCerts(data.certifications);
        if (data.about) renderAbout(data.about);
    } catch (err) {
        console.error('Error loading data:', err);
    }
}

function renderAbout(data) {
    const bio = document.getElementById('about-bio');
    const expertise = document.getElementById('about-expertise');
    const mission = document.getElementById('about-mission');
    const status = document.getElementById('about-status');

    if (bio) {
        bio.innerHTML = data.bio;
        bio.classList.remove('animate-pulse');
    }
    if (expertise) expertise.innerText = data.expertise;
    if (mission) mission.innerText = data.mission;
    if (status) status.innerText = data.status;
}

function renderHOF(items) {
    const container = document.getElementById('hof-container');
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = '<div class="col-span-3 text-center text-gray-500 font-mono">NO DATA AVAILABLE</div>';
        return;
    }

    container.innerHTML = items.map((item, index) => {
        // Determine border color based on index or random for variety
        const colors = ['cyber-blue', 'cyber-purple', 'pink-500'];
        const color = colors[index % colors.length];
        // Simple icon logic
        let icon = '🏆';
        if (item.company && typeof item.company === 'string') {
            if (item.company.toLowerCase().includes('google')) icon = '🔍';
            else if (item.company.toLowerCase().includes('meta')) icon = '👤';
            else if (item.company.toLowerCase().includes('apple')) icon = '🍎';
        }

        return `
          <div class="group glass-panel p-8 rounded-xl hover:bg-${color}/5 transition-all duration-500 hover:scale-[1.02] border-l-4 border-l-transparent hover:border-l-${color}">
            <div class="flex justify-between items-start mb-6">
              <div class="text-5xl grayscale group-hover:grayscale-0 transition-all">${icon}</div>
              <div class="text-${color} font-mono text-xl">${item.year}</div>
            </div>
            <h3 class="text-3xl font-cyber font-bold text-white mb-2 group-hover:text-${color} transition-colors">
              ${item.company.toUpperCase()}
            </h3>
            <p class="text-gray-400 font-tech mb-4">${item.platform} • ${item.url ? `<a href="${item.url}" target="_blank" class="hover:text-white underline">Verify</a>` : 'Verified'}</p>
            <div class="text-2xl font-mono text-matrix-green">${item.reward}</div>
          </div>
        `;
    }).join('');
}

function renderCerts(items) {
    const container = document.getElementById('cert-container');
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = '<div class="w-full text-center text-gray-500 font-mono">NO CERTIFICATES AVAILABLE</div>';
        return;
    }

    container.innerHTML = items.map((item, index) => {
        const colors = ['cyber-blue', 'cyber-purple', 'matrix-green'];
        const color = colors[index % colors.length];
        const bgGradient = `from-${color}/10`;
        const borderColor = `border-${color}/20`;
        const textColor = `text-${color}`;
        const groupHoverText = `group-hover:text-${color}`;

        // If image exists, use it as background or content
        // If image exists, use it as background or content
        const imageContent = item.image
            ? `<img src="${item.image}" class="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" alt="${item.title}">`
            : `<span class="text-4xl font-black ${textColor}/50 ${groupHoverText} transition-colors">${item.issuer.substring(0, 4).toUpperCase()}</span>`;

        return `
          <div class="flex-shrink-0 w-80 snap-center glass-panel rounded-xl overflow-hidden group">
            <div class="h-48 bg-black/50 flex items-center justify-center border-b ${borderColor} relative overflow-hidden">
              ${imageContent}
            </div>
            <div class="p-6">
              <div class="font-cyber font-bold text-white text-xl truncate" title="${item.title}">${item.title}</div>
              <div class="text-sm text-gray-400 font-mono mt-1 flex justify-between">
                <span>${item.issuer}</span>
                <span>${item.date}</span>
              </div>
              <div class="mt-2 text-xs text-gray-500 font-tech line-clamp-2">${item.description}</div>
            </div>
          </div>
        `;
    }).join('');
}


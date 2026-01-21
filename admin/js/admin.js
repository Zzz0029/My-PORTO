
// Check Auth
(async () => {
    try {
        const res = await fetch('/api/check-auth');
        const data = await res.json();
        if (!data.authenticated) {
            window.location.href = '/admin/login.html';
        } else {
            loadData();
        }
    } catch (e) {
        window.location.href = '/admin/login.html';
    }
})();

// Logout
async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/admin/login.html';
}

// Global Types
let allData = { certifications: [], hof: [] };

// DOM Elements
const certTable = document.getElementById('certTableBody');
const hofTable = document.getElementById('hofTableBody');
const modal = document.getElementById('modal');
const form = document.getElementById('entryForm');

// Load Data
async function loadData() {
    const res = await fetch('/api/data');
    allData = await res.json();
    renderCerts();
    renderHof();
    if (allData.about) renderAbout(allData.about);
    if (allData.stats) renderStats(allData.stats);
}

// Render Functions

function renderAbout(data) {
    document.getElementById('edit-bio').value = data.bio || '';
    document.getElementById('edit-expertise').value = data.expertise || '';
    document.getElementById('edit-mission').value = data.mission || '';
    document.getElementById('edit-status').value = data.status || '';
}

function renderStats(data) {
    document.getElementById('edit-bugs').value = data.critical_bugs || '';
    document.getElementById('edit-bounties').value = data.total_bounties || '';
    document.getElementById('edit-companies').value = data.top_companies || '';
}

async function saveAbout() {
    const aboutUpdates = {
        bio: document.getElementById('edit-bio').value,
        expertise: document.getElementById('edit-expertise').value,
        mission: document.getElementById('edit-mission').value,
        status: document.getElementById('edit-status').value
    };

    const statsUpdates = {
        critical_bugs: document.getElementById('edit-bugs').value,
        total_bounties: document.getElementById('edit-bounties').value,
        top_companies: document.getElementById('edit-companies').value
    };

    try {
        const [resAbout, resStats] = await Promise.all([
            fetch('/api/data/about', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aboutUpdates)
            }),
            fetch('/api/data/stats', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(statsUpdates)
            })
        ]);

        if (resAbout.ok && resStats.ok) {
            alert('System Info & Stats Updated Successfully');
            loadData();
        } else {
            alert('Error updating system info');
        }
    } catch (err) {
        console.error(err);
        alert('Error updating info');
    }
}


// Tab Switching
function switchTab(tab) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('text-cyber-blue', 'border-l-2', 'bg-cyber-blue/10')); // Clean up active states
    document.getElementById(`nav-${tab}`).classList.add('active');

    document.getElementById('section-certs').classList.add('hidden');
    document.getElementById('section-hof').classList.add('hidden');
    document.getElementById('section-about').classList.add('hidden');
    document.getElementById(`section-${tab}`).classList.remove('hidden');
}

// Render Functions
function renderCerts() {
    certTable.innerHTML = allData.certifications.map((item, index) => `
        <tr class="table-row border-b border-gray-800 text-gray-300">
            <td class="p-4 font-bold text-white">${item.title}</td>
            <td class="p-4">${item.issuer}</td>
            <td class="p-4 font-mono text-sm">${item.date}</td>
            <td class="p-4"><span class="px-2 py-1 bg-cyber-blue/10 text-cyber-blue rounded text-xs border border-cyber-blue/30">${item.category}</span></td>
            <td class="p-4 flex gap-2">
                <button onclick="moveItem('certifications', '${item.id}', -1)" class="text-gray-400 hover:text-white" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>⬆️</button>
                <button onclick="moveItem('certifications', '${item.id}', 1)" class="text-gray-400 hover:text-white" ${index === allData.certifications.length - 1 ? 'disabled style="opacity:0.3"' : ''}>⬇️</button>
                <div class="w-px bg-gray-700 mx-2"></div>
                <button onclick="editItem('certifications', '${item.id}')" class="text-cyber-blue hover:text-white">EDIT</button>
                <button onclick="deleteItem('certifications', '${item.id}')" class="text-red-500 hover:text-white">DEL</button>
            </td>
        </tr>
    `).join('');
}

function renderHof() {
    hofTable.innerHTML = allData.hof.map((item, index) => `
        <tr class="table-row border-b border-gray-800 text-gray-300">
            <td class="p-4 font-bold text-white">${item.company}</td>
            <td class="p-4">${item.platform || '-'}</td>
            <td class="p-4 font-mono text-sm">${item.year}</td>
            <td class="p-4 font-mono text-sm text-matrix-green">${item.reward}</td>
            <td class="p-4 flex gap-2">
                <button onclick="moveItem('hof', '${item.id}', -1)" class="text-gray-400 hover:text-white" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>⬆️</button>
                <button onclick="moveItem('hof', '${item.id}', 1)" class="text-gray-400 hover:text-white" ${index === allData.hof.length - 1 ? 'disabled style="opacity:0.3"' : ''}>⬇️</button>
                <div class="w-px bg-gray-700 mx-2"></div>
                <button onclick="editItem('hof', '${item.id}')" class="text-cyber-purple hover:text-white">EDIT</button>
                <button onclick="deleteItem('hof', '${item.id}')" class="text-red-500 hover:text-white">DEL</button>
            </td>
        </tr>
    `).join('');
}

// ... (Tab Switching and Modal Logic remain same)

// Reorder Logic
async function moveItem(type, id, direction) {
    const list = allData[type];
    const index = list.findIndex(i => i.id === id);

    if (index === -1) return;
    if (direction === -1 && index === 0) return; // Can't move up
    if (direction === 1 && index === list.length - 1) return; // Can't move down

    // Swap
    const temp = list[index];
    list[index] = list[index + direction];
    list[index + direction] = temp;

    // Save
    await saveOrder(type);

    // Re-render
    if (type === 'certifications') renderCerts();
    else renderHof();
}

async function saveOrder(type) {
    const list = allData[type];
    const order = list.map(i => i.id);

    try {
        await fetch(`/api/reorder/${type}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order })
        });
    } catch (err) {
        console.error('Failed to save order', err);
    }
}



// Modal Logic
function openModal(type, item = null) {
    modal.classList.remove('hidden');
    const isEdit = !!item;
    const isCert = type === 'cert' || type === 'certifications';

    document.getElementById('modalTitle').innerText = isEdit ? 'EDIT ENTRY' : 'ADD ENTRY';
    document.getElementById('entryType').value = isCert ? 'certifications' : 'hof';
    document.getElementById('entryId').value = item ? item.id : '';

    const fields = document.getElementById('modalFields');

    if (isCert) {
        fields.innerHTML = `
            <input type="text" name="title" placeholder="Title (e.g. Certified Pentester)" value="${item?.title || ''}" class="w-full bg-black/50 border border-gray-600 rounded p-3 text-white mb-3" required>
            <input type="text" name="issuer" placeholder="Issuer (e.g. EC-Council)" value="${item?.issuer || ''}" class="w-full bg-black/50 border border-gray-600 rounded p-3 text-white mb-3" required>
            <input type="text" name="date" placeholder="Date (e.g. Jan 2024)" value="${item?.date || ''}" class="w-full bg-black/50 border border-gray-600 rounded p-3 text-white mb-3" required>
            <select name="category" class="w-full bg-black/50 border border-gray-600 rounded p-3 text-white mb-3">
                <option value="Indonesia" ${item?.category === 'Indonesia' ? 'selected' : ''}>Indonesia</option>
                <option value="Overseas" ${item?.category === 'Overseas' ? 'selected' : ''}>Overseas</option>
            </select>
            <textarea name="description" placeholder="Description" class="w-full bg-black/50 border border-gray-600 rounded p-3 text-white mb-3">${item?.description || ''}</textarea>
            <label class="block text-sm text-gray-400 mb-1">Image (Optional)</label>
            <input type="file" name="image" class="w-full text-gray-400 text-sm">
        `;
    } else {
        fields.innerHTML = `
            <input type="text" name="company" placeholder="Company (e.g. NASA)" value="${item?.company || ''}" class="w-full bg-black/50 border border-gray-600 rounded p-3 text-white mb-3" required>
            <input type="text" name="platform" placeholder="Platform (e.g. Bugcrowd)" value="${item?.platform || ''}" class="w-full bg-black/50 border border-gray-600 rounded p-3 text-white mb-3">
            <input type="text" name="year" placeholder="Year" value="${item?.year || ''}" class="w-full bg-black/50 border border-gray-600 rounded p-3 text-white mb-3" required>
            <input type="text" name="reward" placeholder="Reward (e.g. $500 or Swag)" value="${item?.reward || ''}" class="w-full bg-black/50 border border-gray-600 rounded p-3 text-white mb-3" required>
            <input type="text" name="url" placeholder="Validation URL" value="${item?.url || ''}" class="w-full bg-black/50 border border-gray-600 rounded p-3 text-white mb-3">
            <label class="block text-sm text-gray-400 mb-1">Proof Image (Optional)</label>
            <input type="file" name="image" class="w-full text-gray-400 text-sm">
        `;
    }
}

function closeModal() {
    modal.classList.add('hidden');
}

function editItem(type, id) {
    const list = allData[type];
    const item = list.find(i => i.id === id);
    openModal(type, item);
}

async function deleteItem(type, id) {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    await fetch(`/api/data/${type}/${id}`, { method: 'DELETE' });
    loadData();
}

// Form Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('entryType').value;
    const id = document.getElementById('entryId').value;
    const formData = new FormData(form);

    // Remove empty id
    formData.delete('entryId');
    formData.delete('entryType');

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/data/${type}/${id}` : `/api/data/${type}`;

    try {
        const res = await fetch(url, {
            method: method,
            body: formData // allow FormData to handle file uploads
        });

        if (res.ok) {
            closeModal();
            loadData();
        } else {
            alert('Error saving data');
        }
    } catch (err) {
        console.error(err);
        alert('Error saving data');
    }
});

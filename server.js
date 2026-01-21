const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { kv } = require('@vercel/kv');
const { put } = require('@vercel/blob');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public')); // Serve assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));

// Admin Panel Static Files
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// File Upload Configuration
const storage = process.env.VERCEL
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = './assets/uploads';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });

const upload = multer({ storage: storage });

// Data File Path
const DATA_FILE = path.join(__dirname, 'data', 'data.json');

// Helper: Read Data
// Helper: Read Data
const readData = async () => {
    if (process.env.VERCEL) {
        try {
            let data = await kv.get('portfolio_data');

            // IF KV IS EMPTY, SEED FROM LOCAL FILE
            if (!data) {
                console.log('KV is empty. Seeding from local data.json...');
                try {
                    const localData = fs.readFileSync(path.join(__dirname, 'data', 'data.json'), 'utf8');
                    data = JSON.parse(localData);
                    await kv.set('portfolio_data', data);
                    console.log('KV seeded successfully.');
                } catch (seedErr) {
                    console.error('Error seeding KV:', seedErr);
                    // Fallback to empty structure if seeding fails
                    data = { certifications: [], hof: [], about: {}, stats: {} };
                }
            }

            return data || { certifications: [], hof: [], about: {}, stats: {} };
        } catch (err) {
            console.error('KV Read Error:', err);
            return { certifications: [], hof: [], about: {}, stats: {} };
        }
    } else {
        try {
            if (!fs.existsSync(DATA_FILE)) {
                return { certifications: [], hof: [], about: {}, stats: {} };
            }
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            return { certifications: [], hof: [], about: {}, stats: {} };
        }
    }
};

// Helper: Write Data
const writeData = async (data) => {
    if (process.env.VERCEL) {
        await kv.set('portfolio_data', data);
    } else {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    }
};

// Auth Middleware
const authenticate = (req, res, next) => {
    const { token } = req.cookies;
    // Simple mock token validation
    if (token === 'admin-auth-token-123') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Routes

// Serve Index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'wonyoung' && password === 'wony123') {
        res.cookie('token', 'admin-auth-token-123', { httpOnly: true });
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
});

// Check Auth
app.get('/api/check-auth', (req, res) => {
    const { token } = req.cookies;
    if (token === 'admin-auth-token-123') {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});

// Get All Data
app.get('/api/data', async (req, res) => {
    const data = await readData();
    res.json(data);
});

// Add Item
app.post('/api/data/:type', authenticate, upload.single('image'), async (req, res) => {
    const { type } = req.params;
    const item = req.body;
    const data = await readData();

    if (req.file) {
        if (process.env.VERCEL) {
            try {
                const blob = await put(req.file.originalname, req.file.buffer, { access: 'public' });
                item.image = blob.url;
            } catch (err) {
                console.error('Blob Upload Error:', err);
                return res.status(500).json({ message: 'Error uploading image' });
            }
        } else {
            item.image = `assets/uploads/${req.file.filename}`;
        }
    }

    item.id = Date.now().toString();

    if (type === 'certifications') {
        if (!data.certifications) data.certifications = [];
        data.certifications.push(item);
    } else if (type === 'hof') {
        if (!data.hof) data.hof = [];
        data.hof.push(item);
    } else {
        return res.status(400).json({ message: 'Invalid type' });
    }

    await writeData(data);
    res.json({ success: true, item });
});

// Update Item Order
app.put('/api/reorder/:type', authenticate, async (req, res) => {
    const { type } = req.params;
    const { order } = req.body; // Array of IDs in new order
    const data = await readData();

    if (!order || !Array.isArray(order)) {
        return res.status(400).json({ message: 'Invalid order data' });
    }

    if (type === 'certifications') {
        if (!data.certifications) data.certifications = [];
        // Create a map for O(1) lookup
        const codeMap = new Map(data.certifications.map(item => [item.id, item]));
        // Rebuild array based on ID order, filtering out any invalid IDs
        const newOrder = order.map(id => codeMap.get(id)).filter(item => item !== undefined);
        // Append any items that might have been missed (safety net)
        const currentIds = new Set(newOrder.map(item => item.id));
        data.certifications.forEach(item => {
            if (!currentIds.has(item.id)) {
                newOrder.push(item);
            }
        });
        data.certifications = newOrder;
    } else if (type === 'hof') {
        if (!data.hof) data.hof = [];
        const codeMap = new Map(data.hof.map(item => [item.id, item]));
        const newOrder = order.map(id => codeMap.get(id)).filter(item => item !== undefined);
        const currentIds = new Set(newOrder.map(item => item.id));
        data.hof.forEach(item => {
            if (!currentIds.has(item.id)) {
                newOrder.push(item);
            }
        });
        data.hof = newOrder;
    } else {
        return res.status(400).json({ message: 'Invalid type' });
    }

    await writeData(data);
    res.json({ success: true });
});

// Update About Section
app.put('/api/data/about', authenticate, async (req, res) => {
    const updates = req.body;
    const data = await readData();

    data.about = { ...data.about, ...updates };
    await writeData(data);
    res.json({ success: true, about: data.about });
});

// Update Stats Section
app.put('/api/data/stats', authenticate, async (req, res) => {
    const updates = req.body;
    const data = await readData();

    data.stats = { ...data.stats, ...updates };
    await writeData(data);
    res.json({ success: true, stats: data.stats });
});

// Update Item (with image)
app.put('/api/data/:type/:id', authenticate, upload.single('image'), async (req, res) => {
    const { type, id } = req.params;
    const updates = req.body;
    const data = await readData();

    let list = type === 'certifications' ? data.certifications : data.hof;
    if (!list) list = [];

    const index = list.findIndex(item => item.id === id);

    if (index !== -1) {
        if (req.file) {
            if (process.env.VERCEL) {
                try {
                    const blob = await put(req.file.originalname, req.file.buffer, { access: 'public' });
                    updates.image = blob.url;
                } catch (err) {
                    console.error('Blob Upload Error:', err);
                    return res.status(500).json({ message: 'Error uploading image' });
                }
            } else {
                updates.image = `assets/uploads/${req.file.filename}`;
            }
        }

        list[index] = { ...list[index], ...updates };

        if (type === 'certifications') data.certifications = list;
        else data.hof = list;

        await writeData(data);
        res.json({ success: true, item: list[index] });
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Delete Item
app.delete('/api/data/:type/:id', authenticate, async (req, res) => {
    const { type, id } = req.params;
    const data = await readData();

    if (type === 'certifications') {
        if (data.certifications) {
            data.certifications = data.certifications.filter(item => item.id !== id);
        }
    } else if (type === 'hof') {
        if (data.hof) {
            data.hof = data.hof.filter(item => item.id !== id);
        }
    }

    await writeData(data);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

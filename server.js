const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

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
const storage = multer.diskStorage({
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
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { certifications: [], hof: [] };
    }
};

// Helper: Write Data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
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
app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

// Add Item
app.post('/api/data/:type', authenticate, upload.single('image'), (req, res) => {
    const { type } = req.params;
    const item = req.body;
    const data = readData();

    if (req.file) {
        item.image = `assets/uploads/${req.file.filename}`;
    }

    item.id = Date.now().toString();

    if (type === 'certifications') {
        data.certifications.push(item);
    } else if (type === 'hof') {
        data.hof.push(item);
    } else {
        return res.status(400).json({ message: 'Invalid type' });
    }

    writeData(data);
    res.json({ success: true, item });
});

// Update Item
app.put('/api/reorder/:type', authenticate, (req, res) => {
    const { type } = req.params;
    const { order } = req.body; // Array of IDs in new order
    const data = readData();

    if (!order || !Array.isArray(order)) {
        return res.status(400).json({ message: 'Invalid order data' });
    }

    if (type === 'certifications') {
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

    writeData(data);
    res.json({ success: true });
});

// Update About Section
app.put('/api/data/about', authenticate, (req, res) => {
    const updates = req.body;
    const data = readData();

    data.about = { ...data.about, ...updates };
    writeData(data);
    res.json({ success: true, about: data.about });
});

app.put('/api/data/:type/:id', authenticate, upload.single('image'), (req, res) => {
    const { type, id } = req.params;
    const updates = req.body;
    const data = readData();

    let list = type === 'certifications' ? data.certifications : data.hof;
    const index = list.findIndex(item => item.id === id);

    if (index !== -1) {
        if (req.file) {
            updates.image = `assets/uploads/${req.file.filename}`;
        }
        list[index] = { ...list[index], ...updates };
        writeData(data);
        res.json({ success: true, item: list[index] });
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Delete Item
app.delete('/api/data/:type/:id', authenticate, (req, res) => {
    const { type, id } = req.params;
    const data = readData();

    if (type === 'certifications') {
        data.certifications = data.certifications.filter(item => item.id !== id);
    } else if (type === 'hof') {
        data.hof = data.hof.filter(item => item.id !== id);
    }

    writeData(data);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

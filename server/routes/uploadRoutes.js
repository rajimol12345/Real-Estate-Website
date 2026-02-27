const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure we use an absolute path for reliability
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'application/pdf';

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images and PDFs only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// @desc    Upload multiple images
// @route   POST /api/upload
// @access  Public (Adjust as needed)
router.post('/', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send({ message: 'No files uploaded' });
    }

    const filePaths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);
    res.send(filePaths);
});

// @desc    Upload single image
// @route   POST /api/upload/single
// @access  Public
router.post('/single', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    // Return an object with url property for front-end consistency
    res.json({
        url: `/${req.file.path.replace(/\\/g, '/')}`
    });
});

module.exports = router;

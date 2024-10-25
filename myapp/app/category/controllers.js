const Category = require('./models'); // Pastikan path ini benar


const store = async (req, res, next) => {
    try {
        const payload = req.body; // Ambil data dari body request
        const category = new Category(payload); // Buat instance baru dari kategori
        await category.save(); // Simpan kategori ke database
        return res.json(category); // Kembalikan kategori yang baru dibuat
    } catch (err) {
        // Tangani error validasi
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                error: 1,
                message: err.message,
                fields: err.errors,
            });
        }
        next(err); // Serahkan error ke middleware error handler
    }
};

// Memperbarui kategori berdasarkan ID
const update = async (req, res, next) => {
    try {
        const payload = req.body; // Ambil data dari body request
        const category = await Category.findByIdAndUpdate(req.params.id, payload, {
            new: true, // Kembalikan kategori yang baru diperbarui
            runValidators: true, // Jalankan validasi
        });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' }); // Kategori tidak ditemukan
        }
        return res.json(category); // Kembalikan kategori yang diperbarui
    } catch (err) {
        // Tangani error validasi
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                error: 1,
                message: err.message,
                fields: err.errors,
            });
        }
        next(err); // Serahkan error ke middleware error handler
    }
};

// Menghapus kategori berdasarkan ID
const destroy = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id); // Cari dan hapus kategori
        if (!category) {
            return res.status(404).json({ message: 'Category not found' }); // Kategori tidak ditemukan
        }
        return res.json({ message: 'Category deleted successfully' }); // Kembalikan pesan sukses
    } catch (err) {
        next(err); // Serahkan error ke middleware error handler
    }
};

// Mengambil semua kategori
const index = async (req, res, next) => {
    try {
        const categories = await Category.find(); // Ambil semua kategori
        return res.json(categories); // Kembalikan daftar kategori
    } catch (err) {
        next(err); // Serahkan error ke middleware error handler
    }
};


const show = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id); // Cari kategori berdasarkan ID
        if (!category) {
            return res.status(404).json({ message: 'Category not found' }); // Kategori tidak ditemukan
        }
        return res.json(category); // Kembalikan kategori
    } catch (err) {
        next(err); // Serahkan error ke middleware error handler
    }
};

// Ekspor controller
module.exports = {
    store,
    update,
    destroy,
    index,
    show, // Pastikan untuk mengekspor fungsi show
};

const Product = require('../product/model');
const CartItem = require('../../cart-item/model'); // Mengubah dari CartItems menjadi CartItem

// Fungsi untuk memperbarui cart
const update = async (req, res, next) => {
    try {
        const { items } = req.body;
        const productIds = items.map(item => item.product._id);
        const products = await Product.find({ _id: { $in: productIds } });

        let cartItems = items.map(item => {
            let relatedProduct = products.find(product => product._id.toString() === item.product._id);
            return {
                product: relatedProduct._id,
                price: relatedProduct.price,
                image_url: relatedProduct.image_url,
                name: relatedProduct.name,
                user: req.user._id,
                qty: item.qty
            };
        });

        console.log('Cart items to be added:', cartItems);

        // Hapus semua item cart lama untuk user ini
        await CartItem.deleteMany({ user: req.user._id });

        // Pastikan cartItems bukan array kosong sebelum bulkWrite
        if (cartItems.length > 0) {
            await CartItem.bulkWrite(
                cartItems.map(item => {
                    return {
                        updateOne: {
                            filter: {
                                user: req.user._id,
                                product: item.product
                            },
                            update: item,
                            upsert: true
                        }
                    };
                })
            );
        }

        return res.json(cartItems);
    } catch (err) {
        console.log(err);
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
};

const index = async (req, res, next) => {
    try {
        // Periksa apakah pengguna ada
        if (!req.user) {
            return res.status(401).json({
                error: true,
                message: 'User tidak ditemukan. Silakan login kembali.',
            });
        }

        console.log('Fetching cart items for user:', req.user._id);

        // Ambil item keranjang untuk pengguna
        const items = await CartItem.find({ user: req.user._id }).populate('product').populate('user');

        console.log('Cart items found:', items);

        // Jika tidak ada item di keranjang, kembalikan array kosong
        return res.status(200).json(items); // Mengembalikan array kosong jika tidak ada item

    } catch (err) {
        console.error('Error fetching cart items:', err);

        // Penanganan kesalahan validasi
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                error: true,
                message: err.message,
                fields: err.errors,
            });
        }

        // Tangani kesalahan lainnya
        return res.status(500).json({
            error: true,
            message: 'Terjadi kesalahan saat mengambil item keranjang.',
        });
    }
};



const addToCart = async (req, res, next) => {
    try {
        const { name, qty, product } = req.body;

        // Validasi payload
        if (!name || !qty || !product) {
            return res.status(400).json({ error: true, message: 'Semua field harus diisi.' });
        }

        // Cari produk berdasarkan ID produk
        const foundProduct = await Product.findById(product);
        if (!foundProduct) {
            return res.status(404).json({ error: true, message: 'Produk tidak ditemukan.' });
        }

        // Buat payload berdasarkan produk yang ditemukan di database
        let payload = {
            name: foundProduct.name, // Gunakan nama produk dari database
            qty,
            user: req.user._id,
            product: foundProduct._id, // ID produk
            price: foundProduct.price, // Ambil harga produk dari database
            image_url: foundProduct.image_url // Jika ingin menampilkan gambar
        };

        console.log('Payload for adding to cart:', payload);

        let cartItem = new CartItem(payload);
        await cartItem.save();
        console.log('Cart item saved:', cartItem);

        return res.json(cartItem);
    } catch (err) {
        console.log(err);
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
};


const deleteFromCart = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await CartItem.findById(id); // Mengubah dari CartItems menjadi CartItem
        if (!item) {
            return res.status(404).json({ message: 'Item tidak ditemukan' });
        }
        await CartItem.findByIdAndDelete(id); // Mengubah dari CartItems menjadi CartItem
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart' });
    }
};

module.exports = { update, index, addToCart, deleteFromCart };

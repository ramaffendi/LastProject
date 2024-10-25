const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Invoice = require('../invoice/model');

const orderSchema = Schema({
    status: {
        type: String,
        enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
        default: 'waiting_payment'
    },
    delivery_fee: {
        type: Number,
        default: 0
    },
    delivery_address: {
        provinsi: { type: String, required: [true, 'provinsi harus diisi'] },
        kabupaten: { type: String, required: [true, 'kabupaten harus diisi'] },
        kecamatan: { type: String, required: [true, 'kecamatan harus diisi'] },
        kelurahan: { type: String, required: [true, 'kelurahan harus diisi'] },
        detail: { type: String }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order_items: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }] // Referensi ke OrderItem
}, { timestamps: true });

// Plugin AutoIncrement untuk order_number
orderSchema.plugin(AutoIncrement, { inc_field: 'order_number' });

// Virtual untuk menghitung jumlah total item (qty) dalam order
orderSchema.virtual('items_count').get(function () {
    return this.order_items.reduce((total, item) => total + parseInt(item.qty), 0);
});

// Middleware post save untuk menghitung subtotal dan membuat invoice
orderSchema.post('save', async function () {
    // Populasi order_items untuk mendapatkan price dan qty dari OrderItem
    await this.populate('order_items');

    // Kalkulasi subtotal berdasarkan harga dan qty dari setiap OrderItem
    let sub_total = this.order_items.reduce((total, item) => total + (item.price * item.qty), 0);

    // Membuat Invoice dengan subtotal dan total harga termasuk delivery fee
    let invoice = new Invoice({
        user: this.user,
        order: this._id,
        sub_total: sub_total,
        delivery_fee: parseInt(this.delivery_fee),
        total: parseInt(sub_total + this.delivery_fee),
        delivery_address: this.delivery_address
    });

    await invoice.save();
});

module.exports = model('Order', orderSchema);

const mongoose = require('mongoose')
const { model, Schema } = mongoose

const orderItemSchema = Schema({
    name: {
        type: String,
        minlength: [5, "panjang nama makanan min 5 karakter"],
        require: [true, "nama makanan harus diisi"],
    },
    price: {
        type: Number,
        require: [true, 'harga harus diisi']
    },
    qty: {
        type: Number,
        required: [true, "kuantitas harus diisi"],
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
})

module.exports = model('OrderItem', orderItemSchema)
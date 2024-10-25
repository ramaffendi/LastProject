const mongoose = require('mongoose')
const { model, Schema } = mongoose

const tagSchema = Schema({
    name: {
        type: String,
        minlength: [3, 'panjang nama tag minimal 3 katakter'],
        maxlength: [20, 'panjang nama tag maximal 20 katakter'],
        required: [true, 'nama tag harus diisi']
    }
})

module.exports = model('Tag', tagSchema)
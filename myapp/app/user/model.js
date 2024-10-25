const mongoose = require('mongoose')
const { Schema, model } = mongoose
const autoIncrement = require('mongoose-sequence')(mongoose)
const bcrypt = require('bcrypt')

let userSchema = Schema({
    full_name: {
        type: String,
        required: [true, 'nama harus diisi'],
        maxlength: [255, 'panjang nama harus antara 3 - 255 karater'],
        minlength: [3, 'panjang nama harus antara 3 - 255 karater']
    },

    customer_id: {
        type: Number
    },
    email: {
        type: String,
        required: [true, 'email harus diisi'],
        maxlength: [255, 'panjang email harus 255 karakter']
    },
    password: {
        type: String,
        required: [true, 'password harus diisi'],
        maxlength: [255, 'panjang password maks 255 karakter']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    token: [String],
    cart: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timesStamps: true })

userSchema.path('email').validate(function (value) {
    const EMAIL_RE = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/
    return EMAIL_RE.test(value)
}, attr => `${attr.value} harus merupakan email yang valid`)

userSchema.path('email').validate(async function (value) {
    try {
        // 1.lakukan pencarian ke collection User berdasarkan email
        const count = await this.model('User').countDocuments({ email: value })

        // 2. jika user ditemukan akan false dan sebaliknya
        return !count
    } catch (err) {
        throw err
    }
}, attr => `${attr.value} sudah terdaftar`)

const HASH_ROUND = 10
userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})

userSchema.plugin(autoIncrement, { inc_field: "customer_id" })

module.exports = model('User', userSchema)
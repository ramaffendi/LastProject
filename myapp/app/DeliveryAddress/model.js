const { Schema, model } = require('mongoose')
const DeliveryAddressSchema = Schema({
    nama: {
        type: String,
        required: [true, 'nama alamat harus diisi'],
        maxLenght: [255, 'panjang maksimal nama alamat adalah 255 karakter']
    },

    kelurahan: {
        type: String,
        required: [true, 'kelurahan harus diisi'],
        maxLenght: [255, 'panjang maksimal kelurahan adalah 255 karakter']
    },

    kecamatan: {
        type: String,
        required: [true, 'kecamatan harus diisi'],
        maxLenght: [255, 'panjang maksimal kecamatan adalah 255 karakter']

    },

    kabupaten: {
        type: String,
        required: [true, 'kebupaten harus diisi'],
        maxLenght: [255, 'panjang maksimal kebupaten adalah 255 karakter']
    },

    provinsi: {
        type: String,
        required: [true, 'provinsi harus diisi'],
        maxLenght: [255, 'panjang maksimal provinsi adalah 255 karakter']
    },
    detail: {
        type: String,
        required: [true, 'detail harus diisi'],
        maxLenght: [1000, 'panjang maksimal detail adalah 1000 karakter']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timesStamps: true })

module.exports = model('DeliveryAddress', DeliveryAddressSchema
)
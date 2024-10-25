const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const productSchema = Schema(
  {
    name: {
      type: String,
      minlength: [3, "panjang nama makanan min 3 karakter"],
      require: [true, "nama makanan harus diisi"],
    },
    description: {
      type: String,
      maxlength: [1000, "pangjang deskripsi max 1000 karakter"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: String,

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },

    tags: {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);

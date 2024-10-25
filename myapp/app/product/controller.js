const path = require("path");
const fs = require("fs");
const config = require("../config");
const Product = require("./model");
const Category = require('../category/models')
const Tag = require('../tag/model')

const store = async (req, res, next) => {
  try {
    let payload = req.body;

    // update utk relasi kategori
    if (payload.category) {
      let category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } })
      if (category) {
        payload = { ...payload, category: category._id }
      } else {
        delete payload.category
      }
    }

    if (payload.tags && payload.tags.length > 0) {
      let tags = await Tag.find({ name: { $in: payload.tags } })
      if (tags.length) {
        payload = { ...payload, tags: tags.map(tag => tag._id) }
      } else {
        delete payload.tags
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename || originalExt;
      let targetpath = path.resolve(
        config.rootPath,
        `public/images/products/${filename}.jpg`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(targetpath);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          const newFileName =  `${filename}.jpg`
          console.log(newFileName)
          let product = new Product({ ...payload, image_url: newFileName });
          await product.save();
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(targetpath);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              field: err.errors,
            });
          }
          next(err);
        }
      });
      src.on("error", async () => {
        next(err);
      });
    } else {
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        field: err.errors,
      });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let { id } = req.params

    if (payload.category) {
      let category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } })
      if (category) {
        payload = { ...payload, category: category._id }
      } else {
        delete payload.category
      }
    }

    if (payload.tags && payload.tags.length > 0) {
      let tags = await Tag.find({ name: { $in: payload.tags } })
      if (tags && tags.length > 0) {
        payload = { ...payload, tags: tags.map(tag => tag._id) }
      } else {
        delete payload.tags
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.name || originalExt;
      let targetpath = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(targetpath);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          let product = await Product.findById(id)
          let currentImage = `${config.rootPath}/public/images/${product.image_url}`

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
          }

          product = await Product.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
          })
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(targetpath);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              field: err.errors,
            });
          }
          next(err);
        }
      });
      src.on("error", async () => {
        next(err);
      });
    } else {
      let product = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
      });

      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        field: err.errors,
      });
    }
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 8, q = '', category = '', tags = [] } = req.query
    let criteria = {}

    if (q.length) {
      criteria = {
        ...criteria, name: { $regex: `${q}`, $options: `i` }
      }
    }

    if (category.length) {
      let categoryResult = await Category.findOne({ name: { $regex: `${category}`, $options: `i` } })

      if (categoryResult) {
        criteria = { ...criteria, category: categoryResult._id }
      }
    }

    if (tags.length) {
      let tagsResult = await Tag.find({ name: { $in: tags } })
      if (tagsResult.length > 0) {

        criteria = { ...criteria, tags: { $in: tagsResult.map(tag => tag._id) } }
      }
    }


    console.log(criteria)

    let count = await Product.find().countDocuments(criteria)

    let product = await Product.find(criteria)
      .skip(parseInt(skip)).
      limit(parseInt(limit)).
      populate('category').
      populate('tags')
    return res.json({
      data: product,
      count
    })
  } catch (err) {
    next(err)
  }
}

const destroy = async (req, res, next) => {
  try {
    let product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted", product });
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
}

module.exports = { store, index, update, destroy };

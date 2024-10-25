const Order = require('../order/model')
const { Types } = require('mongoose')
const OrderItem = require('../order-items/model')
const DeliveryAddress = require('../DeliveryAddress/model')
const CartItem = require('../../cart-item/model')


const store = async (req, res, next) => {

    try {

        console.log('User:', req.user); 
        console.log('Request Body:', req.body);

        let { delivery_fee, delivery_address } = req.body
        let items = await CartItem.find({ user: req.user._id }).populate('product')
        if (!items) {
            return res.json({
                error: 1,
                message: 'kamu tidak bisa membuat order karena tidak memiliki item'
            })
        }
        let address = await DeliveryAddress.findById(delivery_address)

        console.log('Delivery Address:', address);

        let order = new Order({
            _id: new Types.ObjectId(),
            status: 'waiting_payment',
            delivery_fee: delivery_fee,
            delivery_address: {
                provinsi: address.provinsi,
                kabupaten: address.kabupaten,
                kecamatan: address.kecamatan,
                kelurahan: address.kelurahan,
                detail: address.detail
            },
            user: req.user._id,
            order_items: []
        })
        let orderItem = await OrderItem
            .insertMany(items.map(item => ({
                ...item,
                name: item.product.name,
                qty: parseInt(item.qty),
                price: parseInt(item.product.price),
                order: order._id
            })))
        orderItem.forEach(item => order.order_items.push(item))
        await order.save()
        await CartItem.deleteMany({ user: req.user._id })
        return res.json(order)

    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err)
    }

}

const index = async (req, res, next) => {
    try {

        console.log('User:', req.user);
        console.log('Request Body:', req.body);

        let { skip = 0, limit = 10 } = req.query
        let count = await Order.find({ user: req.user._id }).countDocuments()
        let orders =
            await Order
                .find({ user: req.user._id })
                .skip(parseInt(skip))
                .limit(parseInt(limit))
                .populate('order_items')
                .sort('-createdAt')
        return res.json({
            data: orders.map(order => order.toJSON({ virtuals: true })),
            count
        })
    } catch (err) {
        console.log(err)
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }
        next(err)
    }
}

module.exports = { index, store }
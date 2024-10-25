const { subject } = require('@casl/ability')
const Invoice = require('./model')
const { policyFor } = require('../../utils/index')

const show = async (req, res, next) => {
    try {
        let { order_id } = req.params
        // Temukan invoice berdasarkan order_id
        let invoice = await Invoice.findOne({ order: order_id })
            .populate('order')
            .populate('user')

        // Jika invoice tidak ditemukan
        if (!invoice) {
            return res.json({
                error: 1,
                message: 'Invoice tidak ditemukan'
            })
        }

        // Cek policy
        let policy = policyFor(req.user)
        let subjectInvoice = subject('Invoice', { ...invoice, user_id: invoice.user._id })
        if (!policy.can('read', subjectInvoice)) {
            return res.json({
                error: 1,
                message: 'anda tidak memiliki hak akses untuk melihat invoice ini'
            })
        }

        return res.json(invoice)
    } catch (err) {
        return res.json({
            error: 1,
            message: 'error ketika ingin mendapatkan invoice'
        })
    }
}

module.exports = { show }

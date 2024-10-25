const { getToken, policyFor } = require('../utils/index');
const jwt = require('jsonwebtoken');
const config = require('../app/config');
const User = require('../app/user/model');

function decodeToken() {
    return async function (req, res, next) {
        try {
            let token = getToken(req);

            if (!token) return next(); // Jika tidak ada token, lanjutkan tanpa user

            // Verifikasi token dan ambil userId
            const decoded = jwt.verify(token, config.secretKey);

            req.user = await User.findById(decoded._id); // Pastikan gunakan decoded._id

            if (!req.user) {
                return res.status(401).json({
                    error: 1,
                    message: 'Token expired atau user tidak ditemukan'
                });
            }

            next(); // Pastikan next() dipanggil setelah proses selesai
        } catch (err) {
            // Tangani error terkait token
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    error: 1,
                    message: 'Token tidak valid',
                });
            }

            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    error: 1,
                    message: 'Token expired',
                });
            }

            next(err); // Jika error lainnya, lanjutkan ke error handler
        }
    };
}

// Middleware untuk cek hak akses
function policeCheck(action, subject) {
    return function (req, res, next) {
        let policy = policyFor(req.user);
        if (!policy.can(action, subject)) {
            return res.status(403).json({
                error: 1,
                message: `Kamu tidak disetujui untuk ${action} ${subject}`
            });
        }
        next();
    };
}

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Ambil token dari header Authorization
  
    if (token == null) {
      return res.status(401).json({ message: 'Token not provided' });
    }
  
    jwt.verify(token, config.secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token invalid or expired' });
      }
      req.user = user; // Menyimpan user dari token
      next();
    });
  };

module.exports = { decodeToken, policeCheck, authenticateJWT};

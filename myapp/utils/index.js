const { Ability, AbilityBuilder } = require('@casl/ability');



function getToken(req) {
    let token = req.headers.authorization
        ? req.headers.authorization.replace('Bearer', '').trim()
        : null;
    return token && token.length ? token : null;
}


const policies = {
    guest(user, { can }) {
        can('read', 'Product')
    },

    user(user, { can }) {
        can('view', 'Order'); // view adalah action, order itu subject/user/api/model
        can('create', 'Order');
        can('create', 'Tag');
        can('read', 'Order', { user_id: user._id });
        can('update', 'User', { _id: user._id });
        can('read', 'CartItems', { user_id: user._id });
        can('update', 'CartItems', { user_id: user._id });
        can('view', 'DeliveryAddress');
        can('create', 'DeliveryAddress', { user_id: user._id });
        can('update', 'DeliveryAddress', { user_id: user._id });
        can('delete', 'DeliveryAddress', { user_id: user._id });
        can('read', 'Invoice', { user_id: user._id })

        can('create', 'Product');
        can('create', 'CartItems');
        can('delete', 'CartItems');
        can('create', 'Category');
    },
    admin(user, { can }) {
        can('manage', 'all');
    }
}

const policyFor = user => {
    let builder = new AbilityBuilder()
    if (user && typeof policies[user.role] === 'function') {
        policies[user.role](user, builder)
    } else {
        policies['guest'](user, builder)
    }
    return new Ability(builder.rules)
}

module.exports = {
    getToken, policyFor
}
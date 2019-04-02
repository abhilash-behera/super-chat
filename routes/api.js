const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user').User;
var jwt_secret = process.env.JWT_SECRET || "secret";

// authorization middleware
router.use((req, res, next) => {
    if (req.method === "POST") {
        let token = req.headers['token'];
        if (token) {
            const payload = jwt.verify(token, jwt_secret);
            if (payload) {
                User.findOne({ _id: payload._id }, { password: 0 }, (err, user) => {
                    if (err) {
                        console.log('Error in finding user: ', err);
                        res.json({ success: false, data: 'Something went wrong. Please try again.' });
                    } else {
                        if (user) {
                            console.log('Access granted to user: ', user.username);
                            req.body.authorizedUser = user;
                            next();
                        } else {
                            console.log('Unauthorized access with token: ', token);
                            res.json({ success: false, data: 'Unauthorized Access' });
                        }
                    }
                })
            } else {
                console.log('Invalid token received');
                res.json({ success: false, data: { msg: 'Invalid token' } });
            }
        } else {
            console.log('No token received');
            res.json({ success: false, data: { msg: 'Unauthorized access' } });
        }
    } else {
        next();
    }

});

router.post('/getUsers', (req, res) => {
    console.log(req.body.authorizedUser.username, ' requesting users list');
    User.find({ _id: { $ne: req.body.authorizedUser._id } }, { password: 0 })
        .sort({ username: 'asc' })
        .exec((err, users) => {
            if (err) {
                console.log('Error in fetching users list: ', err);
                res.json({ success: false, data: { msg: 'Something went wrong. Please try again.' } });
            } else {
                if (users) {
                    console.log('Users found: ', users.length);
                    res.json({ success: true, data: { msg: 'Users fetched successfully', users: users } })
                } else {
                    console.log('No users found');
                    res.json({ success: false, data: { msg: 'No users found' } })
                }
            }
        });
})

module.exports = router;
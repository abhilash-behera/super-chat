var router = require('express').Router();
var jwt_secret = process.env.JWT_SECRET || "secret";
var jwt = require('jsonwebtoken');
var User = require('../models/user').User;
var UserStatus = require('../models/user').UserStatus;
var bcrypt = require('bcrypt');
var bcrypt_salt = process.env.BCRYPT_SALT || 5;

router.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        User.findOne({ username: req.body.username })
            .then(
                user => {
                    if (user) {
                        bcrypt.compare(req.body.password, user.password, (err, same) => {
                            if (err) {
                                console.log('Error while comparing passwords: ', err);
                                res.json({ success: false, data: { msg: 'Something went wrong. Please try again.' } })
                            } else {
                                if (same) {
                                    jwt.sign({ _id: user._id }, jwt_secret, (err, token) => {
                                        if (err) {
                                            console.log('Error in signing jwt token: ', err);
                                            res.json({ success: false, data: { msg: 'Something went wrong. Please try again' } })
                                        } else {
                                            console.log('Authentication successful for ', req.body.username);
                                            res.json({ success: true, data: { msg: 'Authentication successful', token: token } });
                                        }
                                    });
                                } else {
                                    console.log('Invalid credentials for :', req.body.username);
                                    res.json({ success: false, data: { msg: 'Invalid Credentials' } });
                                }
                            }
                        })

                    } else {
                        console.log('User not found: ', req.body.username);
                        res.json({ success: false, data: { msg: 'User account not found' } });
                    }
                },
                err => {
                    console.log('Error in finding user: ', err);
                    res.json({ success: false, data: { msg: 'Something went wrong. Please try again' } });
                }
            )
    } else {
        res.json({ success: false, data: { msg: 'Bad request. Check your fields' } });
    }
})

module.exports = router;
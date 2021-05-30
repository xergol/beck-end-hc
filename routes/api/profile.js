const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');

// @route Get api/profiles/me
// @desc  Test route
// @access Public
// router.get("/me", auth, async (req, res) => {
//     try {
//         const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

//         if (!profile) {
//             return res.status(400).json({ msg: 'There is no such profile' });
//         }

//         res.json(profile);
//     } catch (err) {
//         console.error(err.message)
//         res.status(500).send('Server Error');
//     }
// });

// @route POST api/profiles
// @desc  Create user profile
// @access private

router.post('/', [auth,
    check('name', 'Name is required').not().isEmpty(),
    check('contactNumber', 'Contact number is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('profession', 'Profession is required').not().isEmpty(),
    check('locality', 'Locality is required').not().isEmpty(),
    check('supplyDate', 'Supply date is required').not().isEmpty(),
    check('paymentDate', 'Payment date is required').not().isEmpty(),
    check('debtAmount', 'Debt amount is required').not().isEmpty(),
    check('advanceAmount', 'Advance amount is required').not().isEmpty(),
    check('itemPurchased', 'Item purchased are required').not().isEmpty(),
    check('totalAmount', 'Total Amount Bill is required').not().isEmpty()
],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            name,
            contactNumber,
            address,
            supplyDate,
            paymentDate,
            profession,
            debtAmount,
            advanceAmount,
            locality,
            itemPurchased,
            totalAmount,
            transaction
        } = req.body;

        //Build Profile Object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (name) profileFields.name = name;
        if (contactNumber) profileFields.contactNumber = contactNumber;
        if (address) profileFields.address = address;
        if (supplyDate) profileFields.supplyDate = supplyDate;
        if (paymentDate) profileFields.paymentDate = paymentDate;
        if (profession) profileFields.profession = profession;
        if (debtAmount) profileFields.debtAmount = debtAmount;
        if (advanceAmount) profileFields.advanceAmount = advanceAmount;
        if (locality) profileFields.locality = locality;
        if (itemPurchased) profileFields.itemPurchased = itemPurchased;
        if (totalAmount) profileFields.totalAmount = totalAmount;

        const defaultTransaction = {
            date: supplyDate,
            description: itemPurchased,
            debtAmount: totalAmount,
            paidAmount: advanceAmount,
            balanceToPay: totalAmount - advanceAmount
        }

        profileFields.transaction = [defaultTransaction];
        try {

            // let profile = await Profile.findOne({ user: req.id });

            // if (profile) {

            //     // Update
            //     profile = await Profile.findOneAndUpdate(
            //         { user: req.id },
            //         { $set: profileFields },
            //         { new: true }
            //     );

            //     return res.json(profile);
            // }

            // Create 

            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    })

// @route GET api/profiles
// @desc  Get all profiles
// @access Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route GET api/profile/:profile_id
// @desc  Get profile by ID
// @access Public

router.get('/:profile_id', async (req, res) => {
    try {

        const profile = await Profile.findById(req.params.profile_id).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        res.json(profile);

    } catch (err) {
        console.error(err.message);

        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
})


// @route DELETE api/profile
// @desc  Delete profile, user & posts
// @access Private

router.delete('/:profile_id', auth, async (req, res) => {
    try {

        // Remove profile 
        await Profile.findByIdAndRemove(req.params.profile_id)

        res.json({ msg: 'User deleted' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route PUT api/profile/:id
// @desc  update profile
// @access Private

router.patch('/:id', [auth,
    check('name', 'Name is required').not().isEmpty(),
    check('contactNumber', 'Contact number is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('profession', 'Profession is required').not().isEmpty(),
    check('locality', 'Locality is required').not().isEmpty(),
    check('supplyDate', 'Supply date is required').not().isEmpty(),
    check('paymentDate', 'Payment date is required').not().isEmpty(),
    check('debtAmount', 'Debt amount is required').not().isEmpty(),
    check('advanceAmount', 'Advance amount is required').not().isEmpty(),
    check('itemPurchased', 'Item purchased are required').not().isEmpty(),
    check('totalAmount', 'Total Amount Bill is required').not().isEmpty()
], async (req, res) => {



    const {
        name,
        contactNumber,
        address,
        supplyDate,
        paymentDate,
        profession,
        debtAmount,
        advanceAmount,
        locality,
        itemPurchased,
        totalAmount
    } = req.body;




    //Build Profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (name) profileFields.name = name;
    if (contactNumber) profileFields.contactNumber = contactNumber;
    if (address) profileFields.address = address;
    if (supplyDate) profileFields.supplyDate = supplyDate;
    if (paymentDate) profileFields.paymentDate = debtAmount - advanceAmount === 0 ? new Date() : paymentDate;
    if (profession) profileFields.profession = profession;
    if (debtAmount) profileFields.debtAmount = debtAmount - advanceAmount;
    if (advanceAmount) profileFields.advanceAmount = advanceAmount;
    if (locality) profileFields.locality = locality;
    if (itemPurchased) profileFields.itemPurchased = itemPurchased;
    if (totalAmount) profileFields.totalAmount = totalAmount;


    const defaultTransaction = {
        date: supplyDate,
        description: itemPurchased,
        debtAmount: debtAmount,
        paidAmount: advanceAmount === '' ? 0 : advanceAmount,
        balanceToPay: debtAmount - advanceAmount
    }

    console.log(defaultTransaction.paidAmount)

    try {
        if (defaultTransaction.paidAmount === 0) {
            const profileFirst = await Profile.findByIdAndUpdate(req.params.id, profileFields, {
                new: true,
                runValidators: true
            })

            res.json(profileFirst);
        } else {
            // Update Profile
            const profileFirst = await Profile.findByIdAndUpdate(req.params.id, profileFields, {
                new: true,
                runValidators: true
            }).then(async () => {
                const profile = await Profile.findByIdAndUpdate(req.params.id, { $push: { "transaction": defaultTransaction } }, {
                    new: true,
                    runValidators: true
                })
                console.log(profile);
            })


            res.json(profileFirst);
        }



    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error for profile update');
    }



})

// @route POST api/profile/transactions
// @desc  create transcation
// @access Public
router.put("/transaction", [auth, [
    check('date', 'Transaction date is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('debtAmount', 'Debt amount is required').not().isEmpty(),
    check('paidAmount', 'Paid amount is required').not().isEmpty(),
    check('balanceToPay', 'Balance amount is required').not().isEmpty(),
]
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        date,
        description,
        debtAmount,
        paidAmount,
        balanceToPay
    } = req.body;


    //Build Transaction Object
    const newtransaction = {};
    if (date) newtransaction.date = date;
    if (description) newtransaction.description = description;
    if (debtAmount) newtransaction.debtAmount = debtAmount;
    if (paidAmount) newtransaction.paidAmount = paidAmount;
    if (balanceToPay) newtransaction.balanceToPay = balanceToPay;

    try {
        // create transaction
        const profile = await Profile.findOne({ user: req.user.id });
        profile.transaction.unshift(newtransaction);

        await profile.save();
        res.json(profile);


    } catch (err) {
        console.log(err.message);
        console.log('run');
        res.status(500).send('Server error');
    }
});

module.exports = router;
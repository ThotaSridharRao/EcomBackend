const Address = require('../models/Address');

// @desc    Get all addresses
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode, type, isDefault } = req.body;

    // If this is set as default, unset other defaults
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const newAddress = await Address.create({
      user: req.user._id,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      type,
      isDefault: isDefault || false
    });

    // If this is the only address, make it default automatically
    const count = await Address.countDocuments({ user: req.user._id });
    if (count === 1) {
      newAddress.isDefault = true;
      await newAddress.save();
    }

    res.status(201).json(newAddress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode, type, isDefault } = req.body;

    const addressToUpdate = await Address.findById(req.params.id);

    if (!addressToUpdate) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Ensure user owns this address
    if (addressToUpdate.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    addressToUpdate.name = name || addressToUpdate.name;
    addressToUpdate.phone = phone || addressToUpdate.phone;
    addressToUpdate.address = address || addressToUpdate.address;
    addressToUpdate.city = city || addressToUpdate.city;
    addressToUpdate.state = state || addressToUpdate.state;
    addressToUpdate.pincode = pincode || addressToUpdate.pincode;
    addressToUpdate.type = type || addressToUpdate.type;
    if (isDefault !== undefined) addressToUpdate.isDefault = isDefault;

    const updatedAddress = await addressToUpdate.save();
    res.json(updatedAddress);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await address.deleteOne();
    res.json({ message: 'Address removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};

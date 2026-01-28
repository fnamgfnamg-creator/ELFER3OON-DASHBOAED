const User = require('../models/User');

exports.createJoinRequest = async (req, res) => {
  try {
    const { uid, deviceId } = req.body;

    if (!uid || !deviceId) {
      return res.status(400).json({
        success: false,
        message: 'UID and Device ID are required'
      });
    }

    const existingUsers = await User.find({ uid });

    if (existingUsers.length > 0) {
      const existingDeviceIds = existingUsers.map(u => u.deviceId);

      if (!existingDeviceIds.includes(deviceId)) {
        await User.updateMany(
          { uid },
          { status: 'BLOCKED', blockedReason: 'Multiple devices detected' }
        );

        const newUser = await User.create({
          uid,
          deviceId,
          status: 'BLOCKED',
          blockedReason: 'Multiple devices detected'
        });

        return res.status(403).json({
          success: false,
          message: 'Multiple devices detected. Both devices blocked.',
          status: 'BLOCKED',
          user: newUser
        });
      }

      const existingUser = existingUsers.find(u => u.deviceId === deviceId);
      return res.json({
        success: true,
        message: 'Request already exists',
        status: existingUser.status,
        user: existingUser
      });
    }

    const newUser = await User.create({
      uid,
      deviceId,
      status: 'PENDING'
    });

    res.status(201).json({
      success: true,
      message: 'Join request submitted successfully',
      status: 'PENDING',
      user: newUser
    });
  } catch (error) {
    console.error('Join request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing join request'
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { uid: { $regex: search, $options: 'i' } },
        { deviceId: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ requestedAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { status: 'APPROVED', blockedReason: null, updatedAt: Date.now() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User approved successfully',
      user
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error approving user'
    });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { status: 'BLOCKED', blockedReason: 'Blocked by admin', updatedAt: Date.now() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User blocked successfully',
      user
    });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error blocking user'
    });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { unblockAll } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (unblockAll) {
      await User.updateMany(
        { uid: user.uid },
        { status: 'APPROVED', blockedReason: null, updatedAt: Date.now() }
      );

      const allUsers = await User.find({ uid: user.uid });

      return res.json({
        success: true,
        message: 'All devices for this UID unblocked',
        users: allUsers
      });
    }

    user.status = 'APPROVED';
    user.blockedReason = null;
    user.updatedAt = Date.now();
    await user.save();

    res.json({
      success: true,
      message: 'User unblocked successfully',
      user
    });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error unblocking user'
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
};
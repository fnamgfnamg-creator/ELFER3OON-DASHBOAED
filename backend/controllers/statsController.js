const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const [totalUsers, pendingRequests, approvedUsers, blockedDevices] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'PENDING' }),
      User.countDocuments({ status: 'APPROVED' }),
      User.countDocuments({ status: 'BLOCKED' })
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        pendingRequests,
        approvedUsers,
        blockedDevices
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    });
  }
};
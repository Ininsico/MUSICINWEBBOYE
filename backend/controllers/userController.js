const User = require('../models/User');

const syncUser = async (req, res) => {
  const { sessionClaims, auth } = req.auth;
  const { userId } = auth;
  const clerkEmail = sessionClaims?.email || "";

  try {
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({
        clerkId: userId,
        email: clerkEmail,
        firstName: sessionClaims?.first_name || "",
        lastName: sessionClaims?.last_name || "",
        profileImageUrl: sessionClaims?.image_url || "",
      });
      console.log(`🆕 New user registered: ${clerkEmail}`);
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(`❌ Sync Error: ${error.message}`);
    res.status(500).json({ message: 'User synchronization failed' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found in Miamor database' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  syncUser,
  getUserProfile,
};

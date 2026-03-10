export const getMyProfile = async (req, res) => {
  try {

    const user = req.user;

    let profile = null;

    if (user.referenceModel && user.referenceId) {

      const Model = (await import(`../../models/${user.referenceModel}.js`)).default;

      profile = await Model.findById(user.referenceId);
    }

    res.json({
      user,
      profile
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
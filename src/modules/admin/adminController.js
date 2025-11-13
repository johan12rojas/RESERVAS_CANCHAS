const adminService = require('./adminService');

const overview = async (req, res, next) => {
  try {
    const data = await adminService.getOverview(req.user);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { overview };

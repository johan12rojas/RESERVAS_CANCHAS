const notificationService = require('./notificationService');

const mine = async (req, res, next) => {
  try {
    const notifications = await notificationService.listNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

const test = async (req, res, next) => {
  try {
    const notification = await notificationService.sendTestNotification({
      id_usuario: req.user.id,
      mensaje: req.body.mensaje || 'Mensaje de prueba'
    });
    res.status(201).json(notification);
  } catch (err) {
    next(err);
  }
};

module.exports = { mine, test };

module.exports = (router) => {
  router.get('/ping', (req, res) => {
    res.status(204)
      .send();
  });
};

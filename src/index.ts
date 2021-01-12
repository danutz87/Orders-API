import createApp from './createApp';

const port = process.env.PORT || 3000;

const config = {
  MONGO_URL: process.env.MONGO_URL,
};

createApp(config).then((app) => {
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
});

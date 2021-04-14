const express = require("express");
const fetch = require("node-fetch");
const cron = require("node-cron");
const redis = require("redis");
const app = express();
require("dotenv").config();

//redis
const client = redis.createClient();
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// corn jobs to fetch news weekly

cron.schedule("* * * * *", async () => {
  //call api and
  let resultsCount = 1;
  while (resultsCount > 0) {
    const response = await fetch(
      `${process.env.API_URL}&apiKey=${process.env.API_KEY}`
    );
    const news = await response.json();
    resultsCount = 0;
    await setAsync("news", JSON.stringify(news));
  }
});

//get news
app.get("/news", async (req, res) => {
  const news = await getAsync("news");
  res.json({
    news: JSON.parse(news),
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server starting at port ${process.env.PORT}`);
});

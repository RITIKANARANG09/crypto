import express from "express";
const app = express();
import ejs from "ejs";
import fetch from "node-fetch";
import mongoose from "mongoose";

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/stockDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var stockSchema = new mongoose.Schema({
  name: String,
  last: String,
  base_unit: String,
  low: String,
  buy: String,
  sell: String,
  volume: String,
});

const Stock = mongoose.model("Stock", stockSchema);

const defaultItems = [];

app.get("/", function (req, res) {
  const api_url = "https://api.wazirx.com/api/v2/tickers";
  (async () => {
    await fetch(api_url)
      .then((response) => response.json())
      .then((data) => {
        for (let x in data) {
          const name = data[x]["name"];
          const last = data[x]["last"];
          const low = data[x]["low"];
          const base_unit = data[x]["base_unit"];
          const volume = data[x]["volume"];
          const sell = data[x]["sell"];
          const buy = data[x]["buy"];

          const stockData = {
            name: name,
            last: last,
            base_unit: base_unit,
            low: low,
            buy: buy,
            sell: sell,
            volume: volume,
          };
          defaultItems.push(stockData);
        }
      });
  })();
  const listItem = defaultItems.slice(0, 10);
  res.render("home", {
    items: listItem,
  });
});

app.listen(5000, function () {
  console.log("Server started on port 5000");
});

// Select the toggle button and the watchlist element
const toggleButton = document.getElementById("toggle-watchlist");
const watchlist = document.getElementById("watchlist");

// Add click event listener to the toggle button
toggleButton.addEventListener("click", () => {
  // Check the current display state of the watchlist
  if (watchlist.style.display === "none" || !watchlist.style.display) {
    // If hidden or no display style is set, show the watchlist
    watchlist.style.display = "block";
    toggleButton.textContent = "⬆️"; // Change the arrow to point upwards
  } else {
    // Otherwise, hide the watchlist
    watchlist.style.display = "none";
    toggleButton.textContent = "⬇️"; // Change the arrow to point downwards
  }
}); // end addEventListener("click"

function addStockData(symbol, price) {
  db.collection("stock_data")
    .add({
      symbol: symbol,
      price: price,
      timestamp: new Date(),
    })
    .then(() => {
      console.log("Stock data added for symbol: " + symbol);
    })
    .catch((error) => {
      console.error("Error adding stock data:", error);
    });
}

async function getDataFromStorage(symbol, result) {
  // if firebase has data for symbol in the past hour
  //    get data from firebase
  // else
  //    get data from rapidAPI
  //    add data to firebase

  db.collection("stock_data")
    .where("symbol", "==", symbol)
    .orderBy("timestamp")
    .limitToLast(1)
    .onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        var item = doc.data();
        // console.log(item);

        var timestamp = item.timestamp.toDate();
        // console.log(timestamp);

        var price = item.price;
        // console.log(price);

        if (new Date() - timestamp > 60 * 60 * 1000) {
          fetchStockPrice(symbol, result);
          console.log("yes, older than 60 minutes");
        } else {
          $(result).text(price + " $");
          console.log("no, not older than 60 minutes");
        }
      });
    });
}

async function fetchStockPrice(symbol, result) {
  var url = `https://yahoo-finance166.p.rapidapi.com/api/stock/get-price?region=US&symbol=${symbol}`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "ff417b8d15msh68777dca49c569fp1386b1jsnc8e8c7944038",
      "x-rapidapi-host": "yahoo-finance166.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // console.log(data);

    price = await data.quoteSummary.result[0].price.regularMarketPrice.raw;

    addStockData(symbol, price);
    $(result).text(price + " $");
  } catch (error) {
    console.error("Error fetching stock price:", error);
  }
} // end fetchStockPrice(symbol)

// Call the function to fetch the stock price when the page loads
window.onload = () => {
  // const stockPrice = fetchStockPrice(stockSymbol);
};

$(document).ready(function () {
  $("#watchlist .stock-symbol").each(function (i, obj) {
    var symbol = $(obj).text();
    var result = $(obj).parent().find(".stock-price");
    console.log("running for: " + symbol);
    getDataFromStorage(symbol, result);
  });
});


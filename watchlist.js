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

// Add stocks data from Firebase
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

// async function getDataFromStorage(symbol, result) {
//   // if firebase has data for symbol in the past hour
//   //    get data from firebase
//   // else
//   //    get data from rapidAPI
//   //    add data to firebase
// // Get the data from Firebase for the given symbol
//   db.collection("stock_data")
//     .where("symbol", "==", symbol)
//     .orderBy("timestamp")
//     .limitToLast(1)
//     .onSnapshot((snapshot) => {
//       snapshot.forEach((doc) => {
//         var item = doc.data();
//         // console.log(item);

//         var timestamp = item.timestamp.toDate();
//         // console.log(timestamp);

//         var price = item.price;
//         // console.log(price);

//         if (new Date() - timestamp > 7 * 60 * 1000) {
//           fetchStockPrice(symbol, result);
//           console.log("yes, older than 7 minutes");
//         } else {
//           $(result).text(price + " $");
//           console.log("no, not older than 60 minutes");
//         }
//       });
//     });
// }

async function getDataFromStorage(symbol, result) {
  // Get the data from Firebase for the given symbol
  db.collection("stock_data")
    .where("symbol", "==", symbol)
    .orderBy("timestamp", "desc") // Ensure the latest data is retrieved first
    .limit(1) // dif Ovi Only get the latest record
    .get() // dif Ovi
    .then((snapshot) => { // dif Ovi
      if (snapshot.empty) {
        // No data found in Firebase, so we need to fetch from RapidAPI
        fetchStockPrice(symbol, result);
        console.log("No data in Firebase, fetching from RapidAPI...");
      } else {
        // Data found in Firebase
        snapshot.forEach((doc) => {
          var item = doc.data();
          var timestamp = item.timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
          var price = item.price;
          
          // Check if the data is older than 1 hour
          if (new Date() - timestamp > 60 * 60 * 1000) {
            // Data is older than 1 hour, fetch fresh data from RapidAPI
            fetchStockPrice(symbol, result);
            console.log("Data is older than 60 minutes, fetching from RapidAPI...");
          } else {
            // Data is less than 1 hour old, display it
            $(result).text(price + " $");
            console.log("Data is fresh, using Firebase data.");
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching stock data from Firebase:", error);
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

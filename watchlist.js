// Select the toggle button and the watchlist element
const toggleButton = document.getElementById('toggle-watchlist');
const watchlist = document.getElementById('watchlist');

// Add click event listener to the toggle button
toggleButton.addEventListener('click', () => {
    // Check the current display state of the watchlist
    if (watchlist.style.display === 'none' || !watchlist.style.display) {
        // If hidden or no display style is set, show the watchlist
        watchlist.style.display = 'block';
        toggleButton.textContent = '⬆️'; // Change the arrow to point upwards
    } else {
        // Otherwise, hide the watchlist
        watchlist.style.display = 'none';
        toggleButton.textContent = '⬇️'; // Change the arrow to point downwards
    }
});

// Add stock to Firestore
function addStock(symbol, name, price) {
    const db = firebase.firestore();
    db.collection('watchlist').add({
      symbol: symbol,
      name: name,
      price: price,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      console.log('Stock added');
    }).catch((error) => {
      console.error('Error adding stock:', error);
    });
  }
  
  // Fetch the stock list
  function fetchWatchlist() {
    const db = firebase.firestore();
    db.collection('watchlist').orderBy('timestamp').onSnapshot((snapshot) => {
      snapshot.forEach(doc => {
        const stock = doc.data();
        console.log('Stock:', stock);
        // Update your UI with the stock data
      });
    });
  }

  const stockSymbol = "MSFT"; // Microsoft stock symbol
  const stockPriceElement = document.getElementById("stock-price"); // Target element to display stock price
  
  // Function to fetch the live stock price for Microsoft (MSFT) from Yahoo Finance API
  async function fetchStockPrice() {
      const url = `https://yahoo-finance-api.p.rapidapi.com/stock/v2/get-summary?symbol=${stockSymbol}`;
  
      const options = {
          method: 'GET',
          headers: {
              'x-rapidapi-key': 'ff417b8d15msh68777dca49c569fp1386b1jsnc8e8c7944038', // Replace with your RapidAPI key
              'x-rapidapi-host': 'yahoo-finance166.p.rapidapi.com'
          }
      };
  
      try {
          const response = await fetch(url, options);
          const data = await response.json();
          const price = data.price.regularMarketPrice.raw; // Get the stock price from the response
  
          // Update the stock price in the watchlist
          stockPriceElement.textContent = `$${price.toFixed(2)}`; // Format and set the price
      } catch (error) {
          console.error("Error fetching stock price:", error);
          stockPriceElement.textContent = "$0.00"; // Default if there's an error
      }
  }
  
  // Call the function to fetch the stock price when the page loads
  window.onload = () => {
      fetchStockPrice(); // Fetch the price for MSFT
  };

// 'x-rapidapi-key': 'ff417b8d15msh68777dca49c569fp1386b1jsnc8e8c7944038',
//             'x-rapidapi-host': 'yahoo-finance166.p.rapidapi.com'
//         }
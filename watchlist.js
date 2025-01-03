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

// Define the container where the stock price will be displayed
const stockPriceElement = document.getElementById('stock-price');

// Function to fetch stock data
async function fetchStockData() {
    const url = 'https://yahoo-finance-api.p.rapidapi.com/stock/v2/get-summary?symbol=MSFT';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'ff417b8d15msh68777dca49c569fp1386b1jsnc8e8c7944038', // Replace with your own RapidAPI key
            'x-rapidapi-host': 'yahoo-finance-api.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Failed to fetch stock data');
        }
        const data = await response.json();
        console.log(data);  // Log the data to understand its structure
        updateStockPrice(data);
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
}

// Function to update the stock price on the webpage
function updateStockPrice(data) {
    // Ensure the data contains the necessary information before updating the UI
    if (data && data.price && data.price.regularMarketPrice) {
        const stockPrice = data.price.regularMarketPrice.raw;  // Get the raw price
        stockPriceElement.textContent = `$${stockPrice.toFixed(2)}`;  // Update the price displayed
    }
}

// Fetch stock data when the page is loaded
// document.addEventListener('DOMContentLoaded', fetchStockData);

// 'x-rapidapi-key': 'ff417b8d15msh68777dca49c569fp1386b1jsnc8e8c7944038',
//             'x-rapidapi-host': 'yahoo-finance166.p.rapidapi.com'
//         }
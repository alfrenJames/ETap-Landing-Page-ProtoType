// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDnnpKATQ8A4VW8hw3cYtuQgP3_bAcNIEU",
    authDomain: "prototype-control-on-ofd.firebaseapp.com",
    projectId: "prototype-control-on-ofd",
    storageBucket: "prototype-control-on-ofd.appspot.com",
    messagingSenderId: "294472890765",
    appId: "1:294472890765:web:935c6d71c68ffa738ee5c4",
    measurementId: "G-KCN6QT8TF9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var Led1Status = "0"; // Initialize LED status as off
var countdown; // Countdown timer
var countdownInterval; // Countdown interval

// Function to read LED status from Firebase
function readLedStatus() {
    var firebaseRef = firebase.database().ref().child("Led1Status");
    firebaseRef.on("value", function(snapshot) {
        Led1Status = snapshot.val() || "0"; // Update local status
        document.getElementById("ledToggle").checked = (Led1Status === "1"); // Update toggle state
        if (Led1Status === "1") {
            document.getElementById("countdown-message").innerText = "Renting is now Starting...";
            // Start countdown if LED is on and countdown is not already running
            if (!countdownInterval) {
                startCountdown(120); // Start countdown for 2 minutes
            }
        } else {
            document.getElementById("countdown-message").innerText = "Start Renting Unit001";
            clearInterval(countdownInterval); // Clear countdown if LED is off
            countdownInterval = null; // Reset countdown interval
        }
    });
}

function toggleLed() {
    var firebaseRef = firebase.database().ref().child("Led1Status");

    if (Led1Status === "1") { // If LED is currently on
        firebaseRef.set("0").then(() => {
            Led1Status = "0"; // Update local status
            clearInterval(countdownInterval); // Clear countdown
            document.getElementById("countdown-message").innerText = "Start Renting Unit001"; // Reset message
            countdownInterval = null; // Reset countdown interval
        }).catch((error) => {
            console.error("Error updating LED status:", error);
        });
    } else { // If LED is currently off
        firebaseRef.set("1").then(() => {
            Led1Status = "1"; // Update local status
            startCountdown(120); // Start countdown for 2 minutes
        }).catch((error) => {
            console.error("Error updating LED status:", error);
        });
    }
}

function startCountdown(seconds) {
    countdown = seconds;
    document.getElementById("startButton").style.display = "block"; // Show the START button
    document.getElementById("startButton").disabled = true; // Disable the START button
    countdownInterval = setInterval(function() {
        if (countdown > 0) {
            document.getElementById("countdown-message").innerText = "Credit Time: " + countdown + " seconds left";
            if (countdown <= 30) {
                document.getElementById("countdown-message").innerText = "Please Park in Designated Station: " + countdown + " seconds left";
            }
            countdown--; // Decrement countdown
        } else {
            clearInterval(countdownInterval); // Stop the countdown
            toggleOff(); // Turn off LED when countdown ends
            // document.getElementById("startButton").style.display = "none"; // Hide the START button
            document.getElementById("startButton").disabled = false; // Re-enable the START button
        }
    }, 1000);
}

function toggleOff() {
    var firebaseRef = firebase.database().ref().child("Led1Status");
    firebaseRef.set("0").then(() => {
        Led1Status = "0"; // Update local status
        document.getElementById("countdown-message").innerText = "Start Renting Unit001"; // Reset message
    }).catch((error) => {
        console.error("Error updating LED status:", error);
    });
}

// Event listener for the toggle button
document.getElementById("ledToggle").addEventListener("change", toggleLed);

// Read the initial LED status from Firebase
readLedStatus();

function enableLedToggle() {
   toggleLed();
    // Deduct 1 from totalRides
    let totalRidesElement = document.getElementById('totalRides');
    let currentTotalRides = parseInt(totalRidesElement.innerText);
    if (currentTotalRides > 0) {
        totalRidesElement.innerText = currentTotalRides - 1; // Decrement total rides
    }
}

function updateTotals() {
    let totalAmount = 0;
    let totalRides = 8;
    const totalCreditBalance = 200; // Assuming this is the total credit balance

    const ridesData = [
        { amount: 100, rides: 20, toggleId: 'toggle0' },
        { amount: 80, rides: 15, toggleId: 'toggle1' },
        { amount: 60, rides: 10, toggleId: 'toggle2' },
        { amount: 40, rides: 5, toggleId: 'toggle3' }
    ];

    ridesData.forEach(item => {
        const checkbox = document.getElementById(item.toggleId);
        if (checkbox.checked) {
            totalAmount += item.amount;
            totalRides += item.rides;
        }
    });

    document.getElementById('totalAmount').innerText = totalAmount;
    document.getElementById('totalRides').innerText = totalRides;    
    const buyButton = document.getElementById('buyButton');
    buyButton.disabled = totalCreditBalance < totalAmount || totalAmount === 0;
}

function buyCredits() {
    const totalAmount = parseInt(document.getElementById('totalAmount').innerText);
    const totalCreditBalanceElement = document.getElementById('totalCreditBalance'); // Assuming you have an element to display the total credit balance
    let totalCreditBalance = parseInt(totalCreditBalanceElement.innerText); // Get the current total credit balance

    if (totalCreditBalance >= totalAmount) {
        totalCreditBalance -= totalAmount; // Deduct the total amount from the credit balance
        totalCreditBalanceElement.innerText = totalCreditBalance; // Update the displayed credit balance
        alert('Purchase successful!'); // Optional: Notify the user
    } else {
        alert('Insufficient balance!'); // Optional: Notify the user
    }
}
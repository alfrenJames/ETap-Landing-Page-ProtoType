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

$(document).ready(function(){
    var database = firebase.database();
    var Led1Status;
    var WiFiStatus; // Add a variable for wifiStatus
    var countdown; // Variable for countdown timer
    var countdownInterval; // Variable for countdown interval

    database.ref().on("value", function(snap){
        Led1Status = snap.val().Led1Status;
        WiFiStatus = snap.val().WiFiStatus; // Get wifiStatus from Firebase
        updateToggleDisplay();

        // Start countdown if Led1Status is "1"
        if (Led1Status == "1" && !countdown) {
            startCountdown(120); // Start countdown for 2 minutes
			// $(".toggle-btn").prop("disabled", true); // Disable toggle button when countdown starts
        }
    });

	function updateToggleDisplay() {
        if(Led1Status == "1"){    
            document.getElementById("unact").style.display = "none";
            document.getElementById("act").style.display = "block";
            $(".toggle-btn").prop("disabled", true); // Disable toggle button if on
        } else {
            document.getElementById("unact").style.display = "block";
            document.getElementById("act").style.display = "none";
            $(".toggle-btn").prop("disabled", false); // Enable toggle button if off
        }
    }

    function startCountdown(seconds) {
        countdown = seconds;
        countdownInterval = setInterval(function() {
            if (countdown > 30) {
                document.getElementById("countdown-message").innerText = "Ongoing Renting: " + countdown + " seconds left";
            } else if (countdown <= 30 && countdown > 0) {
                document.getElementById("countdown-message").innerText = "Please Park in Designated Station: " + countdown + " seconds left";
            } else {
                clearInterval(countdownInterval);
                toggleOff();
                document.getElementById("countdown-message").innerText = "Start Renting will appear";
            }
            countdown--;
        }, 1000);
    }

    function toggleOff() {
        var firebaseRef = firebase.database().ref().child("Led1Status");
        firebaseRef.set("0");
        Led1Status = "0";
        updateToggleDisplay();
        countdown = null; // Reset countdown
    }

    $(".toggle-btn").click(function(){
        var firebaseRef = firebase.database().ref().child("Led1Status");

        if(Led1Status == "1"){    // post to firebase
            firebaseRef.set("0");
            Led1Status = "0";
            clearInterval(countdownInterval); // Clear countdown if toggled off
            countdown = null; // Reset countdown
            document.getElementById("countdown-message").innerText = "Start Renting will appear"; // Reset message
        } else {
            firebaseRef.set("1");
            Led1Status = "1";
            startCountdown(120); // Start countdown for 2 minutes
        }
    });

    // Add click event for wifi toggle button
    $(".wifi-toggle-btn").click(function(){
        var wifiRef = firebase.database().ref().child("WiFiStatus");

        if(WiFiStatus == "1"){    
            wifiRef.set("0");
            WiFiStatus = "0";
        } else {
            wifiRef.set("1");
            WiFiStatus = "1";
        }
    });
});
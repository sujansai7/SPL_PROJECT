registerSubmit = function() {
    console.log("registerSubmit");
    var firstname = document.getElementById("firstName").value;
    var lastname = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8001/signup", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(JSON.stringify({firstname: firstname, lastname: lastname, email: email, password: password}));
    xhttp.onreadystatechange = function() {
        // read the response
        let response = JSON.parse(xhttp.responseText);
        console.log(response.message);
        if (response.message == "Email already exists") {
            alert("Email already exists");
        } else {
            // redirect
            window.location.href = "http://localhost:5500/frontend/HTML/login.html";
        }
    };
}

loginSubmit = function() {
    console.log("loginSubmit");
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8001/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(JSON.stringify({email: email, password: password}));
    xhttp.onreadystatechange = function() {
        // read the response
        let response1 = JSON.parse(xhttp.responseText);
        console.log(response1.message);
        if (response1.message == "Invalid Credentials") {
            alert("Invalid credentials");
        } else {
            // redirect
            window.location.href = "http://localhost:5500/frontend/HTML/booking.html";
        }
    };
}
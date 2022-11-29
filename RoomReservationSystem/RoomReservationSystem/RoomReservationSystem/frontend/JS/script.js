let slots = [
    '8:30AM - 9:00AM',
    '9:00AM - 9:30AM',
    '9:30AM - 10:00AM',
    '10:00AM - 10:30AM',
    '10:30AM - 11:00AM',
    '11:00AM - 11:30AM',
    '11:30AM - 12:00PM',
    '12:00PM - 12:30PM',
    '12:30PM - 1:00PM',
    '1:00PM - 1:30PM',
    '1:30PM - 2:00PM',
    '2:00PM - 2:30PM',
    '2:30PM - 3:00PM',
    '3:00PM - 3:30PM',
    '3:30PM - 4:00PM',
    '4:00PM - 4:30PM',
    '4:30PM - 5:00PM',
    '5:00PM - 5:30PM',
    '5:30PM - 6:00PM',
    '6:00PM - 6:30PM',
    '6:30PM - 7:00PM'
]

bookPartOne = function (){
    let room = document.getElementById("room").value;
    let date = document.getElementById("datepicker").value;
    if (room == "" || date == "") {
        alert("Please select a date");
        return
    }


    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8001/bookOne", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(JSON.stringify({ room: room, date: date }));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let ele = document.getElementById("slots");
            let ele2 = document.getElementById("slots").getElementsByTagName("li").length;
            if (ele2 > 0) {
                for (let i = 0; i < ele2; i++) {
                    ele.removeChild(ele.childNodes[0]);
                }
            }



            let response = xhttp.responseText
            let resp2 = JSON.parse(response)
            
            if (resp2==null) {
                for (let i = 0; i < slots.length; i++) {
                    let li = document.createElement("li");
                    li.innerHTML = slots[i];
                    ele.appendChild(li);
                    
                }
            }
            else {
                for (let i = 0; i < slots.length; i++) {
                    let li = document.createElement("li");
                    if (resp2.includes(slots[i])) {
                    } else {
                        li.innerHTML = slots[i];
                        ele.appendChild(li);
                    }
                    
                }
            }
        }
    };
}

bookPartTwo = function (){
    let room = document.getElementById("room").value;
    let date = document.getElementById("datepicker").value;
    if (room == "" || date == "") {
        alert("Please select a date");
        return
    }


    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8001/bookOne", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(JSON.stringify({ room: room, date: date }));
    xhttp.onreadystatechange = function () {
        // empty dropdown
        let ele = document.getElementById("time")
        let ele2 = document.getElementById("time").getElementsByTagName("option").length;
        if (ele2 > 0) {
            for (let i = 0; i < ele2; i++) {
                ele.removeChild(ele.childNodes[0]);
            }
        }

        if (this.readyState == 4 && this.status == 200) {
            let response = xhttp.responseText
            let resp2 = JSON.parse(response)
            
            
            if (resp2==null) {
                console.log("asdf")
                for (let i = 0; i < slots.length; i++) {
                    let option = document.createElement("option");
                    option.text = slots[i];
                    ele.add(option);
                }
            }
            else {
                for (let i = 0; i < slots.length; i++) {
                    let option = document.createElement("option");
                    if (resp2.includes(slots[i])) {
                    } else {
                        option.text = slots[i];
                        ele.add(option);
                    }
                    
                }
            }
        }
    };
}


registerSubmit = function () {
    var firstname = document.getElementById("firstName").value;
    var lastname = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8001/signup", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(JSON.stringify({ firstname: firstname, lastname: lastname, email: email, password: password }));
    xhttp.onreadystatechange = function () {
        // read the response
        let response = JSON.parse(xhttp.responseText);
        console.log(response.message);
        if (response.message == "Email already exists") {
            alert("Email already exists");
        } else {
            // redirect
            window.location.href = "http://127.0.0.1:5500/frontend/HTML/login.html";
        }
    };
}

loginSubmit = function () {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8001/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(JSON.stringify({ email: email, password: password }));
    xhttp.onreadystatechange = function () {
        // read the response
        let response1 = JSON.parse(xhttp.responseText);
        console.log(response1.message);
        if (response1.message == "Invalid Credentials") {
            alert("Invalid credentials");
        } else {
            // redirect
            window.location.href = "http://127.0.0.1:5500/frontend/HTML/availibility.html";
        }
    };
}

populateDropdown = function () {
    let ele = document.getElementById("room")
    let rooms = [
        {
            "room": "Room 1"
        },
        {
            "room": "Room 2"
        },
        {
            "room": "Room 3"
        },
        {
            "room": "Room 4"
        },
        {
            "room": "Room 5"
        },
    ]
    for (let i = 0; i < rooms.length; i++) {
        let option = document.createElement("option");
        option.text = rooms[i].room;
        ele.add(option);
    }
}

confirmBooking = function(){
    let room = document.getElementById("room").value;
    let date = document.getElementById("datepicker").value;
    let time = document.getElementById("time").value;

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8001/bookTwo", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(JSON.stringify({ room: room, date: date, time: time }));
    xhttp.onreadystatechange = function () {
        // read the response
        let response = JSON.parse(xhttp.responseText);
        console.log(response.message);
        if (response.message == "Booking Confirmed") {
            window.location.href = "http://127.0.0.1:5500/frontend/HTML/bookingConfirm.html";
        } else {
            // redirect
            alert("Booking failed");
            window.location.href = "http://127.0.0.1:5500/frontend/HTML/booking.html";
        }
    };

}
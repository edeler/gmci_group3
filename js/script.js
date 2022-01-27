function saveValues() {
    var persons = document.getElementById("anzahl");
    if (persons != null) {
        console.log(persons.value + " Personen");
        sessionStorage.setItem('persons', persons.value);
    }

    var date = document.getElementById('button_normal_clicked');
    if (date == null) date = document.getElementById('button_today_clicked');
    if (date != null) {
        var date_string = date.innerHTML + "." + (new Date().getMonth() + 1) + "." + (new Date().getFullYear());
        console.log(date_string);
        sessionStorage.setItem('date', date_string);
    }

    var slot = document.getElementById('button_slots_clicked');
    if (slot != null) {
        console.log(slot.innerHTML);
        sessionStorage.setItem('time', slot.innerHTML);
    }

    var tables = document.getElementsByClassName("table-selected").length;
    if (tables > -1) {
        console.log("Tables: " + tables);
        sessionStorage.setItem('tables', tables);
    }

    var barChairsList = document.querySelectorAll(".bar-chair");
    var barChairs = 0;
    if (barChairsList.length > 0) {
        for (let index = 0; index < barChairsList.length; index++) {
            if (barChairsList[index].classList.contains("chair-selected")) barChairs++;            
        }
    }
    if (barChairs > 0) {
        console.log("Bar chairs: " + barChairs);
        sessionStorage.setItem('barChairs', barChairs);
    } else if (barChairs == 0) {
        console.log("Bar chairs: " + barChairs);
        sessionStorage.setItem('barChairs', barChairs);
    }

    generateBookingNotification();
}

function generateBookingNotification() {
    var booking_field = document.getElementById("booking-notification");
    booking_field.style.display = 'block';
    booking_field.innerHTML = '<h4 style="margin: 0;">Booking</h4>';

    var persons = sessionStorage.getItem('persons');
    if (persons != null) {
        booking_field.innerHTML += '</br>' + persons + " Personen";
    }

    var date = sessionStorage.getItem('date');
    if (date != null) {
        booking_field.innerHTML += '</br>' + date;
    }

    var slot = sessionStorage.getItem('time');
    if (slot != null) {
        booking_field.innerHTML += '</br>' + slot;
    }

    var tables = sessionStorage.getItem('tables');
    if (tables > 0) {
        booking_field.innerHTML += '</br></br>' + tables + ' Tische';
    }

    var barChairs = sessionStorage.getItem('barChairs');
    if (barChairs > 0) {
        if (tables == 0) booking_field.innerHTML += '</br>';
        booking_field.innerHTML += '</br>' + barChairs + ' Barplätze';
    }
}

function getDataAndSwitchTo(page) {
    window.location.href = page;
}

function resetValues() {
    if (sessionStorage.getItem('timeBooked') != 'true') {
        sessionStorage.removeItem('persons');
        sessionStorage.removeItem('time');
        sessionStorage.removeItem('date');
    }
}

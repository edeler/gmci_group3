// Kalendar stuff
    var Cal = function(divId) {

    //Store div id
    this.divId = divId;

    // Days of week, starting on Sunday
    this.Days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri','Sat', 'Sun'];

    // Months, stating on January
    this.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

    // Set the current month, year
    var d = new Date();

    this.currMonth = d.getMonth();
    this.currYear = d.getFullYear();
    this.currDay = d.getDate();

    };

    // Goes to next month
    Cal.prototype.nextMonth = function() {
    if ( this.currMonth == 11 ) {
    this.currMonth = 0;
    this.currYear = this.currYear + 1;
    }
    else {
    this.currMonth = this.currMonth + 1;
    }
    this.showcurr();
    };

    // Goes to previous month
    Cal.prototype.previousMonth = function() {
    if ( this.currMonth == 0 ) {
    this.currMonth = 11;
    this.currYear = this.currYear - 1;
    }
    else {
    this.currMonth = this.currMonth - 1;
    }
    this.showcurr();
    };

    // Show current month
    Cal.prototype.showcurr = function() {
    this.showMonth(this.currYear, this.currMonth);
    };

    // Show month (year, month)
    Cal.prototype.showMonth = function(y, m) {

    var d = new Date()
    // First day of the week in the selected month
    , firstDayOfMonth = new Date(y, m, 1).getDay()
    // Last day of the selected month
    , lastDateOfMonth =  new Date(y, m+1, 0).getDate()
    // Last day of the previous month
    , lastDayOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();


    var html = '<table>';

    // Write selected month and year
    html += '<thead><tr>';
    html += '<td colspan="7">' + this.Months[m] + ' ' + y + '</td>';
    html += '</tr></thead>';


    // Write the header of the days of the week
    html += '<tr class="days">';
    for(var i=0; i < this.Days.length;i++) {
    html += '<td>' + this.Days[i] + '</td>';
    }
    html += '</tr>';

    // Write the days
    var i=1;
    do {

    var dow = new Date(y, m, i).getDay();

    // If Sunday, start new row
    if ( dow == 0 ) {
        html += '<tr>';
    }
    // If not Sunday but first day of the month
    // it will write the last days from the previous month
    else if ( i == 1 ) {
        html += '<tr>';
        var k = lastDayOfLastMonth - firstDayOfMonth+1;
        for(var j=0; j < firstDayOfMonth; j++) {
        html += '<td class="not-current">' + k + '</td>';
        k++;
        }
    }

    // Write the current day in the loop
    var chk = new Date();
    var chkY = chk.getFullYear();
    var chkM = chk.getMonth();
    // console.log("start_vergleich")
    // console.log(chkY)
    // console.log(this.currYear)
    // console.log(chkM)
    // console.log(this.currMonth)
    // console.log(i)
    // console.log(this.currDay)
    if (chkY == this.currYear && chkM == this.currMonth && i == this.currDay) {
        
        html += '<td class="today"><button id="button_today" type="button" onclick="setBackgroundColorByClick(this)">' + i + '</button></td>';
    }else if((chkY > this.currYear) || (chkY >= this.currYear && chkM >= this.currMonth) && i < this.currDay){
        html += '<td class="past">' + i + '</td>';
    }else if((chkY + 1 < this.currYear) || (chkY == this.currYear && chkM + 1 < this.currMonth)){
        html += '<td class="farfuture">' + i + '</td>';
    }else {
        html += '<td class="normal"><button id="button_normal" type="button" onclick="setBackgroundColorByClick(this)">' + i + '</button></td>';
    }
    // If Saturday, closes the row
    if ( dow == 6 ) {
        html += '</tr>';
    }
    // If not Saturday, but last day of the selected month
    // it will write the next few days from the next month
    else if ( i == lastDateOfMonth ) {
        var k=1;
        for(dow; dow < 6; dow++) {
        html += '<td class="not-current">' + k + '</td>';
        k++;
        }
    }

    i++;
    }while(i <= lastDateOfMonth);

    // Closes table
    html += '</table>';

    // Write HTML to the div
    document.getElementById(this.divId).innerHTML = html;
    };
    
    // Start calendar
    function start_calendar(){
        var c = new Cal("divCal");			
        c.showcurr();

        // Bind next and previous button clicks
        getId('btnNext').onclick = function() {
        c.nextMonth();
        };
        getId('btnPrev').onclick = function() {
        c.previousMonth();
        };
    }

    // Get element by id
    function getId(id) {
    return document.getElementById(id);
    }

    function setBackgroundColorByClick(clickedButton){
        // needs to be fixed.
        // if(clickedButton.id == "button_slots"){
            (clickedButton.style.backgroundColor == '#7FFF00') ? clickedButton.style.backgroundColor='#8b20d5' : clickedButton.style.backgroundColor='#7FFF00';
        // }
    }

    // mögliche Uhrzeiten
    var slots = ["10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "18:00 - 19:00", "19:00 - 20:00"];
    //zeitslots
    function zeit_slot(){
        
        var text = "<table>";
        text += '<thead><tr>';
        text += '<td colspan="2">' + "Zeitslot" + '</td>';
        text += '</tr></thead>';

        var seats = Array.from({length: 8}, () => Math.floor(Math.random() * 99));

        for( var i = 0; i < slots.length; i++){
            text += "<tr>" + "<td>" + '<button id="button_slots" type="button"' + ' onclick="setBackgroundColorByClick(this)">' + slots[i] + '</button>' + "</td>" + "<td>" + seats[i] + "</td>" + "/<tr>";
        }

        text += "</table>";
        document.getElementById("Zeitslots").innerHTML = text;
    }



    // On Load of the window
    window.onload = function(){
        this.start_calendar();
        this.zeit_slot();
    }
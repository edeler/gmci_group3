// Table object to ecapsulate information
class Table {
    constructor (roomID, orientation, row, column) {
        this.roomID = roomID;
        this.orientation = orientation;
        this.row = row;
        this.column = column;
    }
}

// Create a table in the DOM tree
function setTable (t) {
    var table = document.createElement("div");
    table.className = 'table-container ';

    switch (t.orientation) {
        case "east-west":
            table.classList.add('table-container-east-west');
            table.addEventListener('contextmenu', function(ev) {
                ev.preventDefault();
                rotateTable(this);
                return false;
            }, false);

            var chair_1 = document.createElement("div");
            chair_1.classList.add("chair", "chair-east-west");
            table.appendChild(chair_1);

            var tab = document.createElement("div");
            tab.classList.add("table", "table-east-west");
            table.appendChild(tab);

            var chair_2 = document.createElement("div");
            chair_2.classList.add("chair", "chair-east-west");
            table.appendChild(chair_2);

            table.draggable = "true";                    
            table.addEventListener('dragstart', function(ev) {
                var src = ev.target.id;
                var orientation = ev.target.classList[1].replace("table-container-", "");
                ev.dataTransfer.setData("text/plain", src + "_" + orientation);
            });
            break;

        case "north-south":
            table.classList.add('table-container-north-south');
            table.addEventListener('contextmenu', function(ev) {
                ev.preventDefault();
                rotateTable(this);
                return false;
            }, false);

            var chair_1 = document.createElement("div");
            chair_1.classList.add("chair", "chair-north-south");
            table.appendChild(chair_1);

            var tab = document.createElement("div");
            tab.classList.add("table", "table-north-south");
            table.appendChild(tab);

            var chair_2 = document.createElement("div");
            chair_2.classList.add("chair", "chair-north-south");
            table.appendChild(chair_2);

            table.draggable = "true";                    
            table.addEventListener('dragstart', function(ev) {
                var src = ev.target.id;
                var orientation = ev.target.classList[1].replace("table-container-", "");
                ev.dataTransfer.setData("text/plain", src + "_" + orientation);
            });
            break;

        case "empty":
            table.classList.add('table-container-empty');
            
            table.addEventListener('dragleave', function(ev) {
                ev.preventDefault();
                ev.target.style.background = "var(--floor-color)";
            });
            
            table.addEventListener('dragenter', function(ev) {
                ev.preventDefault();
                ev.target.style.background = "var(--floor-color-hover)";
            });
            
            table.addEventListener('drop', function(ev) {
                ev.preventDefault();

                var data = ev.dataTransfer.getData("text/plain").split("_");
                var src  = document.getElementById(ev.dataTransfer.getData("text/plain").replace("_" + data[3], ""));

                setTable(new Table(t.roomID, data[3], t.row, t.column));
                setTable(new Table(data[0], 'empty', data[2], data[1]));
            });
            
            table.addEventListener('dragover', function(ev) {
                ev.preventDefault();
            });
            break;
    
        default:
            break;
    }

    table.style = "grid-column: " + t.column + "; grid-row: " + t.row + ";";
    table.id = t.roomID + "_" + t.column + "_" + t.row;

    var element = document.getElementById(table.id);
    if (element != null) element.parentNode.removeChild(element);

    document.getElementById(t.roomID).appendChild(table);
}

function printTableListToConsole(){
    var tables = document.getElementsByClassName("table-container");
    var output = new Array();

    for (const element of tables) {
        if (!element.classList.contains("table-container-empty")) {
            var parts = element.id.split("_");

            var tableString = "('";
            tableString += parts[0] + "', '"; // room
            tableString += element.classList[1].replace("table-container-", "") + "', "; // orientation
            tableString += parts[1] + ", "; // row
            tableString += parts[2] + "),\n"; // column
            
            output += tableString;
        }
    }

    console.log(output);
}

// Rotate a table 90°
function rotateTable(element) {
    if (element.classList.contains("table-container-north-south")) {
        element.classList.remove("table-container-north-south");
        element.classList.add("table-container-east-west");

        element.childNodes[0].classList.remove("chair-north-south");
        element.childNodes[0].classList.add("chair-east-west");

        element.childNodes[1].classList.remove("table-north-south");
        element.childNodes[1].classList.add("table-east-west");

        element.childNodes[2].classList.remove("chair-north-south");
        element.childNodes[2].classList.add("chair-east-west");
    } else {
        element.classList.remove("table-container-east-west");
        element.classList.add("table-container-north-south");

        element.childNodes[0].classList.remove("chair-east-west");
        element.childNodes[0].classList.add("chair-north-south");

        element.childNodes[1].classList.remove("table-east-west");
        element.childNodes[1].classList.add("table-north-south");

        element.childNodes[2].classList.remove("chair-east-west");
        element.childNodes[2].classList.add("chair-north-south");
    }

    return false;
}

// Set all grid cell to empty fields
function populateEmptyFields() {
    // Bar: 6x12 grid
    for (var r = 1; r <= 6; r++) {
        for (var c = 1; c <= 12; c++) {
            setTable(new Table('bar', 'empty', r, c));
        }
    }

    // Dining Room: 6x10 grid
    for (var r = 1; r <= 6; r++) {
        for (var c = 1; c <= 10; c++) {
            setTable(new Table('dining-room', 'empty', r, c));
        }
    }

    // Outside Area: 4x23 grid
    for (var r = 1; r <= 4; r++) {
        for (var c = 1; c <= 23; c++) {
            setTable(new Table('outside', 'empty', r, c));
        }
    }
}

// Remove the empty elements under the bar
function removeEmptyFieldsForBar(){
    var toRemove = ["bar_4_2", "bar_5_2", "bar_6_2", "bar_7_2", "bar_8_1"];

    toRemove.forEach(element => {
        var el = document.getElementById(element);
        el.parentNode.removeChild(el);
    });
}

// Default set of tables at page load
var presetTables = 
[
    new Table('dining-room', 'north-south', 1, 3),
    new Table('dining-room', 'north-south', 4, 2),
    new Table('dining-room', 'north-south', 4, 3),
    new Table('dining-room', 'north-south', 6, 3),
    new Table('dining-room', 'north-south', 6, 4),
    new Table('dining-room', 'north-south', 6, 5),
    new Table('dining-room', 'north-south', 1, 6),
    new Table('dining-room', 'north-south', 1, 7),
    new Table('dining-room', 'north-south', 5, 8),
    new Table('dining-room', 'east-west', 1, 1),
    new Table('dining-room', 'east-west', 4, 6),
    new Table('dining-room', 'east-west', 2, 10),
    new Table('dining-room', 'east-west', 3, 10),
    new Table('dining-room', 'east-west', 4, 10),
    new Table('dining-room', 'east-west', 5, 10),
    new Table('outside', 'north-south', 1, 20),
    new Table('outside', 'north-south', 1, 21),
    new Table('outside', 'north-south', 1, 22),
    new Table('outside', 'north-south', 4, 22),
    new Table('bar', 'north-south', 5, 8),
    new Table('bar', 'north-south', 5, 4),
    new Table('bar', 'east-west', 4, 11),
    new Table('bar', 'east-west', 5, 11)
];

// Sets up all tabels
function setupTables() {
    populateEmptyFields();
    removeEmptyFieldsForBar();
    presetTables.forEach(element => {
        setTable(element);
    });
}

// Run setup on load
window.onload = function() { setupTables(); };
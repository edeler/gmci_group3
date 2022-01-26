// Table object to ecapsulate information
class Table {
    constructor (roomID, orientation, row, column, reserved) {
        this.roomID = roomID;
        this.orientation = orientation;
        this.row = row;
        this.column = column;
        this.reserved = reserved;
    }
}

// Create a table in the DOM tree
function setTable (t) {
    var table = document.createElement("div");
    table.className = 'table-container ';

    switch (t.orientation) {
        case "east-west":
            table.classList.add('table-container-east-west');
            if (t.roomID == 'table-pool') table.classList.add('table-container-pool');

            var chair_1 = document.createElement("div");
            chair_1.classList.add("chair", "chair-east-west");
            if (t.reserved) chair_1.classList.add('chair-selected');
            table.appendChild(chair_1);

            var tab = document.createElement("div");
            tab.classList.add("table", "table-east-west");
            if (t.reserved) tab.classList.add('table-selected');
            table.appendChild(tab);

            var chair_2 = document.createElement("div");
            chair_2.classList.add("chair", "chair-east-west");
            if (t.reserved) chair_2.classList.add('chair-selected');
            table.appendChild(chair_2);

            table.draggable = "true";                    
            table.addEventListener('dragstart', function(ev) {
                var src = ev.target.id;
                var orientation = ev.target.classList[1].replace("table-container-", "");
                ev.dataTransfer.setData("text/plain", src + "_" + orientation);
            });

            table.addEventListener('contextmenu', function(ev) {
                ev.preventDefault();
                rotateTable(this);
                return false;
            }, false);

            table.addEventListener('click', function(ev) {
                toggleTableSelection(this);
            });

            break;

        case "north-south":
            table.classList.add('table-container-north-south');
            if (t.roomID == 'table-pool') table.classList.add('table-container-pool');

            var chair_1 = document.createElement("div");
            chair_1.classList.add("chair", "chair-north-south");
            if (t.reserved) chair_1.classList.add('chair-selected');
            table.appendChild(chair_1);

            var tab = document.createElement("div");
            tab.classList.add("table", "table-north-south");
            if (t.reserved) tab.classList.add('table-selected');
            table.appendChild(tab);

            var chair_2 = document.createElement("div");
            chair_2.classList.add("chair", "chair-north-south");
            if (t.reserved) chair_2.classList.add('chair-selected');
            table.appendChild(chair_2);

            table.draggable = "true";                    
            table.addEventListener('dragstart', function(ev) {
                var src = ev.target.id;
                var orientation = ev.target.classList[1].replace("table-container-", "");
                ev.dataTransfer.setData("text/plain", src + "_" + orientation);
            });

            table.addEventListener('contextmenu', function(ev) {
                ev.preventDefault();
                rotateTable(this);
                return false;
            }, false);

            table.addEventListener('click', function(ev) {
                toggleTableSelection(this);
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

                // Drop a new table
                var res = (data[3] == 'true');
                setTable(new Table(t.roomID, data[4], t.row, t.column, res));

                // Remove the old table
                if (data[0] == 'table-pool') {
                    var src  = document.getElementById(ev.dataTransfer.getData("text/plain").replace("_" + data[4], ""));
                    var tablePool = document.getElementById('table-pool');
                    tablePool.removeChild(src);
                } else {
                    setTable(new Table(data[0], 'empty', data[2], data[1], false));
                }
                ev.target.style.background = "var(--floor-color)";
            });
            
            table.addEventListener('dragover', function(ev) {
                ev.preventDefault();
            });
            break;
    
        default:
            break;
    }

    if (t.roomID != 'table-pool') table.style = "grid-column: " + t.column + "; grid-row: " + t.row + ";";
    table.id = t.roomID + "_" + t.column + "_" + t.row + "_" + t.reserved;

    var element = document.getElementById(table.id);
    if (element != null) element.parentNode.removeChild(element);

    document.getElementById(t.roomID).appendChild(table);
}

// Find the next highest index in the table pool
function getNewMaxTableIndex() {
    var max = -1;

    var tables = document.getElementsByClassName("table-container-pool");
    for (const element of tables) {
        var index =  parseInt(element.id.split("_")[1]);
        if (index > max) max = index;
    }

    return max + 1;
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
            tableString += parts[2] + ", "; // row
            tableString += parts[1] + ", "; // column
            tableString += parts[3] + "),\n"; // reserved
            
            output += tableString;
        }
    }

    console.log(output);
}

function setupTablePool() {
    var tablePool = document.getElementById('table-pool');
            
    tablePool.addEventListener('dragleave', function(ev) {
        ev.preventDefault();
    });
    
    tablePool.addEventListener('dragenter', function(ev) {
        ev.preventDefault();
    });
    
    tablePool.addEventListener('drop', function(ev) {
        ev.preventDefault();

        var data = ev.dataTransfer.getData("text/plain").split("_");

        // Drop a new table
        var res = (data[3] === 'true');
        setTable(new Table('table-pool', data[4], 1, getNewMaxTableIndex(), res));

        // Remove the old table
        if (data[0] == 'table-pool') {
            var src  = document.getElementById(ev.dataTransfer.getData("text/plain").replace("_" + data[4], ""));
            tablePool.removeChild(src);
        } else {
            setTable(new Table(data[0], 'empty', data[2], data[1], false));
        }
        ev.target.style.background = "var(--floor-color)";
    });
    
    tablePool.addEventListener('dragover', function(ev) {
        ev.preventDefault();
    });
}

// Setup all bar elements
function setupBar() {
    // Bottom row of bar tables
    for (var i = 4; i <= 7; i++) {
        var barElement = document.createElement("div");
        barElement.className = 'bar-container-horizontal';
        barElement.style = 'grid-column: ' + i + '; grid-row: 2;';

        var table = document.createElement("div");
        table.className = 'bar-table';
        barElement.appendChild(table);
        
        var chair_left = document.createElement("div");
        chair_left.classList.add('bar-chair');        

        chair_left.addEventListener('click', function(ev) {
            toggleBarChairSelection(this);
        });

        barElement.appendChild(chair_left);
        
        var chair_right = document.createElement("div");
        chair_right.classList.add('bar-chair');        

        chair_right.addEventListener('click', function(ev) {
            toggleBarChairSelection(this);
        });

        barElement.appendChild(chair_right);
        document.getElementById('bar').appendChild(barElement);
    }

    // Corner bar table
    var barElement = document.createElement("div");
    barElement.className = 'bar-container-horizontal';
    barElement.style = 'grid-column: 8; grid-row: 2;';

    var table = document.createElement("div");
    table.className = 'bar-table';
    table.style = 'width: 40%;';
    barElement.appendChild(table);

    document.getElementById('bar').appendChild(barElement);

    // Right bar table
    var barElement = document.createElement("div");
    barElement.className = 'bar-container-horizontal';
    barElement.style = 'grid-column: 8; grid-row: 1; display: flex;';

    var table = document.createElement("div");
    table.className = 'bar-table-vertical';
    barElement.appendChild(table);
    
    var chairContainer = document.createElement("div");
    chairContainer.style = 'display: flex; flex-direction: column; justify-content: center; width: 60%;';

    var chair_upper = document.createElement("div");
    chair_upper.classList.add('bar-chair');
    chair_upper.style = 'width: 50%;';        

    chair_upper.addEventListener('click', function(ev) {
        toggleBarChairSelection(this);
    });

    chairContainer.appendChild(chair_upper);
    
    var chair_lower = document.createElement("div");
    chair_lower.classList.add('bar-chair');
    chair_lower.style = 'width: 50%;';

    chair_lower.addEventListener('click', function(ev) {
        toggleBarChairSelection(this);
    });

    chairContainer.appendChild(chair_lower);
    barElement.appendChild(chairContainer);
    document.getElementById('bar').appendChild(barElement);
}

// Mark tables that were selected by the user
function toggleTableSelection(element) {
    if (!element.id.startsWith('table-pool')) {
        if (element.childNodes[0].classList.contains("chair-selected")) {
            element.childNodes[0].classList.remove("chair-selected");
            element.childNodes[1].classList.remove("table-selected");
            element.childNodes[2].classList.remove("chair-selected");
            numberOfBookableTables++;
        } else if (numberOfBookableTables > 0) {
            element.childNodes[0].classList.add("chair-selected");
            element.childNodes[1].classList.add("table-selected");
            element.childNodes[2].classList.add("chair-selected");
            numberOfBookableTables--;
        }
    }
}

// Mark bar chairs that were selected by the user
function toggleBarChairSelection(element) {
    if (element.classList.contains("chair-selected")) {
        element.classList.remove("chair-selected");
        numberOfBookableBarChairs++;
    } else if (numberOfBookableBarChairs > 0) {
        element.classList.add("chair-selected");
        numberOfBookableBarChairs--;
    }
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
            setTable(new Table('bar', 'empty', r, c, false));
        }
    }

    // Dining Room: 6x10 grid
    for (var r = 1; r <= 6; r++) {
        for (var c = 1; c <= 10; c++) {
            setTable(new Table('dining-room', 'empty', r, c, false));
        }
    }

    // Outside Area: 4x23 grid
    for (var r = 1; r <= 4; r++) {
        for (var c = 1; c <= 23; c++) {
            setTable(new Table('outside', 'empty', r, c, false));
        }
    }
}

// Remove the empty elements under the bar
function removeEmptyFieldsForBar(){
    var toRemove = ["bar_4_2_false", "bar_5_2_false", "bar_6_2_false", "bar_7_2_false", "bar_8_1_false"];

    for (const element of toRemove) {
        var el = document.getElementById(element);
        el.parentNode.removeChild(el);
    }
}

// Default set of tables at page load
var presetTables = 
[
    new Table('dining-room', 'north-south', 1, 3, false),
    new Table('dining-room', 'north-south', 4, 2, false),
    new Table('dining-room', 'north-south', 4, 3, false),
    new Table('dining-room', 'north-south', 6, 3, false),
    new Table('dining-room', 'north-south', 6, 4, false),
    new Table('dining-room', 'north-south', 6, 5, false),
    new Table('dining-room', 'north-south', 1, 6, false),
    new Table('dining-room', 'north-south', 1, 7, false),
    new Table('dining-room', 'north-south', 5, 8, false),
    new Table('dining-room', 'east-west', 2, 10, false),
    new Table('dining-room', 'east-west', 3, 10, false),
    new Table('dining-room', 'east-west', 4, 10, false),
    new Table('dining-room', 'east-west', 5, 10, false),
    new Table('dining-room', 'east-west', 1, 1, false),
    new Table('dining-room', 'east-west', 4, 6, false),
    new Table('dining-room', 'east-west', 2, 1, false),
    new Table('dining-room', 'east-west', 6, 1, false),
    new Table('table-pool', 'north-south', 1, 1, false),
    new Table('table-pool', 'north-south', 1, 3, false),
    new Table('table-pool', 'north-south', 1, 4, false),
    new Table('table-pool', 'north-south', 1, 7, false),
    new Table('table-pool', 'east-west', 1, 2, false),
    new Table('table-pool', 'east-west', 1, 5, false),
    new Table('table-pool', 'east-west', 1, 6, false),
    new Table('outside', 'north-south', 1, 20, false),
    new Table('outside', 'north-south', 1, 21, false),
    new Table('outside', 'north-south', 1, 22, false),
    new Table('outside', 'north-south', 4, 22, false),
    new Table('outside', 'north-south', 1, 10, false),
    new Table('outside', 'north-south', 4, 11, false),
    new Table('outside', 'north-south', 4, 12, false),
    new Table('outside', 'north-south', 4, 13, false),
    new Table('outside', 'north-south', 1, 17, false),
    new Table('outside', 'north-south', 4, 17, false),
    new Table('outside', 'north-south', 4, 16, false),
    new Table('outside', 'north-south', 4, 2, false),
    new Table('outside', 'north-south', 4, 3, false),
    new Table('outside', 'north-south', 2, 3, false),
    new Table('outside', 'north-south', 1, 6, false),
    new Table('outside', 'north-south', 1, 7, false),
    new Table('outside', 'north-south', 1, 8, false),
    new Table('outside', 'north-south', 1, 9, false),
    new Table('outside', 'east-west', 1, 12, false),
    new Table('outside', 'east-west', 2, 12, false),
    new Table('outside', 'east-west', 1, 15, false),
    new Table('outside', 'east-west', 4, 19, false),
    new Table('outside', 'east-west', 3, 19, false),
    new Table('outside', 'east-west', 1, 1, false),
    new Table('outside', 'east-west', 2, 1, false),
    new Table('outside', 'east-west', 3, 6, false),
    new Table('outside', 'east-west', 4, 8, false),
    new Table('bar', 'north-south', 1, 12, false),
    new Table('bar', 'north-south', 1, 11, false),
    new Table('bar', 'north-south', 5, 8, false),
    new Table('bar', 'north-south', 5, 4, false),
    new Table('bar', 'east-west', 4, 11, false),
    new Table('bar', 'east-west', 5, 11, false),
    new Table('bar', 'east-west', 6, 6, false),
    new Table('bar', 'east-west', 5, 6, false),
    new Table('bar', 'east-west', 4, 6, false),
    new Table('bar', 'east-west', 6, 1, false),
    new Table('bar', 'east-west', 5, 1, false),
];

// Sets up all tabels
function setupTables() {
    populateEmptyFields();
    removeEmptyFieldsForBar();
    setupBar();
    presetTables.forEach(element => {
        setTable(element);
    });
    setupTablePool();
}

// Global variables
var numberOfBookableTables = 4;
var numberOfBookableBarChairs = 2;

// Run setup on load
window.onload = function() { setupTables(); };
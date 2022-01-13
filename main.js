/*
 This document allows the navigation in main.html and
gets the information of the other documents.
*/

// object order
class Order {
    constructor (date, order, firstname, lastName, tableNumber) {
        this.date = date;
        // order is an array of strings
        this.order = order
        this.firstname = firstname;
        this.lastName = lastName;
        this.tableNumber = tableNumber;
    }
    order_price = compute_order_price(this.order);
}
// global variable for object order
personal_order= new Order();

function setDate(date){
    this.order.date = date;
}

function compute_order_price(element){
    // for i in order.length return sum
}

function navigator(){

    // fester Ablauf oder doch untere Leiste, wo jederzeit zurückgesprungen werden kann?

    document.getElementById("navigator_text").innerHTML = "Choose a date.";
    // paused while user selects a date.
    // if user wants to end.
    // user selected a date
    setDate(date);
    document.getElementById("navigator_text").innerHTML = "Now choose any meal(s) or drink from our menu. You can download our menu as a PDF too.";
    // paused while user selects an order.
    // if user wants to end.
    // user selected an order.
    document.getElementById("navigator_text").innerHTML = "We are almost done: please enter your full name, email adress and phone number for us so we can contact you.";
    // paused while user enters.
    // if user wants to end.
    // if credentials are valid then:
    document.getElementById("navigator_text").innerHTML = "Do you want to make changes?";
    // document.getElementById("navigator_text").innerHTML = "Do you want to apply changes?";
    document.getElementById("navigator_text").innerHTML = "Do you have any whishes?.";
    document.getElementById("navigator_text").innerHTML = "When you are ready to complete your order than click on <apply>.";
    document.getElementById("navigator_text").innerHTML = "Do you want to apply?";
    document.getElementById("navigator_text").innerHTML = "Do you want to apply?";
    document.getElementById("navigator_text").innerHTML = "We thank you for your order! Check your email-adress box for our confirmation!";
}

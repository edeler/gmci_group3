function addListeners () {

    var prices = document.querySelectorAll('*[id$="-price"]');

    for (var i = 0; i < prices.length; i++) {
        let name = prices[i].id.toString().split('-')[0];
        console.log(name);

        prices[i].addEventListener('contextmenu', function(ev) {
            ev.preventDefault();
            var amount = sessionStorage.getItem(name);            
            sessionStorage.setItem(name, Math.max(0, --amount));
            saveValues();
            return false;
        }, false);
        
        prices[i].addEventListener('click', function(ev) {
            var amount = sessionStorage.getItem(name);
            sessionStorage.setItem(name, ++amount);
            saveValues();
        }); 
    }
}

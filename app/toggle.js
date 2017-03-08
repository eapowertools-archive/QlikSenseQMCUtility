$(document).ready(function() {
    $("#menu-toggle").on("click", function(e) {
        console.log("toggled!")

        $("#wrapper").toggleClass("toggled");
        e.preventDefault();
    });
});
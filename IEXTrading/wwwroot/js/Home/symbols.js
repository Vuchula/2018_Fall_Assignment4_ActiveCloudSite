var allSymbols = [];

$(document).ready(function () {
    GetSymbols();
    $('#tblSymbols').dataTable();
    $("#dbopt").click(function () {
        console.log("HEkk");
        SaveSymbols();
    });

});

function GetSymbols() {
    $.ajax({
        url: "https://api.iextrading.com/1.0/ref-data/symbols",
        type: 'GET',
        async: false,
        success: function (res) {
            DisplaySymbols(res);
            allSymbols = res;
        }
    });
}

function DisplaySymbols(symbols) {
    var html = "";
    if (symbols != null) {
        for (var eachSymbol of symbols) {
            html += "<tr>" +
                "<td>" + eachSymbol.symbol + "</td >" +
                "<td>" + eachSymbol.name + "</td >" +
                "<td>" + eachSymbol.date + "</td >" +
                "<td>" + eachSymbol.type + "</td >" +
                "</tr>";
        }
        $("#symbolsTableBody").empty();
        $("#symbolsTableBody").append(html);
    }
}


function SaveSymbols() {
    for (var eachSymbol of allSymbols) {
        SaveEachSymbol(eachSymbol)
    }
}

function SaveEachSymbol(symbol) {
    var MyAppUrlSettings = {
        MyUsefulUrl: '@Url.Action("ActionPopulateSymbols","Home")'
    }
    $.ajax({
        url: '/Home/PopulateSymbols',
        type: 'POST',
        async: false,
        data: symbol,
        success: function (res) {
            console.log("Hello");
        }
    });
}
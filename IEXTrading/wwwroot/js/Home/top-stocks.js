var allSymbols = [];
$(document).ready(function () {
    GetSymbols();
    $('#tblTopStocks').dataTable();

});

function GetSymbols() {
    $.ajax({
        url: "https://api.iextrading.com/1.0/ref-data/symbols",
        type: 'GET',
        async: false,
        success: function (res) {
            //console.log(res);
            allSymbols = GetRandom(res, 100);
            GetQuotes();
        }
    });
}

function GetRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function GetQuotes() {
    var int = 1;
    for (var eachSymbol of allSymbols) {
        console.log("Getting Quote for: " + eachSymbol.symbol + " Count: " + int);
        eachSymbol["quote"] = GetQuote(eachSymbol["symbol"]);
        int++;
    }
    CalculateCompanyValue();
    DisplaySymbols(allSymbols.slice(0, 5));
    console.log(allSymbols.slice(0, 5));
}

function GetQuote(symbol) {
    var quote;
    var URL = "https://api.iextrading.com/1.0/stock/" + symbol + "/batch?types=quote";
    $.ajax({
        url: URL,
        type: 'GET',
        async: false,
        success: function (res) {
            //console.log(res);
            quote = res["quote"];
        }
    });
    return quote;
}

function CalculateCompanyValue() {
    for (var eachSymbol of allSymbols) {
        var quote = eachSymbol["quote"];
        if ((quote.week52High - quote.week52Low) != 0) {
            eachSymbol["companyValue"] = ((quote.close - quote.week52Low) / (quote.week52High - quote.week52Low));
        }
    }

    allSymbols.sort(SortByCompanyValue);
}

function SortByCompanyValue(a, b) {
    var aName = a.companyValue;
    var bName = b.companyValue;
    return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
}




function DisplaySymbols(topSymbols) {
    var html = "";
    if (topSymbols != null) {
        for (var eachSymbol of topSymbols) {
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
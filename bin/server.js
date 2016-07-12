/**
 * Created by Luis on 7/11/2016.
 */
var WebSocketServer= require('ws').Server;
var wss=new WebSocketServer({port:8181});


var stocks={
    'APPL':95.0,
    'YHOO':70.0,
    'GOOG':85.0,
    'MSFT':209.0,
    'AMZN':50.0
};

function randomInterval(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
var stockUpdater;
function randomStockUpdater(){
    for(var symbol in stocks){
        if(stocks.hasOwnProperty(symbol)){
            var randomlizedChange = randomInterval(-150,150);
            var floatChange = randomlizedChange/100;
            stocks[symbol]+=floatChange;
            console.log(stocks[symbol]);
        }
    }
    var randomMSTime = randomInterval(500, 2500);
    stockUpdater = setTimeout(function() {
        randomStockUpdater();
    }, randomMSTime)
}
randomStockUpdater();

wss.on('connection',function(ws){
    console.log("connected");
    var clientStockUpdater;
    var sendStockUpdates = function(ws){
        if(ws.readyState==1){
            var stockobj={};
            for(var i = 0;i<clientStock.length;i++){
                var symbol = clientStock[i];
                console.log(symbol);
                stockobj[symbol]= stocks[symbol];

            };
            //console.log(stockobj)
            ws.send(JSON.stringify(stockobj));
        }
    };
    clientStockUpdater = setInterval(function() {
        sendStockUpdates(ws);
    }, 1000);
    var clientStock=[];
    ws.on('message',function(message){
        console.log(message);
        var stock_request = JSON.parse(message);
        clientStock= stock_request["stock"]
        console.log(clientStock);
        sendStockUpdates(ws);
    });
    ws.on('close', function() {
        if(typeof clientStockUpdater !== 'undefined') {
            clearInterval(clientStockUpdater);
        }
    });
})
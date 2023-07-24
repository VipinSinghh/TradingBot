const telegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const TOKEN = process.env.TOKEN;
const Binance = require('binance-api-node').default;
const binanceClient = Binance({ apiKey: 'wFnlmhozi5QzTiqwyp8PlsPO6C33rW1pGoPENWyWo8d3Br37BIBE9pgRJM7UDVTR', apiSecret: 'Ag9lHp3MNzFHkuKZegSGQpfZnQTZgBU8g1ba1W7J9CNEO6XFVo6duTDmsHn9faJF',enableRateLimit: true,
options: { adjustForTimeDifference: true}});


//bot created
const botUpdated = new telegramBot(TOKEN, { polling: true });

let orderSymbol;
let side;
let orderQuantity;
let orderPrice;

botUpdated.onText(/\/start/, (message) => {
  console.log(message);
  let chat_id = message.from.id;
  console.log(chat_id);
  botUpdated.sendMessage(
    chat_id,
    "Hey there!  I am a trading bot \nWelcome, Please use /trade command to execute a trade."
  );
});

botUpdated.onText(/\/trade/, (msg) => {
    const chatId = msg.chat.id;

    botUpdated.sendMessage(chatId, 'Lets start! Please provide the symbol, price, and order type in the format: "Symbol Price OrderType Quantity"');
});

botUpdated.onText(/^([^\s]+) ([^\s]+) ([^\s]+) ([^\s]+)$/, (msg, match) => {
    const chatId = msg.chat.id;
    const [_, symbol, price, orderType, quantity] = match;
    console.log(symbol, price, orderType, quantity, "details");
  
    // Validate the user input
    if (!symbol || !price || !orderType) {
      botUpdated.sendMessage(
        chatId,
        'Invalid input. Please provide the symbol, price, and order type in the format: "Symbol Price OrderType"'
      );
      return;
    }

    orderSymbol = symbol;
    side = orderType;
    orderPrice = price;
    orderQuantity = quantity;

    botUpdated.sendMessage(
        chatId,
        'We are going to execute the trade. To confirm send /YES or /NO to cancel'
    );
    
    
});

async function executeTrade(symbol, side, quantity, price) {
    try {
        const response = await binanceClient.order({
            symbol: "BTCUSDT",
            side: "buy",
            quantity:0.00036,
            price:28000,
            type: 'LIMIT', // Change to 'MARKET' for market orders
            timeInForce: 'GTC', // Good Till Cancel
            recvWindow: 60000,
            // timestamp: adjustedTimestamp,
          });
        console.log(response,"response")
        
    } catch (error) {
        console.log(error)
    }

}

botUpdated.onText(/\/YES/, (msg) => {
    const chatId = msg.chat.id;
    executeTrade(orderSymbol, side, parseFloat(orderPrice), orderQuantity);
    botUpdated.sendMessage(chatId, 'Trade Executed');
});

botUpdated.onText(/\/NO/, (msg) => {
    const chatId = msg.chat.id;

    botUpdated.sendMessage(chatId, 'Trade cancelled');
});







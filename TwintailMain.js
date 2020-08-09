const Discord = require('discord.js');
const fs = require('fs')
const client = new Discord.Client();
var UserAttributes = JSON.parse(fs.readFileSync('Data/UserAttributes.txt', "utf8", (err, data) => {if (err) throw err;console.log(data);}));
var AttributeStrength = JSON.parse(fs.readFileSync('Data/AttributeStrength.txt', "utf8", (err, data) => {if (err) throw err;console.log(data);}));
var Prefix = fs.readFileSync('Data/Prefix.txt', "utf8", (err, data) => {if (err) throw err;console.log(data);});


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.toLowerCase().startsWith(Prefix+'ping')) {
    msg.reply('Pong!');
  }
  if (msg.content.toLowerCase().startsWith(Prefix+'prefix')) {
  	Prefix = msg.content.split(" ")[1];
    msg.reply('Prefix Changed');
  }
  try {
  	if (UserAttributes==undefined||AttributeStrength==undefined||Prefix===undefined)
  		throw "a punch";
    fs.writeFile('Data/UserAttributes.txt',JSON.stringify(UserAttributes),(err) => {if (err) throw err;})
    fs.writeFile('Data/AttributeStrength.txt',JSON.stringify(AttributeStrength),(err) => {if (err) throw err;})
    fs.writeFile('Data/Prefix.txt',Prefix,(err) => {if (err) throw err;})
  }
  catch {

  }
});

client.login('TOKEN');
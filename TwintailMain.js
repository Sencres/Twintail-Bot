const Discord = require('discord.js');
const crypto = require("crypto")
const fs = require('fs')
const client = new Discord.Client();
try{
  var UserAttributes = JSON.parse(fs.readFileSync('Data/UserAttributes.json', "utf8", (err, data) => {if (err) throw err;console.log(data);}));
  var AttributeStrength = JSON.parse(fs.readFileSync('Data/AttributeStrength.json', "utf8", (err, data) => {if (err) throw err;console.log(data);}));
  var Prefix = fs.readFileSync('Data/Prefix.json', "utf8", (err, data) => {if (err) throw err;console.log(data);});
  console.log("The primary save files have been successfully loaded.")
}
catch{
  var UserAttributes = JSON.parse(fs.readFileSync('Data/UserAttributesBackup.json', "utf8", (err, data) => {if (err) throw err;console.log(data);}));
  var AttributeStrength = JSON.parse(fs.readFileSync('Data/AttributeStrengthBackup.json', "utf8", (err, data) => {if (err) throw err;console.log(data);}));
  var Prefix = fs.readFileSync('Data/PrefixBackup.json', "utf8", (err, data) => {if (err) throw err;console.log(data);});
  console.log("There was some kind of problem with the main save files, so the backup files have been loaded instead.")
  console.log("If you modified the save files manually, please avoid doing so in the future.")
}

if (crypto.createHash('sha256').update(JSON.stringify(UserAttributes)+JSON.stringify(AttributeStrength)+Prefix).digest("hex") != fs.readFileSync('Data/SaveHash.json', "utf8", (err, data) => {if (err) throw err;console.log(data);})){
	console.log("It appears you have modified the system save files while the program was not running, please avoid doing this as it may cause unforseen errors or unintended behaviour.")
}


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
  if (msg.content.toLowerCase().startsWith(Prefix+'attribute')) {
  	try {
  		AttributeStrength[UserAttributes[String(msg.author.id)]['Attribute']]-=1000
  	}
  	catch {}
  	UserAttributes[String(msg.author.id)]={
  		"Attribute":msg.content.split(" ")[1],
  		"TimeOfLastBoost":new Date().getTime(),
  	}
  	try {
  		AttributeStrength[UserAttributes[String(msg.author.id)]['Attribute']]+=1000
  	}
  	catch {
  		AttributeStrength[UserAttributes[String(msg.author.id)]['Attribute']]=1000
  	}
    msg.reply('Attribute Changed!');
  }
  if (msg.content.toLowerCase().startsWith(Prefix+'check')) {
  	msg.reply(AttributeStrength[msg.content.split(" ")[1]])
  }



  try {
    if (new Date().getTime() >= UserAttributes[String(msg.author.id)]["TimeOfLastBoost"]+60000){
  	  try {
  	  	  AttributeStrength[UserAttributes[String(msg.author.id)]['Attribute']]+=1
  	  }
  	  catch {
  		  AttributeStrength[UserAttributes[String(msg.author.id)]['Attribute']]=1
  	  }
    }
  }
  catch {}
  fs.writeFileSync('Data/UserAttributes.json',JSON.stringify(UserAttributes),(err) => {if (err) throw err;})
  fs.writeFileSync('Data/AttributeStrength.json',JSON.stringify(AttributeStrength),(err) => {if (err) throw err;})
  fs.writeFileSync('Data/Prefix.json',Prefix,(err) => {if (err) throw err;})
  try{
    UserAttributes = JSON.parse(fs.readFileSync('Data/UserAttributes.json', "utf8", (err, data) => {if (err) throw err;console.log(data);}));
    AttributeStrength = JSON.parse(fs.readFileSync('Data/AttributeStrength.json', "utf8", (err, data) => {if (err) throw err;console.log(data);}));
    Prefix = fs.readFileSync('Data/Prefix.json', "utf8", (err, data) => {if (err) throw err;console.log(data);});
    fs.writeFileSync('Data/UserAttributesBackup.json',JSON.stringify(UserAttributes),(err) => {if (err) throw err;})
    fs.writeFileSync('Data/AttributeStrengthBackup.json',JSON.stringify(AttributeStrength),(err) => {if (err) throw err;})
    fs.writeFileSync('Data/PrefixBackup.json',Prefix,(err) => {if (err) throw err;})
  }
  catch{
  	console.log("There appears to have been a save error. The automatic backup system has been triggered, and a backup is being loaded.")
    UserAttributes = JSON.parse(fs.readFileSync('Data/UserAttributesBackup.json', "utf8", (err, data) => {if (err) throw err;console.log(data);}));
    AttributeStrength = JSON.parse(fs.readFileSync('Data/AttributeStrengthBackup.json', "utf8", (err, data) => {if (err) throw err;console.log(data);}));
    Prefix = fs.readFileSync('Data/PrefixBackup.json', "utf8", (err, data) => {if (err) throw err;console.log(data);});
    console.log("The backup was successfully loaded")
  }
  fs.writeFileSync('Data/SaveHash.json',crypto.createHash('sha256').update(JSON.stringify(UserAttributes)+JSON.stringify(AttributeStrength)+Prefix).digest("hex"),(err) => {if (err) throw err;})
});

client.login('Token');
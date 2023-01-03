
const Discord = require("discord.js");
const client = new Discord.Client();
client.db = require("quick.db");
client.request = new (require("rss-parser"))();
client.config = require("./config.js");

client.on("ready", () => {
    console.log("I'm ready!");
    handleUploads();
});

const YouTube = require("simple-youtube-api");

const youtube = new YouTube("AIzaSyCTwxFYB6CWVKTMQXKObVwBTukt6jOZgpo"); 


function handleUploads() {
    if (client.db.fetch(`postedVideos`) === null) client.db.set(`postedVideos`, []);
    setInterval(() => {
        client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${client.config.channel_id}`)
        .then(data => {
            if (client.db.fetch(`postedVideos`).includes(data.items[0].link)) return;
            else {
                client.db.set(`videoData`, data.items[0]);
                client.db.push("postedVideos", data.items[0].link);
                let parsed = client.db.fetch(`videoData`);
                let channel = client.channels.cache.get(client.config.channel);
                if (!channel) return;
                let message = client.config.messageTemplate
                    .replace(/{author}/g, parsed.author)
                    .replace(/{title}/g, Discord.Util.escapeMarkdown(parsed.title))
                    .replace(/{url}/g, parsed.link);
                channel.send(message);
            }
        });
    }, client.config.watchInterval);
}

client.once('ready', () =>{
    let chURL = "https://m.youtube.com/channel/UCMdh8VM5fJGEIi4mJK56vFg";
    let sub;

    youtube.getChannel(chURL, { part: "statistics" }).then(c => {
    sub = c.subscriberCount;
    client.user.setActivity(`${sub}subscriber`, {
        type: "PLAYING",
    })
    })
console.log("bot run shode")
})

client.login(client.config.token);
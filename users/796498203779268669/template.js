module.exports = {
    name: "", // Commad name
    aliases: [""], // Command aliases
    webhooks: [
      ""
    ], // Webhooks;
    async execute(message, args, MessageBuilder) {
  
      /* Building the Embed */
      let webHookMessage = new MessageBuilder()
        .setColor('#FFFFFF') // Specify color (#HEX);
        .setTitle('Example Title') // Embed Title;
        .setDescription('Example Description') // Embed Description;
        .setThumbnail('https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png') // Image;
        .setTimestamp() // Timestamp;
        .setFooter('Test Footer', 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'); // Footer and Footer Image;
  
      return {
        webHookMessage // Returns our built messagse;
      };
      
    }
  };
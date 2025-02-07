const { DisTube } = require('distube'); 
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YouTubePlugin } = require('@distube/youtube');

module.exports = (client) => {
    client.distube = new DisTube(client, {
        emitNewSongOnly: false,
        emitAddSongWhenCreatingQueue: false,
        nsfw: false,
        plugins: [
            new SpotifyPlugin(),
            new SoundCloudPlugin(),
            new YouTubePlugin()
        ],
    });
}
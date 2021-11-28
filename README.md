# baiBot
Simple Discord bot made with Typescript.
## Slash Guild Commands - executed with slash '/'
- /ping
- /say (text)
- /play (url || song name)
- /pause
- /resume
- /skip
- /stop
- /queue
- /volume (percentage?)
- /clear (number of messages)
## Installation
1. Install dependencies
```s
npm install
```
2. Create .env file in root directory and paste you credentials here:
```s
botToken=YOUR_BOT_TOKEN
guildId=YOUR_SRVER_ID
```
3. Build project
```s
tsc || npm run build
```
4. Run
```s
npm run start
```

## Issues
Some tracks may get skipped by bot or may cause it to leave the voice channel. Fix to that issue can be found [here](https://github.com/Androz2091/discord-player/issues/794#issue-1000772967).


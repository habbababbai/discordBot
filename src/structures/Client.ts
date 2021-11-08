import { Client, Intents, Collection, ApplicationCommandData, ApplicationCommandDataResolvable, ClientEvents, Guild } from "discord.js";
import { CommandType } from "../typings/Command";
import glob from 'glob';
import { promisify } from "util";
import { Event } from "./Event";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    slashCommands:ApplicationCommandDataResolvable[] = [];
    constructor() {
        super({intents: [32767]});
    };

    start() {
        this.registerModules();
        this.login(process.env.botToken);
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }
    
    async registerModules() {
        // Commands
        
        const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);
        
        commandFiles.forEach(async filePath => {
            const command: CommandType = await this.importFile(filePath);
            if (!command) return;
            console.log(command);
            this.commands.set(command.name, command);
            this.slashCommands.push(command);
        });



        // Events
        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
        eventFiles.forEach( async filePath => {
            const event: Event<keyof ClientEvents> = await this.importFile(filePath);
            this.on(event.event, event.run);
        })

    }
}
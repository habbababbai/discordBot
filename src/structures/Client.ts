import { Client, Collection, ApplicationCommandDataResolvable, ClientEvents} from "discord.js";
import { CommandType } from "../typings/Command";
import glob from 'glob';
import { promisify } from "util";
import { Event } from "./Event";
import { RegisterCommandsOptions } from "../typings/Client";
import { client } from "..";
import { ExtendedPlayer } from './Player';

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    readonly commands: Collection<string, CommandType> = new Collection();
    readonly slashCommands:ApplicationCommandDataResolvable[] = [];
    player: ExtendedPlayer;
    
    //Intents 32767 are all Intents
    constructor() {
        super({intents: [32767]});
    };

    start() {
        this.registerModules();
        this.login(process.env.botToken);
        this.player = new ExtendedPlayer(this);
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands({commands, guildId} : RegisterCommandsOptions): Promise<void> {
        await this.guilds.cache.get(guildId as string)?.commands.set(commands)
    }
    async registerModules() {
        // Commands
        const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);
        commandFiles.forEach(async filePath => {
            const command: CommandType = await this.importFile(filePath);
            if (!command) return;
            this.commands.set(command.name, command);
            this.slashCommands.push(command);
        });

        
        this.on('ready', () => {
            this.registerCommands({
                commands: client.slashCommands,
                guildId: process.env.guildId
            });

        });
        


        // Events
        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
        eventFiles.forEach( async filePath => {
            const event: Event<keyof ClientEvents> = await this.importFile(filePath);
            this.on(event.event, event.run);
        })
        

    }
}
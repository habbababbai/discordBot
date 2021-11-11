import { Client, Collection, ApplicationCommandDataResolvable, ClientEvents, PermissionResolvable} from "discord.js";
import { CommandType } from "../typings/Command";
import glob from 'glob';
import { promisify } from "util";
import { Event } from "./Event";
import { RegisterCommandsOptions } from "../typings/Client";
import { client } from "..";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    readonly commands: Collection<string, CommandType> = new Collection();
    readonly slashCommands:ApplicationCommandDataResolvable[] = [];
    readonly commandPermissions: Collection<string, PermissionResolvable[]> = new Collection();


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

    async registerCommands({commands, guildId} : RegisterCommandsOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
        } else {
            this.application?.commands.set(commands);
        }
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
            if (command.userPermissions) {
                this.commandPermissions.set(command.name ,command.userPermissions);
            }
        });
        
        this.on('ready', () => {
            this.registerCommands({
                commands: client.slashCommands,
                guildId: process.env.guildId
            })
        });
        


        // Events
        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
        eventFiles.forEach( async filePath => {
            const event: Event<keyof ClientEvents> = await this.importFile(filePath);
            this.on(event.event, event.run);
        })

    }
}
import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, PermissionOverwriteResolvable } from "discord.js";
import { ExtendedClient } from '../structures/Client';

interface RunOptions {
    client: ExtendedClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
};

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
    userPermissions?: PermissionOverwriteResolvable[];
    run: RunFunction;
    cooldown: number;

} & ChatInputApplicationCommandData
import {
    world,
    system,
    ItemStack,
    EntityComponentTypes,
} from "@minecraft/server";

class Welcome {
    constructor() {
        this.guide = "eon:guide";
        this.accessCard = "eon:access_card";
        this.nameTag = "§l§3『 Project Eon Guide 』§r";
        this.firstTag = "joined";
        this.lore = [
            "§7A comprehensive log of humanity's next leap —",
            "§7where circuits, steel, and sentience unite.",
            "§r",
            "§bFrom hover tech to energy weapons,",
            "§7this guide decodes the wonders of the §9Eon Era§7.",
            "§r",
            "§d§o“Progress isn't built in silence — it hums with power.”",
            "§r",
            "§8§oRight-click to access futuristic knowledge.",
        ];
        this.welcomeMessage = [
            "§l§9==============================",
            "§b§lWelcome to Project Eon§r",
            "§7Step into a world where §btechnology§7 reshapes reality,",
            "§7and the line between man and machine blurs.",
            "§r",
            "§aCommand§7 robotic companions, §3soar§7 on hover bikes,",
            "§7wield §eenergy sabers§7 and the powerful §dGravity Gun§7.",
            "§r",
            "§bProtect§7 your base with §5Dome Shields§7,",
            "§7and uncover what lies beyond the §9Eon Frontier§7.",
            "§r",
            "§8Your Futuristic Journey begins now...",
            "§l§9==============================",
        ];
    }

    welcomeMissing() {
        const players = world.getAllPlayers();
        for (const player of players) {
            this.welcome(player);
        }
    }

    register() {
        world.afterEvents.playerSpawn.subscribe((ev) => {
            const player = ev.player;
            system.runTimeout(() => {
                this.welcome(player);
            }, 20);
        });

        system.runInterval(() => {
            this.welcomeMissing();
        }, 100);
    }

    welcome(player) {
        try {
            if (!player.hasTag(this.firstTag)) {
                const guide = new ItemStack(this.guide, 1);
                guide.nameTag = this.nameTag;
                guide.setLore(this.lore);

                const accessCard = new ItemStack(this.accessCard, 1);
                accessCard.nameTag = `§b§l『 Access Card 』§r`;
                accessCard.setLore([
                    "§7Grants access to advanced Eon technology.",
                    "§r",
                    `§8Linked Player: §7${player.name}`,
                    `§8Linked ID: §7${player.id}`,
                    "§8§oOnly the registered user can operate linked tech.",
                    "§r",
                    "§c§oWarning: §7If this card falls into the wrong hands,",
                    "§7the technology it unlocks could be dangerously misused.",
                ]);

                const inventory = player.getComponent(
                    EntityComponentTypes.Inventory
                ).container;
                inventory.addItem(guide);
                inventory.addItem(accessCard);
                player.addTag(this.firstTag);

                player.sendMessage(this.welcomeMessage.join("\n"));
            }
        } catch (error) {
            console.error(
                `[First Join] Error processing player ${player.name}: ${error}`
            );
        }
    }
}

export function registerWelcome() {
    const welcome = new Welcome();
    welcome.register();
}

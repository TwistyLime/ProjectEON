import { ChestFormData } from "../../extensions/forms";
import { openGuideMenu } from "../guide";
import { openDomeShieldRecipe } from "./recipe/dome_shield";
import { openGravityPadRecipe } from "./recipe/gravity_pad";
import { openHealingStationRecipe } from "./recipe/healing_station";

class Blocks {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Blocks");
        menu.pattern(
            [
                "xyxxxxxyx",
                "x_______x",
                "x_______x",
                "x_______x",
                "x_______x",
                "xpxxxxxcx",
            ],
            {
                x: {
                    itemName: { rawtext: [{ text: " " }] },
                    itemDesc: [],
                    enchanted: false,
                    stackAmount: 1,
                    texture: "textures/items/guide/gray_glass.png",
                },
                y: {
                    itemName: { rawtext: [{ text: " " }] },
                    itemDesc: [],
                    enchanted: false,
                    stackAmount: 1,
                    texture: "textures/items/guide/black_glass.png",
                },
                p: {
                    itemName: { rawtext: [{ text: "§a§l⬅ Back" }] },
                    itemDesc: ["§7Click to return to the previous menu."],
                    enchanted: false,
                    stackAmount: 1,
                    texture: "textures/items/guide/left.png",
                },
                c: {
                    itemName: { rawtext: [{ text: "§c§l✖ Close" }] },
                    itemDesc: ["§7Click to close the menu."],
                    enchanted: false,
                    stackAmount: 1,
                    texture: "minecraft:barrier",
                },
            }
        );
        menu.button(
            10,
            "§l§5Steel Ore",
            ["§7Generates between y level 0 and 40", "Drops raw steel."],
            "textures/items/guide/steel_ore.png",
            1,
            0,
            false
        );
        menu.button(
            11,
            "§l§5Deepslate Steel Ore",
            ["§7Generates between y level -62 and 0", "Drops raw steel."],
            "textures/items/guide/deepslate_steel_ore.png",
            1,
            0,
            false
        );
        menu.button(
            12,
            "§l§5Block of Raw Steel",
            ["§7A block that is crafted", "from raw steel."],
            "textures/items/guide/raw_steel_block.png",
            1,
            0,
            false
        );
        menu.button(
            13,
            "§l§5Block of Steel",
            ["§7A block that is crafted", "from steel ingots."],
            "textures/items/guide/steel_block.png",
            1,
            0,
            false
        );

        menu.button(
            14,
            "§l§5Uranium Ore",
            [
                "§7Generates between y level -60 and -40",
                "Drops raw uranium.",
                "Mildly radioactive!",
            ],
            "textures/items/guide/uranium_ore.png",
            1,
            0,
            false
        );
        menu.button(
            15,
            "§l§5Block of Raw Uranium",
            [
                "§7A block that is crafted",
                "from raw uranium.",
                "Highly radioactive!",
            ],
            "textures/items/guide/raw_uranium_block.png",
            1,
            0,
            false
        );
        menu.button(
            16,
            "§l§5Block of Uranium",
            [
                "§7A block that is crafted",
                "from uranium ingots.",
                "Extremely radioactive!",
            ],
            "textures/items/guide/uranium_block.png",
            1,
            0,
            false
        );
        menu.button(
            19,
            "§l§5Gravitite Ore",
            [
                "§7Generates between y level -60 and -40",
                "Drops gravitite shard.",
            ],
            "textures/items/guide/gravitite_ore.png",
            1,
            0,
            false
        );
        menu.button(
            20,
            "§l§5Gravity Pad",
            [
                "§7A high-tech pad that manipulates gravity fields.",
                "§7Stand on it to elevate upward into the air.",
                "§7Can reach heights of up to §b64 blocks§7.",
                "§e▸ Stand to ascend.",
                "§e▸ Sneak to descend back down safely.",
                "",
                "§7Click to view the recipe",
            ],
            "textures/items/guide/gravity_pad.png",
            1,
            0,
            false
        );
        menu.button(
            21,
            "§l§5Dome Shield",
            [
                "§7A deployable energy dome shield.",
                "§7Projects a protective dome that damages outside entities and players.",
                "§e▸ Useful for defending your base.",
                "§r",
                "§7Click to view the recipe",
            ],
            "textures/items/guide/dome_shield.png",
            1,
            0,
            false
        );
        menu.button(
            22,
            "§l§5Healing Station",
            [
                "§7A high-tech restoration unit designed for biological regeneration.",
                "§7Capable of cleansing toxins, restoring vitality, and replenishing energy.",
                "§e▸ Stand on the station to begin the healing process.",
                "§e▸ Right-click with a §bPower Sphere§e to activate.",
                "§e▸ Restores §aHealth§e, §6Hunger§e, and removes negative effects.",
                "§r",
                "§7Click to view the recipe",
            ],
            "textures/items/guide/healing_station.png",
            1,
            0,
            false
        );

        menu.show(player).then((response) => {
            if (response.canceled) return;
            switch (response.selection) {
                case 46:
                    openGuideMenu(player);
                    break;
                case 20:
                    openGravityPadRecipe(player);
                    break;
                case 21:
                    openDomeShieldRecipe(player);
                    break;
                case 22:
                    openHealingStationRecipe(player);
                    break;
                default:
                    break;
            }
        });
    }
}

export function openBlocksMenu(player) {
    Blocks.open(player);
}

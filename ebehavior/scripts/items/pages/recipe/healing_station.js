import { ChestFormData } from "../../../extensions/forms";
import { openBlocksMenu } from "../blocks";

class HealingStation {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Healing Station");
        menu.pattern(
            [
                "xyxxxxxyx",
                "x___xxxxx",
                "x___x_x_x",
                "x___xxxxx",
                "xyxxxxxyx",
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
            23,
            "§6§lCrafted using §eCrafting Table",
            [
                "§7This item is created by combining",
                "§7materials at a §eCrafting Table§7.",
                "§8(Requires specific recipe)",
            ],
            "minecraft:crafting_table",
            1,
            0,
            false
        );

        menu.button(
            25,
            "§l§5Healing Station",
            [
                "§7A high-tech restoration unit designed for biological regeneration.",
                "§7Capable of cleansing toxins, restoring vitality, and replenishing energy.",
                "§e▸ Stand on the station to begin the healing process.",
                "§e▸ Right-click with a §bPower Sphere§e to activate.",
                "§e▸ Restores §aHealth§e, §6Hunger§e, and removes negative effects.",
            ],
            "textures/items/guide/healing_station.png",
            1,
            0,
            false
        );

        const recipe = [
            {
                "name": "Iron Trapdoor",
                "texture": "minecraft:iron_trapdoor",
                "amount": 1,
                "slot": 11
            },
            {
                "name": "Program Chip",
                "texture": "eon:program_chip",
                "amount": 1,
                "slot": 19
            },
            {
                "name": "Glistering Melon",
                "texture": "textures/items/guide/melon.png",
                "amount": 1,
                "slot": 20
            },
            {
                "name": "Program Chip",
                "texture": "eon:program_chip",
                "amount": 1,
                "slot": 21
            },
            {
                "name": "Steel Ingot",
                "texture": "eon:steel_ingot",
                "amount": 1,
                "slot": 28
            },
            {
                "name": "Power Sphere",
                "texture": "eon:power_sphere",
                "amount": 1,
                "slot": 29
            },
            {
                "name": "Steel Ingot",
                "texture": "eon:steel_ingot",
                "amount": 1,
                "slot": 30
            }
        ];

        for (const item of recipe) {
            menu.button(
                item.slot,
                `§l§5${item.name}`,
                ["§7Part of the Healing Station crafting recipe."],
                item.texture,
                item.amount,
                0,
                false
            );
        }

        menu.show(player).then((response) => {
            if (response.canceled) return;
            switch (response.selection) {
                case 46:
                    openBlocksMenu(player);
                    break;
                default:
                    break;
            }
        });
    }
}

export function openHealingStationRecipe(player) {
    HealingStation.open(player);
}

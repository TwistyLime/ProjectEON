import { ChestFormData } from "../../../extensions/forms";
import { openWearablesMenu } from "../wearables";

class HazmatLeggings {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Hazmat Leggings");
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
            "§l§5Hazmat Leggings",
            [
                "§7Durable lower armor lined with composite filters.",
                "§7Provides protection against environmental contamination.",
                "§e▸ When worn as a full set:",
                "   §7Provides §6Radiation§7 and §aBee Sting§7 protection.",
            ],
            "eon:hazmat_leggings",
            1,
            0,
            false
        );

        const recipe = [
            {
                "name": "Black Wool",
                "texture": "textures/items/guide/black_wool.png",
                "amount": 1,
                "slot": 10
            },
            {
                "name": "Reinforced Cloth",
                "texture": "eon:reinforced_cloth",
                "amount": 1,
                "slot": 11
            },
            {
                "name": "Black Wool",
                "texture": "textures/items/guide/black_wool.png",
                "amount": 1,
                "slot": 12
            },
            {
                "name": "Reinforced Cloth",
                "texture": "eon:reinforced_cloth",
                "amount": 1,
                "slot": 19
            },
            {
                "name": "Reinforced Cloth",
                "texture": "eon:reinforced_cloth",
                "amount": 1,
                "slot": 21
            },
            {
                "name": "Reinforced Cloth",
                "texture": "eon:reinforced_cloth",
                "amount": 1,
                "slot": 28
            },
            {
                "name": "Reinforced Cloth",
                "texture": "eon:reinforced_cloth",
                "amount": 1,
                "slot": 30
            },
        ];

        for (const item of recipe) {
            menu.button(
                item.slot,
                `§l§5${item.name}`,
                ["§7Part of the Hazmat Leggings crafting recipe."],
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
                    openWearablesMenu(player);
                    break;
                default:
                    break;
            }
        });
    }
}

export function openHazmatLeggingsRecipe(player) {
    HazmatLeggings.open(player);
}

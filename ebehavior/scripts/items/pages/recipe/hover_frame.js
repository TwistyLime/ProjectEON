import { ChestFormData } from "../../../extensions/forms";
import { openItemsMenu } from "../items";

class HoverFrame {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Hover Frame");
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
            "§l§5Hover Frame",
            [
                "§7A structural component for building hovercraft.",
                "§7Works in conjunction with Hover Engines.",
            ],
            "eon:hover_frame",
            1,
            0,
            false
        );

        const recipe = [
            {
                "name": "Steel Ingot",
                "texture": "eon:steel_ingot",
                "amount": 1,
                "slot": 11
            },
            {
                "name": "Iron Ingot",
                "texture": "textures/items/guide/iron_ingot.png",
                "amount": 1,
                "slot": 12
            },
            {
                "name": "Steel Ingot",
                "texture": "eon:steel_ingot",
                "amount": 1,
                "slot": 19
            },
            {
                "name": "Steel Ingot",
                "texture": "eon:steel_ingot",
                "amount": 1,
                "slot": 20
            },
            {
                "name": "Copper Ingot",
                "texture": "textures/items/guide/copper_ingot.png",
                "amount": 1,
                "slot": 21
            },
            {
                "name": "Iron Ingot",
                "texture": "textures/items/guide/iron_ingot.png",
                "amount": 1,
                "slot": 28
            },
            {
                "name": "Copper Ingot",
                "texture": "textures/items/guide/copper_ingot.png",
                "amount": 1,
                "slot": 29
            }
        ];

        for (const item of recipe) {
            menu.button(
                item.slot,
                `§l§5${item.name}`,
                ["§7Part of the Hover Frame crafting recipe."],
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
                    openItemsMenu(player);
                    break;
                default:
                    break;
            }
        });
    }
}

export function openHoverFrameRecipe(player) {
    HoverFrame.open(player);
}

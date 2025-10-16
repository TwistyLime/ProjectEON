import { ChestFormData } from "../../../extensions/forms";
import { openItemsMenu } from "../items";

class ProgramChip {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Program Chip");
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
            "§l§5Program Chip",
            [
                "§7Used in advanced Eon machinery.",
                "§7Holds essential software for operation.",
            ],
            "eon:program_chip",
            1,
            0,
            false
        );

        const recipe = [
            {
                "name": "Copper Ingot",
                "texture": "textures/items/guide/copper_ingot.png",
                "amount": 1,
                "slot": 10
            },
            {
                "name": "Redstone Dust",
                "texture": "textures/items/guide/redstone.png",
                "amount": 1,
                "slot": 11
            },
            {
                "name": "Copper Ingot",
                "texture": "textures/items/guide/copper_ingot.png",
                "amount": 1,
                "slot": 12
            },
            {
                "name": "Redstone Dust",
                "texture": "textures/items/guide/redstone.png",
                "amount": 1,
                "slot": 19
            },
            {
                "name": "Quartz",
                "texture": "textures/items/guide/quartz.png",
                "amount": 1,
                "slot": 20
            },
            {
                "name": "Redstone Dust",
                "texture": "textures/items/guide/redstone.png",
                "amount": 1,
                "slot": 21
            },
            {
                "name": "Copper Ingot",
                "texture": "textures/items/guide/copper_ingot.png",
                "amount": 1,
                "slot": 28
            },
            {
                "name": "Redstone Dust",
                "texture": "textures/items/guide/redstone.png",
                "amount": 1,
                "slot": 29
            },
            {
                "name": "Copper Ingot",
                "texture": "textures/items/guide/copper_ingot.png",
                "amount": 1,
                "slot": 30
            }
        ];

        for (const item of recipe) {
            menu.button(
                item.slot,
                `§l§5${item.name}`,
                ["§7Part of the Program Chip crafting recipe."],
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

export function openProgramChipRecipe(player) {
    ProgramChip.open(player);
}

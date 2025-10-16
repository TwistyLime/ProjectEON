import { ChestFormData } from "../../../extensions/forms";
import { openWearablesMenu } from "../wearables";

class NightVisionGoggles {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Night Vision Goggles");
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
            "§l§5Night Vision Goggles",
            [
                "§7Advanced optical gear fitted with low-light enhancement lenses.",
                "§7Allows clear visibility in darkness and dim environments.",
                "§e▸ Automatically grants §bNight Vision§e when worn.",
            ],
            "eon:night_vision_goggles",
            1,
            0,
            false
        );

        const recipe = [
            {
                "name": "Steel Ingot",
                "texture": "eon:steel_ingot",
                "amount": 1,
                "slot": 10
            },
            {
                "name": "Steel Ingot",
                "texture": "eon:steel_ingot",
                "amount": 1,
                "slot": 11
            },
            {
                "name": "Steel Ingot",
                "texture": "eon:steel_ingot",
                "amount": 1,
                "slot": 12
            },
            {
                "name": "Green Stained Glass Pane",
                "texture": "minecraft:green_stained_glass_pane",
                "amount": 1,
                "slot": 19
            },
            {
                "name": "Uranium Ingot",
                "texture": "eon:uranium_ingot",
                "amount": 1,
                "slot": 20
            },
            {
                "name": "Green Stained Glass Pane",
                "texture": "minecraft:green_stained_glass_pane",
                "amount": 1,
                "slot": 21
            },
        ];

        for (const item of recipe) {
            menu.button(
                item.slot,
                `§l§5${item.name}`,
                ["§7Part of the Night Vision Goggles crafting recipe."],
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

export function openNightVisionGogglesRecipe(player) {
    NightVisionGoggles.open(player);
}

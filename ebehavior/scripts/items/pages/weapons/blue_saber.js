import { ChestFormData } from "../../../extensions/forms";
import { openWeaponsMenu } from "../weapons";

class BlueSaber {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Blue Saber");
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
            "§l§5Blue Saber",
            [
                "§7A precision energy blade tuned for balance and control.",
                "§7Emits a calm blue hue that disrupts enemy focus.",
                "§e▸ Strikes inflict §bSlowness§e and §8Blindness§e briefly.",
                "§e▸ Favored by disciplined fighters seeking clarity in combat.",
            ],
            "textures/items/blue_light_saber.png",
            1,
            0,
            false
        );

        const recipe = [
            {
                "name": "Lapis Lazuli",
                "texture": "textures/items/guide/lapis_lazuli.png",
                "amount": 1,
                "slot": 12
            },
            {
                "name": "Power Sphere",
                "texture": "eon:power_sphere",
                "amount": 1,
                "slot": 20
            },
            {
                "name": "Steel Ingot",
                "texture": "eon:steel_ingot",
                "amount": 1,
                "slot": 28
            },
        ];

        for (const item of recipe) {
            menu.button(
                item.slot,
                `§l§5${item.name}`,
                ["§7Part of the Blue Saber crafting recipe."],
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
                    openWeaponsMenu(player);
                    break;
                default:
                    break;
            }
        });
    }
}

export function openBlueSaberRecipe(player) {
    BlueSaber.open(player);
}

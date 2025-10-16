import { ChestFormData } from "../../../extensions/forms";
import { openWeaponsMenu } from "../weapons";

class GravityGun {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Gravity Gun");
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
            "§l§5Gravity Gun",
            [
                "§7A high-energy manipulation device built around a §dGravity Core§7.",
                "§7It bends local gravitational fields to seize and propel matter.",
                "§e▸ Right-Click: §7Grab or release nearby entities.",
            ],
            "textures/items/guide/gravity_gun.png",
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
                "name": "Steel Ingot",
                "texture": "eon:steel_ingot",
                "amount": 1,
                "slot": 12
            },
            {
                "name": "Program Chip",
                "texture": "eon:program_chip",
                "amount": 1,
                "slot": 19
            },
            {
                "name": "Gravity Core",
                "texture": "eon:gravity_core",
                "amount": 1,
                "slot": 20
            },
            {
                "name": "Steel Ingot",
                "texture": "eon:steel_ingot",
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
        ];

        for (const item of recipe) {
            menu.button(
                item.slot,
                `§l§5${item.name}`,
                ["§7Part of the Gravity Gun crafting recipe."],
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

export function openGravityGunRecipe(player) {
    GravityGun.open(player);
}

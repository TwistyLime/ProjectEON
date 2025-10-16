import { ChestFormData } from "../../../extensions/forms";
import { openBikesAndPetssMenu } from "../bikes_and_pets";

class RobotDog {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Robot Dog");
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
            "§l§5Robot Dog",
            [
                "§7An advanced mechanical companion built for loyalty and defense.",
                "§7Equipped with high durability plating and adaptive AI protocols.",
                "§e▸ Has §c100 Health§e (50 Hearts).",
                "§e▸ Not tamed when spawned.",
                "§e▸ Use a §bPower Sphere§e to tame and link it to you.",
            ],
            "textures/items/robot_dog.png",
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
                "name": "Power Sphere",
                "texture": "eon:power_sphere",
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
                "name": "Bone",
                "texture": "textures/items/guide/bone.png",
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
                ["§7Part of the Robot Dog crafting recipe."],
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
                    openBikesAndPetssMenu(player);
                    break;
                default:
                    break;
            }
        });
    }
}

export function openRobotDogRecipe(player) {
    RobotDog.open(player);
}

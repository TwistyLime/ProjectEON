import { ChestFormData } from "../../../extensions/forms";
import { openBikesAndPetssMenu } from "../bikes_and_pets";

class HoverBike1 {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Hover Bike 1");
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
            "§l§5Hover Bike 1",
            [
                "§7A futuristic bike that hovers above the ground.",
                "§7It is designed for fast travel with a sleek, modern look.",
                "§e▸ Requires an Access Card to ride.",
                "§e▸ On first summon, register the bike by",
                "   §eright-clicking it with your Access Card.",
                "§e▸ After registration, right-click with the",
                "   §eregistered card to ride your Hover Bike.",
            ],
            "textures/items/hover_bike_1.png",
            1,
            0,
            false
        );

        const recipe = [
            {
                name: "Hover Engine",
                texture: "eon:hover_engine",
                amount: 1,
                slot: 19,
            },
            {
                name: "Hover Frame",
                texture: "eon:hover_frame",
                amount: 1,
                slot: 20,
            },
        ];

        for (const item of recipe) {
            menu.button(
                item.slot,
                `§l§5${item.name}`,
                ["§7Part of the Hover Bike 1 crafting recipe."],
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

export function openHoverBike1Recipe(player) {
    HoverBike1.open(player);
}

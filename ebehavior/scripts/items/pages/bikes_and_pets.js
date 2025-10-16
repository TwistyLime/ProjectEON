import { ChestFormData } from "../../extensions/forms";
import { openGuideMenu } from "../guide";
import { openRobotCatRecipe } from "./pets/robot_cat";
import { openRobotDogRecipe } from "./pets/robot_dog";
import { openHoverBike1Recipe } from "./recipe/hover_bike_1";
import { openHoverBike2Recipe } from "./recipe/hover_bike_2";

class BikesAndPets {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Bikes and Pets");
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
            "§l§5Hover Bike",
            [
                "§7A futuristic bike that hovers above the ground.",
                "§7It is designed for fast travel with a sleek, modern look.",
                "§e▸ Requires an Access Card to ride.",
                "§e▸ On first summon, register the bike by",
                "   §eright-clicking it with your Access Card.",
                "§e▸ After registration, right-click with the",
                "   §eregistered card to ride your Hover Bike.",
                "",
                "§7Click to view recipe.",
            ],
            "textures/items/hover_bike_1.png",
            1,
            0,
            false
        );
        menu.button(
            11,
            "§l§5Hover Bike 2",
            [
                "§7An upgraded futuristic bike that hovers above the ground.",
                "§7Designed for high-speed travel with a refined, sleek design.",
                "§b▸ Includes built-in storage capabilities.",
                "§e▸ Requires an Access Card to ride.",
                "§e▸ On first summon, register the bike by",
                "   §eright-clicking it with your Access Card.",
                "§e▸ After registration, right-click with the",
                "   §eregistered card to ride your Hover Bike.",
                "",
                "§7Click to view recipe.",
            ],
            "textures/items/hover_bike_2.png",
            1,
            0,
            false
        );

        menu.button(
            12,
            "§l§5Robot Dog",
            [
                "§7An advanced mechanical companion built for loyalty and defense.",
                "§7Equipped with high durability plating and adaptive AI protocols.",
                "§e▸ Has §c100 Health§e (50 Hearts).",
                "§e▸ Not tamed when spawned.",
                "§e▸ Use a §bPower Sphere§e to tame and link it to you.",
                "§r",
                "§7Click to view recipe.",
            ],
            "textures/items/robot_dog.png",
            1,
            0,
            false
        );
        menu.button(
            13,
            "§l§5Robot Cat",
            [
                "§7A sleek and agile synthetic pet designed for stealth and companionship.",
                "§7Powered by compact energy cells and responsive motion systems.",
                "§e▸ Has §c100 Health§e (50 Hearts).",
                "§e▸ Not tamed when spawned.",
                "§e▸ Use a §bPower Sphere§e to tame and establish loyalty.",
                "§r",
                "§7Click to view recipe.",
            ],
            "textures/items/robot_cat.png",
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
                case 10:
                    openHoverBike1Recipe(player);
                    break;
                case 11:
                    openHoverBike2Recipe(player);
                    break;
                case 12:
                    openRobotDogRecipe(player);
                    break;
                case 13:
                    openRobotCatRecipe(player);
                    break;
                default:
                    break;
            }
        });
    }
}

export function openBikesAndPetssMenu(player) {
    BikesAndPets.open(player);
}

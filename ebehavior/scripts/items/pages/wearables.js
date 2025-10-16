import { ChestFormData } from "../../extensions/forms";
import { openGuideMenu } from "../guide";
import { openHazmatBootsRecipe } from "./wearables/hazmat_boots";
import { openHazmatChestplateRecipe } from "./wearables/hazmat_chestplate";
import { openHazmatHelmetRecipe } from "./wearables/hazmat_helmet";
import { openHazmatLeggingsRecipe } from "./wearables/hazmat_leggings";
import { openNightVisionGogglesRecipe } from "./wearables/night_vision_goggles";

class Wearables {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Wearables");
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
            "§l§5Hazmat Helmet",
            [
                "§7A sealed protective helmet designed for hazardous environments.",
                "§7Filters air and provides full breathing support underwater.",
                "§e▸ Grants §bWater Breathing§e.",
                "§e▸ When worn as a full set:",
                "   §7Provides §6Radiation§7 and §aBee Sting§7 protection.",
                "§r",
                "§7Click to view the recipe",
            ],
            "eon:hazmat_helmet",
            1,
            0,
            false
        );
        menu.button(
            11,
            "§l§5Hazmat Chestplate",
            [
                "§7A reinforced chest module lined with heat-resistant fibers.",
                "§7Designed to shield the wearer from extreme temperatures.",
                "§e▸ Grants §cFire§e and §cLava Resistance§e.",
                "§e▸ When worn as a full set:",
                "   §7Provides §6Radiation§7 and §aBee Sting§7 protection.",
                "§r",
                "§7Click to view the recipe",
            ],
            "eon:hazmat_chestplate",
            1,
            0,
            false
        );
        menu.button(
            12,
            "§l§5Hazmat Leggings",
            [
                "§7Durable lower armor lined with composite filters.",
                "§7Provides protection against environmental contamination.",
                "§e▸ When worn as a full set:",
                "   §7Provides §6Radiation§7 and §aBee Sting§7 protection.",
                "§r",
                "§7Click to view the recipe",
            ],
            "eon:hazmat_leggings",
            1,
            0,
            false
        );
        menu.button(
            13,
            "§l§5Hazmat Boots",
            [
                "§7Shock-absorbing boots made for stable footing in toxic zones.",
                "§7Prevents direct contact with contaminated surfaces.",
                "§e▸ When worn as a full set:",
                "   §7Provides §6Radiation§7 and §aBee Sting§7 protection.",
                "§r",
                "§7Click to view the recipe",
            ],
            "eon:hazmat_boots",
            1,
            0,
            false
        );

        menu.button(
            14,
            "§l§5Night Vision Goggles",
            [
                "§7Advanced optical gear fitted with low-light enhancement lenses.",
                "§7Allows clear visibility in darkness and dim environments.",
                "§e▸ Automatically grants §bNight Vision§e when worn.",
                "§r",
                "§7Click to view the recipe."
            ],
            "eon:night_vision_goggles",
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
                    openHazmatHelmetRecipe(player);
                    break;
                case 11:
                    openHazmatChestplateRecipe(player);
                    break;
                case 12:
                    openHazmatLeggingsRecipe(player);
                    break;
                case 13:
                    openHazmatBootsRecipe(player);
                    break;
                case 14:
                    openNightVisionGogglesRecipe(player);
                    break;
                default:
                    break;
            }
        });
    }
}

export function openWearablesMenu(player) {
    Wearables.open(player);
}

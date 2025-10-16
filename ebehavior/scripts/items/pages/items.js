import { ChestFormData } from "../../extensions/forms";
import { openGuideMenu } from "../guide";
import { openGravityCoreRecipe } from "./recipe/gravity_core";
import { openPowerSphereRecipe } from "./recipe/power_sphere";
import { openProgramChipRecipe } from "./recipe/program_chip";
import { openHoverEngineRecipe } from "./recipe/hover_engine";
import { openHoverFrameRecipe } from "./recipe/hover_frame";
import { openClothRecipe } from "./recipe/cloth";
import { openReinforcedClothRecipe } from "./recipe/reinforced_cloth";
import { openDurabilityMatrixRecipe } from "./recipe/durability_matrix";

class Items {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Items");
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
            "§l§5Raw Steel",
            [
                "§7Dropped by Steel Ore and Deepslate Steel Ore",
                "Smelted into Steel Ingots.",
            ],
            "eon:raw_steel",
            1,
            0,
            false
        );
        menu.button(
            11,
            "§l§5Steel Ingot",
            ["§7Crafted by Smelting Raw Steel.", "Used to craft Steel Items."],
            "eon:steel_ingot",
            1,
            0,
            false
        );

        menu.button(
            12,
            "§l§5Raw Uranium",
            [
                "§7Dropped by Uranium Ore",
                "Smelted into Uranium Ingots.",
                "Mildly radioactive!",
            ],
            "eon:raw_uranium",
            1,
            0,
            false
        );
        menu.button(
            13,
            "§l§5Uranium Ingot",
            ["§7Crafted by Smelting Raw Uranium.", "Highly radioactive!"],
            "eon:uranium_ingot",
            1,
            0,
            false
        );
        menu.button(
            14,
            "§l§5Gravitite Shrard",
            ["§7Dropped by Gravitite Ore", "Used to craft Gravitite Items."],
            "eon:gravitite_shard",
            1,
            0,
            false
        );
        menu.button(
            15,
            "§l§5Access Card",
            [
                "§7Grants access to advanced Eon technology.",
                "§8§oOnly the registered user can operate linked tech.",
                "§r",
                "§c§oWarning: §7If this card falls into the wrong hands,",
                "§7the technology it unlocks could be dangerously misused.",
            ],
            "eon:access_card",
            1,
            0,
            false
        );
        menu.button(
            16,
            "§l§5Power Sphere",
            [
                "§7A compact energy storage device.",
                "§7Used to power various Eon technologies.",
                "",
                "§7Click to view the recipe.",
            ],
            "eon:power_sphere",
            1,
            0,
            false
        );
        menu.button(
            19,
            "§l§5Program Chip",
            [
                "§7Used in advanced Eon machinery.",
                "§7Holds essential software for operation.",
                "",
                "§7Click to view the recipe.",
            ],
            "eon:program_chip",
            1,
            0,
            false
        );
        menu.button(
            20,
            "§l§5Gravity Core",
            [
                "§7The Gravity Core is a powerful item",
                "§7that manipulates gravitational forces.",
                "",
                "§7Click to view the recipe.",
            ],
            "eon:gravity_core",
            1,
            0,
            false
        );
        menu.button(
            21,
            "§l§5Hover Engine",
            [
                "§7Allows vehicles to hover above the ground.",
                "§7Essential for hovercraft and advanced vehicles.",
                "§8§oRequires a Gravity Core to function.",
                "§r",
                "§7Click to view the recipe.",
            ],
            "eon:hover_engine",
            1,
            0,
            false
        );
        menu.button(
            22,
            "§l§5Hover Frame",
            [
                "§7A structural component for building hovercraft.",
                "§7Works in conjunction with Hover Engines.",
                "§r",
                "§7Click to view the recipe.",
            ],
            "eon:hover_frame",
            1,
            0,
            false
        );
        menu.button(
            23,
            "§l§5Cloth",
            [
                "§7A synthetic fabric woven from refined wool fibers.",
                "§7Acts as the base material for advanced textiles and suits.",
                "§r",
                "§7Click to view the recipe.",
            ],
            "eon:cloth",
            1,
            0,
            false
        );
        menu.button(
            24,
            "§l§5Reinforced Cloth",
            [
                "§7A durable composite made by combining Cloth with refined steel mesh.",
                "§7Engineered for protection and structural integrity under pressure.",
                "§e▸ Essential for crafting the §6Hazmat Suit§e and other protective gear.",
                "§r",
                "§7Click to view the recipe.",
            ],
            "eon:reinforced_cloth",
            1,
            0,
            false
        );

        menu.button(
            25,
            "§l§5Durability Matrix",
            [
                "§7A compact energy core capable of molecular reconstruction.",
                "§7Used to restore the integrity of worn or damaged equipment.",
                "§e▸ Hold the §bDurability Matrix§e in your §dOff-hand§e.",
                "§e▸ Hold the damaged item in your §dMain-hand§e.",
                "§e▸ Right-click to restore the item's durability.",
                "§r",
                "§7Click to view the recipe.",
            ],
            "textures/items/durability_restore.png",
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
                case 15:
                    openPowerSphereRecipe(player);
                    break;
                case 16:
                    openProgramChipRecipe(player);
                    break;
                case 19:
                    openGravityCoreRecipe(player);
                    break;
                case 20:
                    openHoverEngineRecipe(player);
                    break;
                case 21:
                    openHoverFrameRecipe(player);
                    break;
                case 22:
                    openClothRecipe(player);
                    break;
                case 23:
                    openReinforcedClothRecipe(player);
                    break;
                case 25:
                    openDurabilityMatrixRecipe(player);
                    break;
                default:
                    break;
            }
        });
    }
}

export function openItemsMenu(player) {
    Items.open(player);
}

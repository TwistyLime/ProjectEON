import { world } from "@minecraft/server";
import { ChestFormData } from "../extensions/forms.js";
import { openBlocksMenu } from "./pages/blocks.js";
import { openItemsMenu } from "./pages/items.js";
import { openBikesAndPetssMenu } from "./pages/bikes_and_pets.js";
import { openWearablesMenu } from "./pages/wearables.js";
import { openWeaponsMenu } from "./pages/weapons.js";
import { AccessCardUtils } from "./access_card.js";

class Guide {
    constructor() {
        this.id = "eon:guide";
    }

    static openGuide(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon");

        menu.pattern(
            [
                "xyxxxxxyx",
                "x_______x",
                "x_______x",
                "x_______x",
                "x_______x",
                "xrxxxxxcx",
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
                c: {
                    itemName: { rawtext: [{ text: "§c§l✖ Close" }] },
                    itemDesc: ["§7Click to close the menu."],
                    enchanted: false,
                    stackAmount: 1,
                    texture: "minecraft:barrier",
                },
                r: {
                    itemName: { rawtext: [{ text: "§c§l✉ Restore Access Card" }] },
                    itemDesc: ["§7Click to get a new access card if","the old one is lost or misplaced!"],
                    enchanted: false,
                    stackAmount: 1,
                    texture: "eon:access_card",
                },
            }
        );

        menu.button(
            10,
            "§l▪§5 Blocks and Components",
            [
                "§7Learn about the custom blocks","in Project Eon.",
            ],
            "textures/items/guide/blocks.png",
            1,
            0,
            false
        );

        menu.button(
            11,
            "§l▪§5 Items and Stuff",
            [
                "§7Learn about the custom items","in Project Eon.",
            ],
            "textures/items/guide/items.png",
            1,
            0,
            false
        );

        menu.button(
            12,
            "§l▪§5 Hover Bikes and Robot Pets",
            [
                "§7Learn about the custom hover bikes and robot pets","in Project Eon.",
            ],
            "textures/items/robot_dog.png",
            1,
            0,
            false
        );

        menu.button(
            13,
            "§l▪§5 Wearables",
            [
                "§7Discover specialized gear designed","for protection and exploration.",
            ],
            "eon:hazmat_helmet",
            1,
            0,
            false
        );

        menu.button(
            14,
            "§l▪§5 Weapons",
            ["§7Unleash experimental power through","advanced weaponized technology."],
            "textures/items/guide/gravity_gun.png",
            1,
            0,
            false
        );

        menu.show(player).then((response) => {
            if (response.canceled) return;

            switch (response.selection) {
                case 10:
                    openBlocksMenu(player);
                    break;
                case 11:
                    openItemsMenu(player);
                    break;
                case 12:
                    openBikesAndPetssMenu(player);
                    break;
                case 13:
                    openWearablesMenu(player);
                    break;
                case 14:
                    openWeaponsMenu(player);
                    break;
                case 46:
                    AccessCardUtils.provideNewCard(player);
                    break;
                default:
                    break;
            }       
        });
    }

    register() {
        world.afterEvents.itemUse.subscribe((event) => {
            if (event.itemStack?.typeId !== this.id) return;
            let player = event.source;
            player.playSound("eon.guide.click", {
                volume: 1,
                pitch: 1,
            });
            Guide.openGuide(event.source);
        });
    }
}

export function openGuideMenu(player) {
    Guide.openGuide(player);
}

export function registerGuide() {
    new Guide().register();
}

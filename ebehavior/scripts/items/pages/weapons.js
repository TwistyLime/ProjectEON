import { ChestFormData } from "../../extensions/forms";
import { openGuideMenu } from "../guide";
import { openBlueSaberRecipe } from "./weapons/blue_saber";
import { openGravityGunRecipe } from "./weapons/gravity_gun";
import { openRedSaberRecipe } from "./weapons/red_saber";

class Weapons {
    static open(player) {
        let menu = new ChestFormData("large");
        menu.title("§l§5Project Eon | Weapons");
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
            "§l§5Gravity Gun",
            [
                "§7A high-energy manipulation device built around a §dGravity Core§7.",
                "§7It bends local gravitational fields to seize and propel matter.",
                "§e▸ Right-Click: §7Grab or release nearby entities.",
                "§r",
                "§7Click to view the recipe",
            ],
            "textures/items/guide/gravity_gun.png",
            1,
            0,
            false
        );
        menu.button(
            11,
            "§l§5Light Saber (Red)",
            [
                "§7A weapon forged from concentrated plasma energy.",
                "§7Its crimson blade radiates with unstable, destructive power.",
                "§e▸ Strikes ignite targets and deliver powerful knockback.",
                "§e▸ Wielded by those who embrace aggression and chaos.",
                "§r",
                "§7Click to view the recipe",
            ],
            "textures/items/red_light_saber.png",
            1,
            0,
            false
        );
        menu.button(
            12,
            "§l§5Light Saber (Blue)",
            [
                "§7A precision energy blade tuned for balance and control.",
                "§7Emits a calm blue hue that disrupts enemy focus.",
                "§e▸ Strikes inflict §bSlowness§e and §8Blindness§e briefly.",
                "§e▸ Favored by disciplined fighters seeking clarity in combat.",
                "§r",
                "§7Click to view the recipe",
            ],
            "textures/items/blue_light_saber.png",
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
                    openGravityGunRecipe(player);
                    break;
                case 11:
                    openRedSaberRecipe(player);
                    break;
                case 12:
                    openBlueSaberRecipe(player);
                    break;
                default:
                    break;
            }
        });
    }
}

export function openWeaponsMenu(player) {
    Weapons.open(player);
}

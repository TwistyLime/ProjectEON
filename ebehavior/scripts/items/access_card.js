import { EntityComponentTypes, ItemStack } from "@minecraft/server";

export class AccessCardUtils {
    static CARD_ID = "eon:access_card";

    static isAccessCard(item) {
        if (!item) return false;
        return item.typeId === this.CARD_ID;
    }

    static getLinkedInfo(card) {
        if (!this.isAccessCard(card)) return null;

        const lore = card.getLore();
        if (!lore || lore.length === 0) return null;

        let name = null;
        let id = null;

        for (const line of lore) {
            if (line.includes("Linked Player:")) {
                name = line.replace(/^§.\s*Linked Player:\s*§7/, "").trim();
            } else if (line.includes("Linked ID:")) {
                id = line.replace(/^§.\s*Linked ID:\s*§7/, "").trim();
            }
        }

        if (!name || !id) return null;

        return { name, id };
    }

    static verifyOwnership(card, player) {
        const info = this.getLinkedInfo(card);
        if (!info) return false;

        return info.id === player.id;
    }

    static debugInfo(player, card) {
        const info = this.getLinkedInfo(card);
        if (!info) {
            player.sendMessage("§cThis is not a valid Access Card.");
            return;
        }

        player.sendMessage(
            `§bAccess Card Info:\n§7Linked Player: §f${info.name}\n§7Linked ID: §f${info.id}`
        );
    }

    static provideNewCard(player) {
        const accessCard = new ItemStack("eon:access_card", 1);
        accessCard.nameTag = `§b§l『 Access Card 』§r`;
        accessCard.setLore([
            "§7Grants access to advanced Eon technology.",
            "§r",
            `§8Linked Player: §7${player.name}`,
            `§8Linked ID: §7${player.id}`,
            "§8§oOnly the registered user can operate linked tech.",
            "§r",
            "§c§oWarning: §7If this card falls into the wrong hands,",
            "§7the technology it unlocks could be dangerously misused.",
        ]);

        const inventory = player.getComponent(
            EntityComponentTypes.Inventory
        ).container;
        inventory.addItem(accessCard);

        player.sendMessage(
            "§8> §l§7A new card has been added to your inventory!"
        );
    }
}

import { world, system, EquipmentSlot } from "@minecraft/server";

class DurabilityRestorer {
    constructor() {
        this.activePlayers = new Map();
        this.cooldowns = new Map();
        this.COOLDOWN_TICKS = 10;
        this.DURABILITY_RESTORER = "eon:durability_restore";
    }

    init() {
        this.registerEvents();
    }

    registerEvents() {
        world.beforeEvents.itemUse.subscribe((event) => {
            this.handleItemUse(event);
        });
    }

    isOnCooldown(playerId) {
        if (!this.cooldowns.has(playerId)) {
            return false;
        }
        
        const lastUse = this.cooldowns.get(playerId);
        const currentTick = system.currentTick;
        
        if (currentTick - lastUse < this.COOLDOWN_TICKS) {
            return true;
        }
        
        return false;
    }

    setCooldown(playerId) {
        this.cooldowns.set(playerId, system.currentTick);
    }

    handleItemUse(event) {
        const player = event.source;
        const playerId = player.id;

        if (this.isOnCooldown(playerId)) {
            return;
        }

        const equippable = player.getComponent("equippable");
        if (!equippable) return;

        const mainHandItem = equippable.getEquipment(EquipmentSlot.Mainhand);
        const offHandItem = equippable.getEquipment(EquipmentSlot.Offhand);

        if (!offHandItem || offHandItem.typeId !== this.DURABILITY_RESTORER) {
            return;
        }

        if (!mainHandItem) {
            return;
        }

        const durabilityComp = mainHandItem.getComponent("durability");
        if (!durabilityComp) {
            return;
        }

        const currentDamage = durabilityComp.damage;
        if (currentDamage === 0) {
            return;
        }

        event.cancel = true;
        this.setCooldown(playerId);

        system.run(() => {
            this.restoreDurability(player, equippable, mainHandItem, offHandItem, durabilityComp);
        });
    }

    restoreDurability(player, equippable, mainHandItem, offHandItem, durabilityComp) {
        try {
            durabilityComp.damage = 0;
            equippable.setEquipment(EquipmentSlot.Mainhand, mainHandItem);

            if (offHandItem.amount > 1) {
                offHandItem.amount -= 1;
                equippable.setEquipment(EquipmentSlot.Offhand, offHandItem);
            } else {
                equippable.setEquipment(EquipmentSlot.Offhand, undefined);
            }

            this.provideFeedback(player);
        } catch (error) {
            console.error(`Error restoring durability for player ${player.name}: ${error}`);
        }
    }

    provideFeedback(player) {
        try {
            player.onScreenDisplay.setActionBar("§a✔ Item durability fully restored!");
            player.playSound("random.levelup", { volume: 0.5, pitch: 1.2 });

            const location = player.location;
            player.dimension.spawnParticle("minecraft:totem_particle", {
                x: location.x,
                y: location.y + 1,
                z: location.z,
            });
        } catch (error) {
            console.error(`Error providing feedback: ${error}`);
        }
    }

    cleanupCooldowns() {
        const currentPlayers = new Set(world.getAllPlayers().map(p => p.id));
        
        for (const playerId of this.cooldowns.keys()) {
            if (!currentPlayers.has(playerId)) {
                this.cooldowns.delete(playerId);
            }
        }
    }
}

export function registerDurabilityRestorer() {
    let restorerInstance = new DurabilityRestorer();
    restorerInstance.init();

    system.runInterval(() => {
        restorerInstance.cleanupCooldowns();
    }, 1200);
    return restorerInstance;
}
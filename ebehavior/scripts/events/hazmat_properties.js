import {
    EntityComponentTypes,
    EquipmentSlot,
    system,
    world,
} from "@minecraft/server";

class HazmatProperties {
    constructor() {
        this.beePoisonedPlayers = new Map();

        this.registerEntityHitListener();
        this.registerPlayerLeaveListener();
        this.startArmorEffectLoop();
    }

    registerEntityHitListener() {
        world.afterEvents.entityHitEntity.subscribe((event) => {
            const damagedEntity = event.hitEntity;
            const damagingEntity = event.damagingEntity;

            if (damagedEntity?.typeId !== "minecraft:player") return;
            if (damagingEntity?.typeId !== "minecraft:bee") return;

            const equipment = damagedEntity.getComponent(EntityComponentTypes.Equippable);
            if (!equipment) return;

            const helmet = equipment.getEquipment(EquipmentSlot.Head);
            const chestplate = equipment.getEquipment(EquipmentSlot.Chest);
            const leggings = equipment.getEquipment(EquipmentSlot.Legs);
            const boots = equipment.getEquipment(EquipmentSlot.Feet);

            const hasFullHazmatArmor =
                helmet?.typeId === "eon:hazmat_helmet" &&
                chestplate?.typeId === "eon:hazmat_chestplate" &&
                leggings?.typeId === "eon:hazmat_leggings" &&
                boots?.typeId === "eon:hazmat_boots";

            if (hasFullHazmatArmor) {
                this.handleBeeHit(damagedEntity);
            }
        });
    }

    handleBeeHit(player) {
        this.beePoisonedPlayers.set(player.id, true);

        system.runTimeout(() => {
            if (this.beePoisonedPlayers.get(player.id)) {
                system.run(() => {
                    if (player.getEffect("poison")) {
                        player.removeEffect("poison");

                        if (player.hasComponent(EntityComponentTypes.Health)) {
                            const health = player.getComponent(EntityComponentTypes.Health);
                            const current = health.currentValue;
                            const max = health.effectiveMax;
                            health.setCurrentValue(Math.min(current + 1, max));
                        }
                    }
                });

                this.beePoisonedPlayers.delete(player.id);
            }
        }, 2);
    }

    registerPlayerLeaveListener() {
        world.afterEvents.playerLeave.subscribe((event) => {
            this.beePoisonedPlayers.delete(event.playerId);
        });
    }

    startArmorEffectLoop() {
        system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                this.applyArmorEffects(player);
            }
        }, 20);
    }

    applyArmorEffects(player) {
        const equipment = player.getComponent(EntityComponentTypes.Equippable);
        if (!equipment) return;

        const helmet = equipment.getEquipment(EquipmentSlot.Head);
        const chestplate = equipment.getEquipment(EquipmentSlot.Chest);

        const hasHelmet = helmet?.typeId === "eon:hazmat_helmet";
        const hasChestplate = chestplate?.typeId === "eon:hazmat_chestplate";

        if (hasHelmet) {
            player.addEffect("water_breathing", 40, {
                amplifier: 0,
                showParticles: false,
            });
        }

        if (hasChestplate) {
            player.addEffect("fire_resistance", 40, {
                amplifier: 0,
                showParticles: false,
            });
        }
    }
}

export function registerHazmatProperties() {
    new HazmatProperties();
}
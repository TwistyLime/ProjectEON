import { EntityComponentTypes, EquipmentSlot, world } from "@minecraft/server";

class LightSaberManager {
    static BLUE = "eon:blue_light_saber";
    static RED = "eon:red_light_saber";

    constructor() {
        this.subscribeToEvents();
    }

    subscribeToEvents() {
        world.afterEvents.entityHitEntity.subscribe((event) => this.handleEntityHit(event));
    }

    handleEntityHit(event) {
        const { damagingEntity, hitEntity } = event;
        if (!damagingEntity || !hitEntity) return;

        if (damagingEntity.typeId !== "minecraft:player") return;

        const equippable = damagingEntity.getComponent(EntityComponentTypes.Equippable);
        const item = equippable?.getEquipment(EquipmentSlot.Mainhand);

        if (!item) return;

        switch (item.typeId) {
            case LightSaberManager.BLUE:
                this.applyBlueSaberEffect(hitEntity);
                break;

            case LightSaberManager.RED:
                this.applyRedSaberEffect(damagingEntity, hitEntity);
                break;
        }
    }

    // Blue lightsaber effect: “Jedi Control” – slows and blinds enemies for a short duration
    applyBlueSaberEffect(target) {
        try {
            target.addEffect("slowness", 60, { amplifier: 2 });
            target.addEffect("blindness", 40, { amplifier: 1 });
            this.spawnParticle(target, "minecraft:totem_particle");
        } catch (e) {
            console.error("Blue Saber Effect Error:", e);
        }
    }

    // Red lightsaber effect: “Sith Rage” – sets target on fire and knocks them back
    applyRedSaberEffect(attacker, target) {
        try {
            target.setOnFire(5, true);

            const direction = {
                x:target.location.x - attacker.location.x,
                y:0,
                z:target.location.z - attacker.location.z
            };
            const magnitude = Math.sqrt(direction.x ** 2 + direction.z ** 2) || 1;
            direction.x /= magnitude;
            direction.z /= magnitude;

            target.applyImpulse({ x: direction.x * 0.7, y: 0.4, z: direction.z * 0.7 });
            this.spawnParticle(target, "minecraft:lava_particle");
        } catch (e) {
            console.error("Red Saber Effect Error:", e);
        }
    }

    spawnParticle(entity, particleId) {
        try {
            entity.dimension.spawnParticle(particleId, entity.location);
        } catch {}
    }
}

export function registerSaberFireEffect() {
    new LightSaberManager();
}

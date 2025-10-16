import {
    world,
    system,
    EntityComponentTypes,
    EquipmentSlot,
} from "@minecraft/server";

export class RadioActivity {
    constructor() {
        this.RADIOACTIVE_ITEMS = {
            "eon:raw_uranium": { level: "mild", baseIntensity: 1 },
            "eon:uranium_ingot": { level: "high", baseIntensity: 2 },
            "eon:raw_uranium_block": { level: "high", baseIntensity: 2 },
            "eon:uranium_block": { level: "extreme", baseIntensity: 3 },
        };

        this.RADIATION_EFFECTS = {
            mild: [{ effect: "hunger", amplifier: 0, duration: 100 },{ effect: "weakness", amplifier: 0, duration: 100 },],
            high: [
                { effect: "hunger", amplifier: 1, duration: 100 },
                { effect: "weakness", amplifier: 0, duration: 100 },
                { effect: "poison", amplifier: 0, duration: 60 },
                { effect: "nausea", amplifier: 2, duration: 80 },
            ],
            extreme: [
                { effect: "hunger", amplifier: 2, duration: 100 },
                { effect: "weakness", amplifier: 1, duration: 100 },
                { effect: "poison", amplifier: 1, duration: 80 },
                { effect: "wither", amplifier: 0, duration: 60 },
                { effect: "slowness", amplifier: 1, duration: 100 },
                { effect: "nausea", amplifier: 3, duration: 100 },
            ],
        };
    }

    isWearingFullNetherite(player) {
        try {
            const equipment = player.getComponent(
                EntityComponentTypes.Equippable
            );
            if (!equipment) return false;

            const helmet = equipment.getEquipment(EquipmentSlot.Head);
            const chest = equipment.getEquipment(EquipmentSlot.Chest);
            const legs = equipment.getEquipment(EquipmentSlot.Legs);
            const boots = equipment.getEquipment(EquipmentSlot.Feet);

            return (
                helmet?.typeId === "eon:hazmat_helmet" &&
                chest?.typeId === "eon:hazmat_chestplate" &&
                legs?.typeId === "eon:hazmat_leggings" &&
                boots?.typeId === "eon:hazmat_boots"
            );
        } catch {
            return false;
        }
    }

    calculateRadioactivity(player) {
        const inventory = player.getComponent(EntityComponentTypes.Inventory).container;
        let totalRadiation = 0;
        const radiationSources = {};

        for (let i = 0; i < inventory.size; i++) {
            const item = inventory.getItem(i);
            if (item && this.RADIOACTIVE_ITEMS[item.typeId]) {
                const itemData = this.RADIOACTIVE_ITEMS[item.typeId];
                const amount = item.amount;
                const radiation = itemData.baseIntensity * Math.sqrt(amount);

                totalRadiation += radiation;

                if (!radiationSources[itemData.level]) {
                    radiationSources[itemData.level] = 0;
                }
                radiationSources[itemData.level] += radiation;
            }
        }

        return { totalRadiation, radiationSources };
    }

    applyRadiationEffects(player, radiationData) {
        const { totalRadiation, radiationSources } = radiationData;
        if (totalRadiation === 0) return;

        if (this.isWearingFullNetherite(player)) {
            return;
        }

        let highestLevel = "mild";
        if (radiationSources.extreme > 0) highestLevel = "extreme";
        else if (radiationSources.high > 0) highestLevel = "high";

        const effects = this.RADIATION_EFFECTS[highestLevel];
        effects.forEach((effectConfig) => {
            const scaledAmplifier = Math.min(
                effectConfig.amplifier + Math.floor(totalRadiation / 10),
                5 // Cap amplifier at 5
            );

            player.addEffect(effectConfig.effect, effectConfig.duration, {
                amplifier: scaledAmplifier,
                showParticles: true,
            });
        });

        const radiationLevel = totalRadiation.toFixed(1);
        player.onScreenDisplay.setActionBar(
            `§c⚠ Radiation Level: ${radiationLevel} ⚠`
        );
    }

    start() {
        system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                try {
                    const radiationData = this.calculateRadioactivity(player);
                    if (radiationData.totalRadiation > 0) {
                        this.applyRadiationEffects(player, radiationData);
                    }
                } catch (error) {
                    console.warn(
                        `Error processing radiation for player: ${error}`
                    );
                }
            }
        }, 20);
    }
}

export function registerRadioActivity() {
    const systemInstance = new RadioActivity();
    systemInstance.start();
    return systemInstance;
}

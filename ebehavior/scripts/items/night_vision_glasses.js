import { world, system, EffectTypes, EffectType } from "@minecraft/server";

class NightVisionGlasses {
    constructor() {
        this.checkInterval = null;
        this.NIGHT_VISION_GLASSES = "eon:night_vision_goggles"
    }

    init() {
        this.setupCheckSystem();
    }


    setupCheckSystem() {
        this.checkInterval = system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                this.checkAndApplyNightVision(player);
            }
        }, 20);
    }

    checkAndApplyNightVision(player) {
        const equippable = player.getComponent("equippable");
        
        if (!equippable) return;
        
        const helmet = equippable.getEquipment("Head");
        if (helmet?.typeId === this.NIGHT_VISION_GLASSES) {
            player.addEffect(EffectTypes.get("night_vision"), 240, {
                amplifier: 0,
                showParticles: false
            });
        }
        else{
            player.removeEffect(EffectTypes.get("night_vision"));
        }
    }


    cleanup() {
        if (this.checkInterval !== null) {
            system.clearRun(this.checkInterval);
        }
    }
}


export function registerNightVisionGlasses() {
    const nightVisionGlasses = new NightVisionGlasses();
    nightVisionGlasses.init();
    return nightVisionGlasses;
}
import { world, system, EntityComponentTypes } from "@minecraft/server";
import { AccessCardUtils } from "../items/access_card.js";

const HOVER_BIKE = "eon:hover_bike";
const HOVER_BIKE_2 = "eon:hover_bike_2";
const ACCESS_ID = "eon:access_card";

class HoverBikeSoundManager {
    constructor() {
        this.riders = new Map();
        this.accessMap = new Map();
        this.LOOP_INTERVAL = 40;
        this.ENGINE_LOOP_SOUND = "hover_bike.engine_hover";
        this.ENGINE_START_SOUND = "hover_bike.engine_start";
        this.ENGINE_STOP_SOUND = "hover_bike.engine_stop";

        this.intervalId = null;
    }

    start() {
        if (this.intervalId !== null) return;
        this.handleInteraction();

        this.intervalId = system.runInterval(() => {
            for (const player of world.getPlayers()) {
                const ridingComp = player.getComponent(
                    EntityComponentTypes.Riding
                );
                const currentRide = ridingComp?.entityRidingOn;

                if (
                    !this.riders.has(player.id) &&
                    currentRide &&
                    (currentRide.typeId === HOVER_BIKE ||
                        currentRide.typeId === HOVER_BIKE_2)
                ) {
                    this.riders.set(player.id, {
                        entity: currentRide,
                        timer: 0,
                    });
                    player.playSound(this.ENGINE_START_SOUND, { volume: 1.0 });
                }

                if (this.riders.has(player.id) && currentRide) {
                    const rideData = this.riders.get(player.id);
                    if (typeof rideData.timer !== "number") rideData.timer = 0;
                    rideData.timer++;

                    if (rideData.timer >= this.LOOP_INTERVAL) {
                        player.playSound(this.ENGINE_LOOP_SOUND, {
                            volume: 0.8,
                        });
                        rideData.timer = 0;
                    }

                    this.riders.set(player.id, rideData);
                }

                if (this.riders.has(player.id) && !currentRide) {
                    const { entity: oldRide } = this.riders.get(player.id);
                    this.riders.delete(player.id);
                    player.dimension.playSound(
                        this.ENGINE_STOP_SOUND,
                        oldRide.location,
                        { volume: 1.0 }
                    );
                }
            }
        });
    }

    handleInteraction() {
        world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
            const { player, target, itemStack } = event;
            if (target.typeId != HOVER_BIKE && target.typeId != HOVER_BIKE_2)
                return;
            const rideable = target.getComponent(EntityComponentTypes.Rideable);
            if (!rideable) return;
            if (itemStack?.typeId != ACCESS_ID) {
                event.cancel = true;
                system.run(() => {
                    player.onScreenDisplay.setActionBar(
                        "§cYou must hold an access card to use or register the Hover Bike!"
                    );
                    player.dimension.playSound("note.bass", target.location, {
                        pitch: 0.6,
                    });
                });
                return;
            }

            let isRegistered = false;
            let registeredTag = "";
            target.getTags()?.forEach((tag, index) => {
                if (tag.startsWith("bikeregistered:")) {
                    isRegistered = true;
                    registeredTag = tag;
                }
            });

            if (isRegistered) {
                this.checkAccess(event, registeredTag.split(":")[1]);
            } else {
                event.cancel = true;
                system.run(() => {
                    const id = AccessCardUtils.getLinkedInfo(itemStack)?.id;
                    target.addTag(`bikeregistered:${id}`);
                    player.onScreenDisplay.setActionBar(
                        `Access card is registered to the Hover Bike!`
                    );
                });
            }
        });
    }

    checkAccess(event, registeredTag) {
        const { player, target, itemStack } = event;
        const id = AccessCardUtils.getLinkedInfo(itemStack)?.id;
        if (id != registeredTag) {
            event.cancel = true;
            system.run(()=>{player.onScreenDisplay.setActionBar(
                "Hover Bike is registered to another access card!"
            )});
            return;
        }
    }

    stop() {
        if (this.intervalId !== null) {
            system.clearRun(this.intervalId);
            this.intervalId = null;
        }
        this.riders.clear();
    }
}

export function registerHoverBikeSound() {
    const manager = new HoverBikeSoundManager();
    manager.start();
    return manager;
}

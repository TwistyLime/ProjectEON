import { world, system, EntityComponentTypes, EquipmentSlot } from "@minecraft/server";

class GravityGun {
    constructor() {
        this.grabbedEntities = new Map();
        this.tickInterval = null;
        this.itemUseSubscription = null;
        this.playerLeaveSubscription = null;
        this.GRAVITY_GUN = "eon:gravity_gun";
        this.distanceToGrabFrom = 7;
        this.distanceToKeepGrabbed = 4;
        this.throwForce = 4;
    }

    init() {
        this.preventPlace();
        this.setupTickSystem();
        this.setupEventListeners();
    }

    preventPlace() {
        world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
            const block = event.itemStack;
            if (block?.typeId == this.GRAVITY_GUN) {
                event.cancel = true;
            }
        });
    }

    setupTickSystem() {
        this.tickInterval = system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                const inventory = player.getComponent(EntityComponentTypes.Inventory);
                const equippable = player.getComponent(EntityComponentTypes.Equippable);

                if (!inventory || !equippable) continue;

                const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);

                if (mainhand?.typeId === this.GRAVITY_GUN) {
                    if (this.grabbedEntities.has(player.id)) {
                        const entityId = this.grabbedEntities.get(player.id);
                        const entity = this.getEntityById(entityId);

                        if (entity && entity.isValid) {
                            const targetPos = this.getTargetPosition(
                                player,
                                this.distanceToKeepGrabbed
                            );

                            if (targetPos) {
                                entity.teleport(targetPos, {
                                    dimension: player.dimension,
                                    keepVelocity: false,
                                });
                            }
                        } else {
                            this.grabbedEntities.delete(player.id);
                        }
                    }
                } else {
                    if (this.grabbedEntities.has(player.id)) {
                        this.releaseEntity(player);
                    }
                }
            }
        }, 1);
    }

    setupEventListeners() {
        this.itemUseSubscription = world.afterEvents.itemUse.subscribe(
            (event) => {
                const player = event.source;
                const item = event.itemStack;
                if (item.typeId === this.GRAVITY_GUN) {
                    this.handleItemUse(player, item);
                }
            }
        );

        this.playerLeaveSubscription = world.afterEvents.playerLeave.subscribe(
            (event) => {
                this.grabbedEntities.delete(event.playerId);
            }
        );
    }

    handleItemUse(player, itemStack) {
        // Check if gun has lore (is activated)
        const loreList = itemStack.getLore();
        
        if (!loreList || loreList.length === 0) {
            // Gun is not activated, activate it now
            this.activateGun(player, itemStack);
            return;
        }

        // Gun is activated, proceed with normal functionality
        if (this.grabbedEntities.has(player.id)) {
            this.releaseEntity(player);
            player.dimension.playSound("gravity_gun.release", player.location);
        } else {
            const targetEntity = this.getTargetEntity(
                player,
                this.distanceToGrabFrom
            );
            if (targetEntity) {
                player.dimension.playSound("gravity_gun.grab", player.location);
                this.grabbedEntities.set(player.id, targetEntity.id);
            }
        }
    }

    activateGun(player, itemStack) {
        // Add lore to the gun
        const lore = [
            "§b§l✦ ACTIVATED ✦",
            "§7━━━━━━━━━━━━━━━━━━",
            "§e§lHow to Use:",
            "§7• §fRight-click to grab entities",
            "§7• §fRight-click again to throw",
            "§7• §fSwitch items to release",
            "§7━━━━━━━━━━━━━━━━━━",
            "§dGrab Range: §f7 blocks",
            "§dHold Distance: §f4 blocks",
            "§dThrow Force: §f4x"
        ];

        itemStack.nameTag = "§l§b[ §fGravity Gun §b]";
        
        itemStack.setLore(lore);
        
        // Update the item in player's hand
        const equippable = player.getComponent(EntityComponentTypes.Equippable);
        if (equippable) {
            equippable.setEquipment(EquipmentSlot.Mainhand, itemStack);
        }
        
        // Send activation message to player
        player.sendMessage("§a§l✓ §aGravity Gun Activated!");
        player.sendMessage("§7Right-click to grab entities, right-click again to throw them!");
        
        // Play activation sound (optional)
        player.dimension.playSound("random.levelup", player.location);
    }

    releaseEntity(player) {
        const entityId = this.grabbedEntities.get(player.id);
        const entity = this.getEntityById(entityId);

        if (entity && entity.isValid) {
            const viewDir = player.getViewDirection();
            
            entity.applyImpulse({
                x: viewDir.x * this.throwForce,
                y: viewDir.y * this.throwForce,
                z: viewDir.z * this.throwForce
            });
        }

        this.grabbedEntities.delete(player.id);
    }

    getEntityById(entityId) {
        for (const dimension of [
            world.getDimension("overworld"),
            world.getDimension("nether"),
            world.getDimension("the_end"),
        ]) {
            for (const entity of dimension.getEntities()) {
                if (entity.id === entityId) {
                    return entity;
                }
            }
        }
        return null;
    }

    getTargetEntity(player, maxDistance) {
        const viewDir = player.getViewDirection();
        const startPos = player.getHeadLocation();

        let closestEntity = null;
        let closestDistance = maxDistance;

        const entities = player.dimension.getEntities({
            location: startPos,
            maxDistance: maxDistance,
            excludeTypes: ["minecraft:item"],
        });

        for (const entity of entities) {
            if (entity.id === player.id) continue;

            const entityPos = entity.location;
            const toEntity = {
                x: entityPos.x - startPos.x,
                y: entityPos.y - startPos.y,
                z: entityPos.z - startPos.z,
            };

            const distance = Math.sqrt(
                toEntity.x ** 2 + toEntity.y ** 2 + toEntity.z ** 2
            );

            const normalized = {
                x: toEntity.x / distance,
                y: toEntity.y / distance,
                z: toEntity.z / distance,
            };

            const dot =
                viewDir.x * normalized.x +
                viewDir.y * normalized.y +
                viewDir.z * normalized.z;

            if (dot > 0.95 && distance < closestDistance) {
                closestEntity = entity;
                closestDistance = distance;
            }
        }

        return closestEntity;
    }

    getTargetPosition(player, distance) {
        const viewDir = player.getViewDirection();
        const headPos = player.getHeadLocation();

        return {
            x: headPos.x + viewDir.x * distance,
            y: headPos.y + viewDir.y * distance,
            z: headPos.z + viewDir.z * distance,
        };
    }

    cleanup() {
        if (this.tickInterval !== null) {
            system.clearRun(this.tickInterval);
        }
        if (this.itemUseSubscription) {
            this.itemUseSubscription.unsubscribe();
        }
        if (this.playerLeaveSubscription) {
            this.playerLeaveSubscription.unsubscribe();
        }
        this.grabbedEntities.clear();
    }
}

export function registerGravityGun() {
    const gravityGun = new GravityGun();
    gravityGun.init();
    return gravityGun;
}
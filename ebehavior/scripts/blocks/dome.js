import {
    world,
    system,
    EntityDamageCause,
    ItemStack,
    EquipmentSlot,
    EntityComponentTypes,
} from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { AccessCardUtils } from "../items/access_card";

const MIN_DOME_RADIUS = 10;
const MAX_DOME_RADIUS = 100;
const RADIUS_STEP = 10;
const DOME_BLOCK = "eon:dome_shield";
const FUEL_BLOCK = "minecraft:waxed_copper_chest";
const FUEL_ITEM = "eon:power_sphere";
const DAMAGE_AMOUNT = 2;
const PARTICLE_TYPE = "minecraft:electric_spark_particle";
const BORDER_PARTICLE_TYPE = "minecraft:blue_flame_particle";
const BEACON_PARTICLE_TYPE = "minecraft:endrod";
const ACCESS_KEY_ITEM = "eon:access_card";

function calculateFuelInterval(radius) {
    const steps = (radius - MIN_DOME_RADIUS) / RADIUS_STEP;
    const maxSteps = (MAX_DOME_RADIUS - MIN_DOME_RADIUS) / RADIUS_STEP;
    return 2000 - steps * (1800 / maxSteps);
}

function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

class ForceFieldDomeManager {
    constructor() {
        this.activeDomes = new Map();
        this.updateIntervalId = null;
        this.playerCooldowns = new Map();
        this.cooldownDuration = 20;
        this.pendingDomeConfigurations = new Map();
        this.playerDomeAccess = new Map();
    }

    initialize() {
        this.registerEventHandlers();
        this.startUpdateLoop();
    }

    registerEventHandlers() {
        world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
            this.handleBlockInteraction(event);
        });

        world.beforeEvents.playerBreakBlock.subscribe((event) => {
            this.handleBlockBreak(event);
        });

        world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
            this.handleEntityInteraction(event);
        });
    }

    handleBlockInteraction(event) {
        const { player, block } = event;

        if (block.typeId !== DOME_BLOCK) return;

        const equipment = player.getComponent(EntityComponentTypes.Equippable);
        const mainhand = equipment.getEquipment(EquipmentSlot.Mainhand);

        if (!mainhand || mainhand.typeId !== ACCESS_KEY_ITEM) {
            system.run(() => {
                player.onScreenDisplay.setActionBar(
                    "§c✉ Hold an access card to use the Dome Shield"
                );
            });
            return;
        }

        if (this.isPlayerOnCooldown(player)) {
            system.run(() => {
                player.onScreenDisplay.setActionBar(
                    "§e⌚ Please wait before interacting again"
                );
            });
            return;
        }

        this.setPlayerCooldown(player);

        const dimension = player.dimension;
        const location = block.location;
        const domeKey = this.getDomeKey(location);

        const chestLocation = this.isValidDomeStructure(block, dimension);

        if (!chestLocation) {
            player.sendMessage(
                "§cError: Dome block must be placed directly above a waxed copper chest!"
            );
            return;
        }

        if (!this.chestHasFuel(dimension, chestLocation)) {
            player.sendMessage(
                "§cError: Waxed copper chest must contain power spheres as fuel!"
            );
            return;
        }

        if (this.activeDomes.has(domeKey)) {
            const existingDome = this.activeDomes.get(domeKey);
            this.showDomeManagementForm(
                player,
                location,
                chestLocation,
                dimension,
                existingDome
            );
        } else {
            this.showRadiusSelectionForm(
                player,
                location,
                chestLocation,
                dimension
            );
        }
    }

    handleBlockBreak(event) {
        const { block, player } = event;

        if (block.typeId !== DOME_BLOCK) return;

        const domeKey = this.getDomeKey(block.location);

        if (this.activeDomes.has(domeKey)) {
            const dome = this.activeDomes.get(domeKey);
            dome.deactivate();
            this.activeDomes.delete(domeKey);
            player.sendMessage(
                "§c♛ Dome deactivated - center block destroyed!"
            );
        }
    }

    handleEntityInteraction(event) {
        const { player, target } = event;

        const equipment = player.getComponent(EntityComponentTypes.Equippable);
        const mainhand = equipment.getEquipment(EquipmentSlot.Mainhand);

        if (!mainhand || mainhand.typeId !== ACCESS_KEY_ITEM) return;
        if (
            target.typeId == "eon:hover_bike" ||
            target.typeId == "eon:hover_bike_2"
        )
            return;
        event.cancel = true;

        const linkedInfo = AccessCardUtils.getLinkedInfo(mainhand);
        if (!linkedInfo || linkedInfo.id !== player.id) {
            return;
        }

        const playerDomes = this.playerDomeAccess.get(player.id);
        if (!playerDomes || playerDomes.length === 0) {
            return;
        }

        let foundDome = null;
        for (const domeId of playerDomes) {
            for (const dome of this.activeDomes.values()) {
                if (dome.id === domeId) {
                    foundDome = dome;
                    break;
                }
            }
            if (foundDome) break;
        }

        if (!foundDome) {
            return;
        }

        if (target.hasTag(foundDome.safeTag)) {
            player.sendMessage(
                `§e☉ This entity already has access to this dome!`
            );
            return;
        }

        system.run(() => {
            target.addTag(foundDome.safeTag);

            const targetDomes = this.playerDomeAccess.get(target.id) || [];
            if (!targetDomes.includes(foundDome.id)) {
                targetDomes.push(foundDome.id);
                this.playerDomeAccess.set(target.id, targetDomes);
            }

            foundDome.dimension.spawnParticle(
                "minecraft:totem_particle",
                target.location
            );
            foundDome.dimension.playSound("random.levelup", target.location, {
                volume: 1.0,
                pitch: 1.5,
            });
        });

        const targetName =
            target.typeId === "minecraft:player"
                ? target.name
                : target.typeId.replace("minecraft:", "");
        player.sendMessage(`§a★ Access granted to ${targetName}!`);

        if (target.typeId === "minecraft:player") {
            target.sendMessage(`§a▪ You've been granted access to a dome!`);
        }
    }

    isPlayerOnCooldown(player) {
        const cooldownEnd = this.playerCooldowns.get(player.id);
        if (!cooldownEnd) return false;

        const currentTick = system.currentTick;
        return currentTick < cooldownEnd;
    }

    setPlayerCooldown(player) {
        const currentTick = system.currentTick;
        this.playerCooldowns.set(
            player.id,
            currentTick + this.cooldownDuration
        );
    }

    showRadiusSelectionForm(player, location, chestLocation, dimension) {
        const form = new ActionFormData();
        form.title("§6☼ Configure Force Field Dome");
        form.body(
            "§7Select the dome radius:\n\n§e☶ Note: Larger domes consume fuel faster!"
        );

        for (
            let radius = MIN_DOME_RADIUS;
            radius <= MAX_DOME_RADIUS;
            radius += RADIUS_STEP
        ) {
            const fuelInterval = calculateFuelInterval(radius);
            const fuelSeconds = Math.round(fuelInterval / 20);
            form.button(`§a${radius} blocks\n§7⚡ Fuel: Every ${fuelSeconds}s`);
        }

        system.run(() => {
            form.show(player).then((response) => {
                if (response.canceled) {
                    player.sendMessage("§cDome activation canceled");
                    return;
                }

                const selectedIndex = response.selection;
                const selectedRadius =
                    MIN_DOME_RADIUS + selectedIndex * RADIUS_STEP;

                if (
                    !this.isAreaClearAboveDome(
                        location,
                        dimension,
                        selectedRadius
                    )
                ) {
                    player.sendMessage(
                        "§cError: There are blocks above the dome within the dome radius! Clear the area first."
                    );
                    return;
                }

                if (!this.consumeInitialFuel(dimension, chestLocation)) {
                    player.sendMessage(
                        "§cError: Not enough fuel to start the dome!"
                    );
                    return;
                }

                this.createDome(
                    location,
                    chestLocation,
                    dimension,
                    selectedRadius,
                    player
                );
            });
        });
    }

    showDomeManagementForm(
        player,
        location,
        chestLocation,
        dimension,
        existingDome
    ) {
        const form = new ActionFormData();
        form.title("§6☼ Manage Force Field Dome");
        form.body(
            `§7Current Status: §a▪ Active\n§7Current Radius: §e${existingDome.radius} blocks\n\n§7What would you like to do?`
        );

        form.button("§e☽ Change Radius\n§7Modify dome size");
        form.button("§c☒ Shutdown Dome\n§7Deactivate the force field");

        system.run(() => {
            form.show(player).then((response) => {
                if (response.canceled) {
                    player.sendMessage("§eAction canceled");
                    return;
                }

                const selectedIndex = response.selection;

                if (selectedIndex === 0) {
                    this.showRadiusChangeForm(
                        player,
                        location,
                        chestLocation,
                        dimension,
                        existingDome
                    );
                } else if (selectedIndex === 1) {
                    this.showShutdownConfirmation(
                        player,
                        location,
                        existingDome
                    );
                }
            });
        });
    }

    showRadiusChangeForm(
        player,
        location,
        chestLocation,
        dimension,
        existingDome
    ) {
        const form = new ActionFormData();
        form.title("§6📏 Change Dome Radius");
        form.body(
            `§7Current Radius: §e${existingDome.radius} blocks\n\n§7Select a new radius:\n\n§e☉ Note: Larger domes consume fuel faster!`
        );

        for (
            let radius = MIN_DOME_RADIUS;
            radius <= MAX_DOME_RADIUS;
            radius += RADIUS_STEP
        ) {
            const fuelInterval = calculateFuelInterval(radius);
            const fuelSeconds = Math.round(fuelInterval / 20);
            const isCurrent = radius === existingDome.radius;
            const prefix = isCurrent ? "§e▪ [CURRENT] " : "§a♛ ";
            form.button(
                `${prefix}${radius} blocks\n§7⚡ Fuel: Every ${fuelSeconds}s`
            );
        }

        system.run(() => {
            form.show(player).then((response) => {
                if (response.canceled) {
                    player.sendMessage("§eRadius change canceled");
                    return;
                }

                const selectedIndex = response.selection;
                const selectedRadius =
                    MIN_DOME_RADIUS + selectedIndex * RADIUS_STEP;

                if (selectedRadius === existingDome.radius) {
                    player.sendMessage(
                        "§e☉ Dome is already set to this radius"
                    );
                    return;
                }

                if (
                    !this.isAreaClearAboveDome(
                        location,
                        dimension,
                        selectedRadius
                    )
                ) {
                    player.sendMessage(
                        "§cError: There are blocks above the dome within the new dome radius! Clear the area first."
                    );
                    return;
                }

                existingDome.deactivate();
                const domeKey = this.getDomeKey(location);
                this.activeDomes.delete(domeKey);

                const newDome = new Dome(
                    existingDome.center,
                    chestLocation,
                    location,
                    dimension,
                    existingDome.id,
                    selectedRadius
                );
                this.activeDomes.set(domeKey, newDome);

                const fuelInterval = calculateFuelInterval(selectedRadius);
                const fuelSeconds = Math.round(fuelInterval / 20);

                player.sendMessage(
                    `§a▪ Dome radius changed to ${selectedRadius} blocks!`
                );
                player.sendMessage(
                    `§7⚡ Fuel consumption: 1 power sphere every ${fuelSeconds} seconds`
                );

                const players = world.getAllPlayers();
                for (const p of players) {
                    if (p.id !== player.id && p.hasTag(newDome.safeTag)) {
                        p.sendMessage(
                            `§e☽ Dome radius has been changed to ${selectedRadius} blocks`
                        );
                    }
                }
            });
        });
    }

    showShutdownConfirmation(player, location, existingDome) {
        const form = new ActionFormData();
        form.title("§c☉ Confirm Dome Shutdown");
        form.body(
            `§7Are you sure you want to shutdown the dome?\n\n§7Current Radius: §e${existingDome.radius} blocks\n\n§c☉ Warning: This will deactivate the force field and remove all access permissions!`
        );

        form.button("§a▪ Cancel\n§7Keep the dome active");
        form.button("§c☒ Shutdown\n§7Deactivate the dome");

        system.run(() => {
            form.show(player).then((response) => {
                if (response.canceled || response.selection === 0) {
                    player.sendMessage("§a▪ Dome shutdown canceled");
                    return;
                }

                if (response.selection === 1) {
                    const domeKey = this.getDomeKey(location);
                    existingDome.deactivate();
                    this.activeDomes.delete(domeKey);
                    player.sendMessage(
                        "§c☼ Dome has been shut down successfully!"
                    );

                    const players = world.getAllPlayers();
                    for (const p of players) {
                        if (
                            p.id !== player.id &&
                            p.hasTag(existingDome.safeTag)
                        ) {
                            p.sendMessage(
                                `§c☼ The dome has been shut down by an operator`
                            );
                        }
                    }
                }
            });
        });
    }

    isAreaClearAboveDome(location, dimension, radius) {
        const centerX = location.x;
        const centerY = location.y;
        const centerZ = location.z;
        const topY = centerY + radius;

        for (let y = topY + 1; y <= topY; y++) {
            try {
                const block = dimension.getBlock({ x: centerX, y, z: centerZ });
                if (block && !block.isAir) {
                    return false;
                }
            } catch (e) {
                continue;
            }
        }

        return true;
    }

    consumeInitialFuel(dimension, chestLocation) {
        try {
            const chest = dimension.getBlock(chestLocation);
            if (!chest || chest.typeId !== FUEL_BLOCK) {
                return false;
            }

            const container = chest.getComponent(
                EntityComponentTypes.Inventory
            ).container;

            for (let i = 0; i < container.size; i++) {
                const item = container.getItem(i);

                if (item && item.typeId === FUEL_ITEM) {
                    if (item.amount > 1) {
                        item.amount -= 1;
                        container.setItem(i, item);
                    } else {
                        container.setItem(i, undefined);
                    }
                    return true;
                }
            }

            return false;
        } catch (e) {
            return false;
        }
    }

    createDome(location, chestLocation, dimension, radius, creator) {
        const domeId = generateUUID();
        const center = {
            x: location.x + 0.5,
            y: location.y,
            z: location.z + 0.5,
        };

        const dome = new Dome(
            center,
            chestLocation,
            location,
            dimension,
            domeId,
            radius
        );
        const domeKey = this.getDomeKey(location);
        this.activeDomes.set(domeKey, dome);

        const creatorDomes = this.playerDomeAccess.get(creator.id) || [];
        creatorDomes.push(domeId);
        this.playerDomeAccess.set(creator.id, creatorDomes);

        const fuelInterval = calculateFuelInterval(radius);
        const fuelSeconds = Math.round(fuelInterval / 20);

        const players = world.getAllPlayers();
        for (const player of players) {
            if (player.dimension.id === dimension.id) {
                const distance = Math.sqrt(
                    Math.pow(player.location.x - center.x, 2) +
                        Math.pow(player.location.z - center.z, 2)
                );
                if (distance < 50) {
                    player.sendMessage(
                        `§a▪ Dome activated! Radius: ${radius} blocks`
                    );
                    player.sendMessage(
                        `§7⚡ Fuel consumption: 1 power sphere every ${fuelSeconds} seconds`
                    );
                    player.sendMessage(
                        `§7✉ Right-click entities with your access card to grant them access`
                    );
                }
            }
        }
    }

    isValidDomeStructure(block, dimension) {
        const belowLocation = {
            x: block.location.x,
            y: block.location.y - 1,
            z: block.location.z,
        };

        const belowBlock = dimension.getBlock(belowLocation);

        if (belowBlock && belowBlock.typeId === FUEL_BLOCK) {
            return belowLocation;
        }

        return null;
    }

    chestHasFuel(dimension, chestLocation) {
        try {
            const chest = dimension.getBlock(chestLocation);
            const container = chest.getComponent(
                EntityComponentTypes.Inventory
            ).container;

            for (let i = 0; i < container.size; i++) {
                const item = container.getItem(i);
                if (item && item.typeId === FUEL_ITEM) {
                    return true;
                }
            }
        } catch (e) {
            return false;
        }

        return false;
    }

    getDomeKey(location) {
        return `${location.x}_${location.y}_${location.z}`;
    }

    startUpdateLoop() {
        this.updateIntervalId = system.runInterval(() => {
            this.update();
        }, 2);
    }

    update() {
        const domesToRemove = [];

        for (const [key, dome] of this.activeDomes) {
            const stillActive = dome.update();

            if (!stillActive) {
                dome.deactivate();
                domesToRemove.push(key);
            }
        }

        for (const key of domesToRemove) {
            this.activeDomes.delete(key);
        }

        this.cleanupCooldowns();
    }

    cleanupCooldowns() {
        const currentTick = system.currentTick;
        for (const [playerId, cooldownEnd] of this.playerCooldowns) {
            if (currentTick >= cooldownEnd) {
                this.playerCooldowns.delete(playerId);
            }
        }
    }
}

class Dome {
    constructor(
        center,
        chestLocation,
        ironBlockLocation,
        dimension,
        id,
        radius
    ) {
        this.center = center;
        this.chestLocation = chestLocation;
        this.ironBlockLocation = ironBlockLocation;
        this.dimension = dimension;
        this.id = id;
        this.radius = radius;
        this.safeTag = `dome_safe_${id}`;
        this.isActive = true;
        this.ticksSinceLastFuel = 0;
        this.borderAngle = 0;
        this.soundInterval = 0;
        this.fuelConsumptionInterval = calculateFuelInterval(radius);

        this.tagPlayersInside();
        this.playActivationSound();
    }

    tagPlayersInside() {
        system.run(() => {
            const players = world.getAllPlayers();
            for (const player of players) {
                if (this.isInsideDome(player.location)) {
                    player.addTag(this.safeTag);
                    player.sendMessage(
                        `§a▪ You've been granted safe passage in this dome`
                    );
                }
            }

            const entities = this.dimension.getEntities();
            for (const entity of entities) {
                if (
                    entity.typeId !== "minecraft:player" &&
                    entity.typeId !== "minecraft:item"
                ) {
                    if (this.isInsideDome(entity.location)) {
                        entity.addTag(this.safeTag);
                    }
                }
            }
        });
    }

    playActivationSound() {
        system.run(() => {
            this.dimension.playSound("beacon.activate", this.center);
        });
    }

    playBeaconAmbientSound() {
        system.run(() => {
            this.dimension.playSound("beacon.ambient", this.center, {
                volume: 0.5,
                pitch: 1.0,
            });
        });
    }

    isInsideDome(location) {
        const dx = location.x - this.center.x;
        const dy = location.y - this.center.y;
        const dz = location.z - this.center.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz) <= this.radius;
    }

    consumeFuel() {
        try {
            const chest = this.dimension.getBlock(this.chestLocation);

            if (!chest || chest.typeId !== FUEL_BLOCK) {
                return false;
            }

            const container = chest.getComponent(
                EntityComponentTypes.Inventory
            ).container;

            for (let i = 0; i < container.size; i++) {
                const item = container.getItem(i);

                if (item && item.typeId === FUEL_ITEM) {
                    if (item.amount > 1) {
                        item.amount -= 1;
                        container.setItem(i, item);
                    } else {
                        container.setItem(i, undefined);
                    }

                    this.dimension.spawnParticle("minecraft:lava_particle", {
                        x: this.chestLocation.x + 0.5,
                        y: this.chestLocation.y + 1,
                        z: this.chestLocation.z + 0.5,
                    });

                    return true;
                }
            }

            return false;
        } catch (e) {
            return false;
        }
    }

    update() {
        if (!this.isActive) return false;

        const centerBlock = this.dimension.getBlock(this.ironBlockLocation);
        if (!centerBlock || centerBlock.typeId !== DOME_BLOCK) {
            this.sendMessageToPlayersWithTag(
                "§c☉ Dome center block destroyed!"
            );
            return false;
        }

        this.ticksSinceLastFuel++;
        this.soundInterval++;

        if (this.soundInterval >= 80) {
            this.playBeaconAmbientSound();
            this.soundInterval = 0;
        }

        if (this.ticksSinceLastFuel >= this.fuelConsumptionInterval) {
            this.ticksSinceLastFuel = 0;

            const hasFuel = this.consumeFuel();

            if (!hasFuel) {
                this.sendMessageToPlayersWithTag(
                    "§c☉ Dome has run out of fuel!"
                );
                return false;
            } else {
                const fuelSeconds = Math.round(
                    this.fuelConsumptionInterval / 20
                );
                this.sendMessageToPlayersWithTag(
                    `§7⚡ Dome consumed 1 power sphere (Next in ${fuelSeconds}s)`
                );
            }
        }

        this.spawnBeaconBeam();
        this.spawnDomeParticles();
        this.spawnBorderParticles();
        this.checkEntities();

        return true;
    }

    spawnBeaconBeam() {
        const beamHeight = this.radius;
        const particlesPerTick = Math.max(20, Math.floor(beamHeight / 2));

        for (let i = 0; i < particlesPerTick; i++) {
            const y = this.center.y + Math.random() * beamHeight;

            const offsetX = (Math.random() - 0.5) * 0.3;
            const offsetZ = (Math.random() - 0.5) * 0.3;

            try {
                this.dimension.spawnParticle(BEACON_PARTICLE_TYPE, {
                    x: this.center.x + offsetX,
                    y: y,
                    z: this.center.z + offsetZ,
                });
            } catch (e) {
                // Particle spawn failed
            }
        }
    }

    spawnDomeParticles() {
        const points = 50;

        for (let i = 0; i < points; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x =
                this.center.x + this.radius * Math.sin(phi) * Math.cos(theta);
            const y =
                this.center.y + this.radius * Math.sin(phi) * Math.sin(theta);
            const z = this.center.z + this.radius * Math.cos(phi);

            if (y >= this.center.y) {
                try {
                    this.dimension.spawnParticle(PARTICLE_TYPE, { x, y, z });
                } catch (e) {
                    // Particle spawn failed
                }
            }
        }
    }

    spawnBorderParticles() {
        this.borderAngle += 0.1;
        if (this.borderAngle >= Math.PI * 2) {
            this.borderAngle = 0;
        }

        const numCircles = Math.max(8, Math.floor(this.radius / 2));
        const pointsPerCircle = Math.max(32, Math.floor(this.radius * 3));
        const gapSize = 0.3;

        for (let h = 0; h <= numCircles; h++) {
            const heightRatio = h / numCircles;
            const circleY = this.center.y + this.radius * heightRatio;
            const circleRadius =
                this.radius * Math.sqrt(1 - heightRatio * heightRatio);

            if (circleRadius < 0.5) continue;

            for (let p = 0; p < pointsPerCircle; p++) {
                const angle =
                    (p / pointsPerCircle) * Math.PI * 2 + this.borderAngle;

                const segmentPosition = (angle % (Math.PI / 4)) / (Math.PI / 4);
                if (
                    segmentPosition > gapSize &&
                    segmentPosition < 1 - gapSize
                ) {
                    const x = this.center.x + circleRadius * Math.cos(angle);
                    const z = this.center.z + circleRadius * Math.sin(angle);

                    try {
                        this.dimension.spawnParticle(BORDER_PARTICLE_TYPE, {
                            x,
                            y: circleY,
                            z,
                        });
                    } catch (e) {
                        // Particle spawn failed
                    }
                }
            }
        }
    }

    checkEntities() {
        const entities = this.dimension.getEntities();

        for (const entity of entities) {
            if (!this.isInsideDome(entity.location)) continue;

            if (entity.typeId === "minecraft:player") {
                if (!entity.hasTag(this.safeTag)) {
                    this.damageEntity(entity);
                }
            } else if (entity.typeId !== "minecraft:item") {
                if (!entity.hasTag(this.safeTag)) {
                    this.damageEntity(entity);
                }
            }
        }
    }

    damageEntity(entity) {
        try {
            entity.applyDamage(DAMAGE_AMOUNT, {
                cause: EntityDamageCause.magic,
            });

            if (entity.typeId === "minecraft:player") {
                entity.onScreenDisplay.setActionBar("§c⚡ Force field damage!");
            }
        } catch (e) {
            // Entity might be dead or immune
        }
    }

    sendMessageToPlayersWithTag(message) {
        const players = world.getAllPlayers();
        for (const player of players) {
            if (player.hasTag(this.safeTag)) {
                player.sendMessage(message);
            }
        }
    }

    deactivate() {
        this.isActive = false;

        system.run(() => {
            this.dimension.playSound("beacon.deactivate", this.center);
        });

        system.run(() => {
            const players = world.getAllPlayers();
            for (const player of players) {
                if (player.hasTag(this.safeTag)) {
                    player.removeTag(this.safeTag);
                    player.sendMessage(`§c☼ Dome has been deactivated`);
                }
            }

            const entities = this.dimension.getEntities();
            for (const entity of entities) {
                if (entity.hasTag(this.safeTag)) {
                    entity.removeTag(this.safeTag);
                }
            }
        });
    }
}

export function registerForcefieldDome() {
    const manager = new ForceFieldDomeManager();
    manager.initialize();
    return manager;
}

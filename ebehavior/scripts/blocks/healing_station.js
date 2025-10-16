import { world, system } from '@minecraft/server';

class HealingSystem {
    constructor(config = {}) {
        this.config = {
            healingDuration: config.healingDuration || 60,
            healAmount: config.healAmount || 6,
            particleType: config.particleType || 'minecraft:heart_particle',
            requiredItem: config.requiredItem || 'eon:power_sphere',
            requiredBlock: config.requiredBlock || 'eon:healing_station',
            maxDistance: config.maxDistance || 1,
            cooldownTicks: config.cooldownTicks || 20,
            startSound: config.startSound || 'beacon.activate',
            startSoundVolume: config.startSoundVolume || 1.0,
            startSoundPitch: config.startSoundPitch || 1.2,
            ...config
        };

        this.healingPlayers = new Map();
        this.cooldowns = new Map();

        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;
        this.setupEventListeners();
        this.startHealingLoop();
        this.initialized = true;
    }

    setupEventListeners() {
        world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
            this.handleItemUseOnBlock(event);
        });

        world.afterEvents.playerLeave.subscribe((event) => {
            this.healingPlayers.delete(event.playerId);
            this.cooldowns.delete(event.playerId);
        });
    }

    handleItemUseOnBlock(event) {
        const player = event.player;
        const block = event.block;
        const item = event.itemStack;

        // Item and block validation
        if (item?.typeId !== this.config.requiredItem) return;
        if (block?.typeId !== this.config.requiredBlock) return;

        // Cooldown check
        if (this.cooldowns.has(player.id)) {
            const lastUseTick = this.cooldowns.get(player.id);
            if (system.currentTick - lastUseTick < this.config.cooldownTicks) {
                return;
            }
        }

        // Prevent duplicate healing
        if (this.healingPlayers.has(player.id)) {
            system.run(()=>{player.onScreenDisplay.setActionBar('§cYou are already healing!')});
            return;
        }

        // Check distance BEFORE consuming item
        if (this.checkPlayerMoved(player, block.location)) {
            system.run(()=>{player.onScreenDisplay.setActionBar('§cYou are too far from the healing station!')});
            return;
        }

        // Set cooldown
        this.cooldowns.set(player.id, system.currentTick);
        
        // Consume one item
        system.run(() => {
            this.consumeItem(player, item.typeId);
        });
        
        this.startHealing(player, block.location);
    }

    consumeItem(player, itemId) {
        const inventory = player.getComponent('minecraft:inventory')?.container;
        if (!inventory) return;

        for (let i = 0; i < inventory.size; i++) {
            const slot = inventory.getItem(i);
            if (slot && slot.typeId === itemId) {
                if (slot.amount > 1) {
                    slot.amount -= 1;
                    inventory.setItem(i, slot);
                } else {
                    inventory.setItem(i, undefined);
                }
                break;
            }
        }
    }

    startHealing(player, blockLocation) {
        this.healingPlayers.set(player.id, {
            player: player,
            location: blockLocation,
            ticksRemaining: this.config.healingDuration,
            startTime: system.currentTick
        });

        player.sendMessage('§aHealing process started! Stay still...');
        
        // Play cool sound effects when healing starts
        try {
            system.run(()=>{
                player.playSound(this.config.startSound, {
                volume: this.config.startSoundVolume,
                pitch: this.config.startSoundPitch
            });
            });
        } catch (e) {
            // Ignore sound errors
        }
    }

    startHealingLoop() {
        system.runInterval(() => {
            this.updateHealingPlayers();
        }, 1);
    }

    updateHealingPlayers() {
        for (const [playerId, data] of this.healingPlayers.entries()) {
            const { player, location, ticksRemaining } = data;

            if (!player?.isValid) {
                this.healingPlayers.delete(playerId);
                continue;
            }

            if (this.checkPlayerMoved(player, location)) {
                player.sendMessage('§cHealing interrupted - you moved too far!');
                this.healingPlayers.delete(playerId);
                continue;
            }

            this.spawnHealingParticles(player, location, ticksRemaining);

            data.ticksRemaining--;

            if (data.ticksRemaining <= 0) {
                this.completeHealing(player, location);
                this.healingPlayers.delete(playerId);
            }
        }
    }

    checkPlayerMoved(player, blockLocation) {
        const playerLoc = player.location;
        const blockCenter = {
            x: blockLocation.x + 0.5,
            y: blockLocation.y + 1,
            z: blockLocation.z + 0.5
        };

        const distance = Math.sqrt(
            Math.pow(playerLoc.x - blockCenter.x, 2) +
            Math.pow(playerLoc.y - blockCenter.y, 2) +
            Math.pow(playerLoc.z - blockCenter.z, 2)
        );

        return distance > this.config.maxDistance;
    }

    spawnHealingParticles(player, location, ticksRemaining) {
        try {
            player.dimension.spawnParticle(this.config.particleType, {
                x: location.x + 0.5,
                y: location.y + 1.2,
                z: location.z + 0.5
            });

            if (ticksRemaining % 5 === 0) {
                player.dimension.spawnParticle('minecraft:villager_happy', {
                    x: location.x + 0.5 + (Math.random() - 0.5) * 0.5,
                    y: location.y + 1.2,
                    z: location.z + 0.5 + (Math.random() - 0.5) * 0.5
                });
            }
        } catch (e) {
            // Ignore particle errors
        }
    }

    completeHealing(player, location) {
        try {
            this.removeNegativeEffects(player);
            this.healPlayer(player);
            this.applyPositiveEffects(player);
            this.spawnCompletionParticles(player, location);

            player.sendMessage('§a§lHealing complete! You feel refreshed!');
            player.playSound('random.levelup', { volume: 1.0, pitch: 1.0 });
        } catch (e) {
            player.sendMessage('§cHealing failed: ' + e);
        }
    }

    removeNegativeEffects(player) {
        const effects = player.getEffects();
        for (const effect of effects) {
            if (this.isNegativeEffect(effect.typeId)) {
                player.removeEffect(effect.typeId);
            }
        }
    }

    healPlayer(player) {
        const health = player.getComponent('minecraft:health');
        if (health) {
            const maxHealth = health.effectiveMax;
            const currentHealth = health.currentValue;
            const newHealth = Math.min(currentHealth + this.config.healAmount, maxHealth);
            health.setCurrentValue(newHealth);
        }
    }

    applyPositiveEffects(player) {
        player.runCommand('effect @s saturation 10 255 true');
        player.runCommand('effect @s regeneration 5 1 true');
    }

    spawnCompletionParticles(player, location) {
        player.dimension.spawnParticle('minecraft:totem_particle', {
            x: location.x + 0.5,
            y: location.y + 1.2,
            z: location.z + 0.5
        });
    }

    isNegativeEffect(effectId) {
        const negativeEffects = [
            'minecraft:poison',
            'minecraft:wither',
            'minecraft:weakness',
            'minecraft:slowness',
            'minecraft:mining_fatigue',
            'minecraft:nausea',
            'minecraft:blindness',
            'minecraft:hunger',
            'minecraft:instant_damage',
            'minecraft:levitation',
            'minecraft:darkness'
        ];
        return negativeEffects.includes(effectId);
    }

    getActiveHealingCount() {
        return this.healingPlayers.size;
    }

    isPlayerHealing(playerId) {
        return this.healingPlayers.has(playerId);
    }
}

export function registerHealingStation(config = {}) {
    const healingSystem = new HealingSystem(config);
    healingSystem.initialize();
    return healingSystem;
}
import { world, system, GameMode } from '@minecraft/server';

class GravityElevator {
    constructor(config = {}) {
        this.ELEVATOR_BLOCK_TYPE = config.elevatorBlockType || 'eon:gravity_pad';
        this.MAX_HEIGHT = config.maxHeight || 64;
        this.LEVITATION_AMPLIFIER = config.levitationAmplifier || 5;
        this.SLOW_FALLING_AMPLIFIER = config.slowFallingAmplifier || 1;
        this.EFFECT_DURATION = config.effectDuration || 60;
        this.UP_EFFECT = "levitation";
        this.DOWN_EFFECT = "slow_falling";
        
        this.playerStates = new Map();
        
        this.runInterval = null;
        this.chatSubscription = null;
        this.playerLeaveSubscription = null;
        
        this.isInitialized = false;
    }

    initialize() {
        if (this.isInitialized) {
            return;
        }
        
        this.setupMainLoop();
        this.setupEventHandlers();
        
        this.isInitialized = true;
    }

    cleanup() {
        if (this.runInterval) {
            system.clearRun(this.runInterval);
            this.runInterval = null;
        }
        
        if (this.chatSubscription) {
            world.beforeEvents.chatSend.unsubscribe(this.chatSubscription);
            this.chatSubscription = null;
        }
        
        if (this.playerLeaveSubscription) {
            world.afterEvents.playerLeave.unsubscribe(this.playerLeaveSubscription);
            this.playerLeaveSubscription = null;
        }
        
        this.playerStates.clear();
        this.isInitialized = false;
    }
    
    updateConfig(config) {
        if (config.elevatorBlockType) this.ELEVATOR_BLOCK_TYPE = config.elevatorBlockType;
        if (config.maxHeight) this.MAX_HEIGHT = config.maxHeight;
        if (config.levitationAmplifier) this.LEVITATION_AMPLIFIER = config.levitationAmplifier;
        if (config.slowFallingAmplifier) this.SLOW_FALLING_AMPLIFIER = config.slowFallingAmplifier;
        if (config.effectDuration) this.EFFECT_DURATION = config.effectDuration;
        if (config.enableChatCommands !== undefined) this.ENABLE_CHAT_COMMANDS = config.enableChatCommands;
    }
    
    findElevatorBlockBelow(player) {
        const playerLocation = player.location;
        const playerX = Math.floor(playerLocation.x);
        const playerZ = Math.floor(playerLocation.z);
        const playerY = Math.floor(playerLocation.y);
        
        for (let y = playerY; y >= playerY - this.MAX_HEIGHT; y--) {
            try {
                const block = player.dimension.getBlock({
                    x: playerX,
                    y: y,
                    z: playerZ
                });
                
                if (block && block.typeId === this.ELEVATOR_BLOCK_TYPE) {
                    return { found: true, blockY: y, distance: playerY - y };
                }
            } catch (error) {
                continue;
            }
        }
        
        return { found: false, blockY: -1, distance: -1 };
    }
    
    applyEffects(player, isSneaking) {
        try {
            player.removeEffect(this.DOWN_EFFECT);
            player.removeEffect(this.UP_EFFECT);
        } catch (error) {}
        
        try {
            if (isSneaking) {
                player.addEffect(this.DOWN_EFFECT, this.EFFECT_DURATION, {
                    amplifier: this.SLOW_FALLING_AMPLIFIER,
                    showParticles: false
                });
            } else {
                player.addEffect(this.UP_EFFECT, this.EFFECT_DURATION, {
                    amplifier: this.LEVITATION_AMPLIFIER,
                    showParticles: false
                });
            }
        } catch (error) {}
    }
    
    removeEffects(player) {
        try {
            player.removeEffect(this.DOWN_EFFECT);
            player.removeEffect(this.UP_EFFECT);
        } catch (error) {}
    }

    processPlayer(player) {
        if (player.getGameMode() === GameMode.Spectator) {
            return;
        }
        
        const playerId = player.id;
        const playerLocation = player.location;
        
        const elevatorResult = this.findElevatorBlockBelow(player);
        
        let currentState = this.playerStates.get(playerId) || {
            onElevator: false,
            isSneaking: false,
            lastY: playerLocation.y,
            lastEffectTick: 0
        };
        
        const currentTick = system.currentTick;
        
        if (elevatorResult.found && elevatorResult.distance <= this.MAX_HEIGHT) {
            const isSneaking = player.isSneaking;
            
            const stateChanged = currentState.onElevator !== true || 
                               currentState.isSneaking !== isSneaking;
            
            const needsRefresh = (currentTick - currentState.lastEffectTick) >= 30;
            
            if (stateChanged || needsRefresh) {
                this.applyEffects(player, isSneaking);
                currentState.lastEffectTick = currentTick;
            }
            
            this.playerStates.set(playerId, {
                onElevator: true,
                isSneaking: isSneaking,
                lastY: playerLocation.y,
                lastEffectTick: currentState.lastEffectTick
            });
            
        } else {
            if (currentState.onElevator) {
                this.removeEffects(player);
                
                this.playerStates.set(playerId, {
                    onElevator: false,
                    isSneaking: false,
                    lastY: playerLocation.y,
                    lastEffectTick: 0
                });
            }
        }
    }
    
    setupMainLoop() {
        this.runInterval = system.runInterval(() => {
            const players = world.getAllPlayers();
            
            for (const player of players) {
                this.processPlayer(player);
            }
        }, 1);
    }

    setupEventHandlers() {
        this.playerLeaveSubscription = world.afterEvents.playerLeave.subscribe((event) => {
            this.playerStates.delete(event.playerId);
        });
    }

    getStatus() {
        return {
            isInitialized: this.isInitialized,
            elevatorBlockType: this.ELEVATOR_BLOCK_TYPE,
            maxHeight: this.MAX_HEIGHT,
            levitationAmplifier: this.LEVITATION_AMPLIFIER,
            slowFallingAmplifier: this.SLOW_FALLING_AMPLIFIER,
            effectDuration: this.EFFECT_DURATION,
            activePlayerCount: this.playerStates.size
        };
    }
}

function registerGravityElevator(config = {}) {
    const elevator = new GravityElevator(config);
    elevator.initialize();
    return elevator;
}

export { registerGravityElevator };
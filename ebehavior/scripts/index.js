import { registerGuide } from "./items/guide.js";
import { registerWelcome } from "./events/welcome.js";
import { registerRadioActivity } from "./events/radioactivity.js";
import { registerHoverBikeSound } from "./entity/hover_bike_sound.js";
import { registerGravityElevator } from "./blocks/gravity_pad.js";
import { registerHazmatProperties } from "./events/hazmat_properties.js"
import { registerNightVisionGlasses } from "./items/night_vision_glasses.js";
import { registerGravityGun } from "./items/gravity_gun.js";
import { registerForcefieldDome } from "./blocks/dome.js";
import { registerSaberFireEffect } from "./items/light_saber.js";
import { registerHealingStation } from "./blocks/healing_station.js";
import { registerDurabilityRestorer } from "./items/durability_restore.js";

registerWelcome();
registerGuide();
registerRadioActivity();
registerHoverBikeSound();
registerGravityElevator();
registerHazmatProperties();
registerNightVisionGlasses();
registerGravityGun();
registerForcefieldDome();
registerSaberFireEffect();
registerHealingStation();
registerDurabilityRestorer();
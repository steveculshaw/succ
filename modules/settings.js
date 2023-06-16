import * as BUTLER from "./butler.js";
import { EnhancedConditions } from "./enhanced-conditions/enhanced-conditions.js";
import { Sidekick } from "./sidekick.js";
import { TokenUtility } from "./utils/token.js";

export function registerSettings() {

    /* -------------------------------------------- */
    /*              EnhancedConditions              */
    /* -------------------------------------------- */

    // Storage for the backup of the core effects map
    Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.coreEffects, {
        name: "SETTINGS.EnhancedConditions.CoreEffectsN",
        hint: "SETTINGS.EnhancedConditions.CoreEffectsH",
        scope: "world",
        type: Object,
        default: [],
        config: false,
        onChange: s => {}
    });

    Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.systemVersionIgnore, {
        name: "Condition map version ignore",
        hint: "This is the last version the user ignore when checking for system updates",
        scope: "world",
        type: String,
        default: "",
        config: false,
        apiOnly: true,
        onChange: s => {}
    });

    Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.mapType, {
        name: "SETTINGS.EnhancedConditions.MapTypeN",
        hint: "SETTINGS.EnhancedConditions.MapTypeH",
        scope: "world",
        type: String,
        default: "",
        choices: BUTLER.DEFAULT_CONFIG.enhancedConditions.mapTypes,
        config: false,
        apiOnly: true,
        onChange: s => {}
    });

    Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.defaultMap, {
        name: "SETTINGS.EnhancedConditions.DefaultMapN",
        hint: "SETTINGS.EnhancedConditions.DefaultMapH",
        scope: "world",
        type: Object,
        default: {},
        onChange: s => {}
    });

    Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.map, {
        name: "SETTINGS.EnhancedConditions.ActiveConditionMapN",
        hint: "SETTINGS.EnhancedConditions.ActiveConditionMapH",
        scope: "world",
        type: Object,
        default: [],
        onChange: async conditionMap => {
            await EnhancedConditions._updateStatusEffects(conditionMap);

            // Save the active condition map to a convenience property
            if (game.succ) {
                game.succ.conditions = conditionMap;
            }
        }
    });

    Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.outputChat, {
        name: "SETTINGS.EnhancedConditions.OutputChatN",
        hint: "SETTINGS.EnhancedConditions.OutputChatH",
        scope: "world",
        type: Boolean,
        config: true,
        default: BUTLER.DEFAULT_CONFIG.enhancedConditions.outputChat,
        onChange: s => {
            if (s === true) {
                const dialog = Dialog.confirm({
                    title: game.i18n.localize(`${BUTLER.NAME}.ENHANCED_CONDITIONS.OutputChatConfirm.Title`),
                    content: game.i18n.localize(`${BUTLER.NAME}.ENHANCED_CONDITIONS.OutputChatConfirm.Content`),
                    yes: () => {
                        const newMap = deepClone(game.succ.conditions);
                        if (!newMap.length) return;
                        newMap.forEach(c => c.options.outputChat = true);
                        Sidekick.setSetting(BUTLER.SETTING_KEYS.enhancedConditions.map, newMap);
                    },
                    no: () => {}
                });
            }
        }
    });

    Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.removeDefaultEffects, {
        name: "SETTINGS.EnhancedConditions.RemoveDefaultEffectsN",
        hint: "SETTINGS.EnhancedConditions.RemoveDefaultEffectsH",
        scope: "world",
        type: Boolean,
        config: true,
        default: BUTLER.DEFAULT_CONFIG.enhancedConditions.removeDefaultEffects,
        onChange: s => {
            EnhancedConditions._updateStatusEffects();
        }
    });

    Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.showSortDirectionDialog, {
        name: `${BUTLER.NAME}.SETTINGS.ENHANCED_CONDITIONS.ShowSortDirectionDialogN`,
        hint: `${BUTLER.NAME}.SETTINGS.ENHANCED_CONDITIONS.ShowSortDirectionDialogH`,
        scope: "world",
        type: Boolean,
        config: false,
        default: true,
        onChange: s => {}
    });

    Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.defaultSpecialStatusEffects, {
        name: `${BUTLER.NAME}.SETTINGS.ENHANCED_CONDITIONS.DefaultSpecialStatusEffectsN`,
        hint: `${BUTLER.NAME}.SETTINGS.ENHANCED_CONDITIONS.DefaultSpecialStatusEffectsH`,
        scope: "world",
        type: Object,
        default: {},
        config: false,
        onChange: () => {}
    });

    Sidekick.registerSetting(BUTLER.SETTING_KEYS.enhancedConditions.specialStatusEffectMapping, {
        name: `${BUTLER.NAME}.SETTINGS.ENHANCED_CONDITIONS.SpecialStatusEffectMappingN`,
        hint: `${BUTLER.NAME}.SETTINGS.ENHANCED_CONDITIONS.SpecialStatusEffectMappingH`,
        scope: "world",
        type: Object,
        default: {},
        config: false,
        onChange: () => {}
    });

    /* -------------------------------------------- */
    /*                 TokenUtility                 */
    /* -------------------------------------------- */

    Sidekick.registerSetting(BUTLER.SETTING_KEYS.tokenUtility.effectSize, {
        name: "SETTINGS.TokenUtility.TokenEffectSizeN",
        hint: "SETTINGS.TokenUtility.TokenEffectSizeH",
        default: Sidekick.getKeyByValue(BUTLER.DEFAULT_CONFIG.tokenUtility.effectSizeChoices, BUTLER.DEFAULT_CONFIG.tokenUtility.effectSizeChoices.small),
        scope: "client",
        type: String,
        choices: BUTLER.DEFAULT_CONFIG.tokenUtility.effectSizeChoices,
        config: true,
        onChange: s => {
            TokenUtility.patchCore();
            canvas.draw();
        }
    });
}
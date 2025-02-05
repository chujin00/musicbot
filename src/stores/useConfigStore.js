import { defineStore } from "pinia";
import { encode, decode } from 'js-base64';

export const useConfigStore= defineStore('config',{
    state: () => ({
        tag: "home",
        isLoading: false,
        showSettingModal: false,
        language: 0,
        fontSize: 0,
        useDallEGeneration: true,
        showMoreButton: true,
        controlMethod: 3, // 0 no 1 tag 2 conversation (user driven) 3 ask & conversation (hybrid) 4 No Image
        misTemperature: 0.6,
        dalleSeed: 1384921747,
        dalleStyle: "vivid",
        isDebug: false,
        showMusicButton: true,
    }),
    persist: {
        storage: localStorage,
        paths: ['language', 'fontSize', 'useDallEGeneration', 'controlMethod', 'misTemperature', 'dalleSeed', 'dalleStyle', 'isDebug', 'showMusicButton'],
    },
    getters: {
        accessCode: () => {
            return "hkbu"
        },
        mistral: () => {
            return {
            url: "https://api.mistral.ai/v1/chat/completions",
            key: "aS8HL4oxy3D540XMePhtImFzq4s6Ijwc",
            model: 'mistral-large-latest',
            }
        }
    },

    actions: {
        setDefaultSetting() {
            this.fontSize = 0
            this.useDallEGeneration = true
            this.showMoreButton = true
            this.controlMethod = 3
            this.misTemperature = 0.6
            this.dalleSeed = 1384921747
            this.dalleStyle = "vivid"
            this.isDebug = false
            this.showMusicButton = true
        }
    }
})

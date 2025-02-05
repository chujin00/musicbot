import {defineStore} from 'pinia'
import translate from "translate";
import {tify} from 'chinese-conv';

export const useLanguageStore = defineStore('language', {
    state: () => (
        {

        }
    ),
    persist: {
        storage: localStorage,
        paths: [],
    },
    getters: {},
    actions: {
        async translateToChinese(content, language) {
            const result = await translate(content, language);
            return tify(result);
        }
    },
})
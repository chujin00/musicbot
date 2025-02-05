import {defineStore} from 'pinia'
import axios from "axios";

export const useMusicStore = defineStore('music', {
    state: () => (
        {
            isShow: false,
            isLoading: false,
            isPlaying: false,

            keywords: "",
            items: null,

            token: {
                access_token: "",
                expires_in: 0,
            },

            audioController: null,
            currentMusic: null,
        }
    ),
    persist: {
        storage: localStorage,
        paths: ['token'],
    },
    getters: {},
    actions: {
        requestToken(callback) {
            const currentDate = Date.now() / 1000 | 0
            if (currentDate > this.token.expires_in && this.isLoading !== true) {

                this.isLoading = true
                const that = this;

                axios.get(
                    '/api/spotify/token',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    .then(function (response) {
                        try {
                            that.isLoading = false;

                            const data = response.data;
                            if (data.error !== undefined) {
                                alert(data.error.message);
                                return;
                            }

                            that.token.access_token = data.access_token;
                            that.token.expires_in = currentDate + parseInt(data.expires_in);

                            callback(true);
                        } catch (e) {
                            callback(false);
                            alert(e)
                        }
                    })
                    .catch(function (error) {
                        that.isLoading = false;
                        callback(false);
                        alert(error);
                    })
            } else {
                callback(true);
            }
        },

        search(keywords, k) {

            const that = this;

            return new Promise((resolve) => {
                this.requestToken(async (isSuccess) => {
                    if (keywords !== "" && this.isLoading !== true) {

                        this.isLoading = true;

                        await axios.post(
                            '/api/spotify/search',
                            {
                                keywords: keywords,
                                k: k,
                            },
                            {
                                headers: {
                                    //'Content-Type': 'application/json',
                                    'authorization': `Bearer ${that.token.access_token}`
                                }
                            }
                        )
                            .then(function (response) {
                                try {
                                    that.isLoading = false;

                                    const data = response.data;
                                    if (data.error !== undefined) {
                                        alert(data.error.message);
                                        return;
                                    }
                                    resolve(data.items);
                                } catch (e) {
                                    alert(e)
                                    resolve(null);
                                }
                            })
                            .catch(function (error) {
                                that.isLoading = false;
                                alert(error);
                                resolve(null);
                            })
                    }
                })
            })
        },
    },
})

import {defineStore} from 'pinia'
import axios from "axios";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { encode, decode } from 'js-base64';

export const useManageStore = defineStore('manage', {
    state: () => (
        {
            password: "",
            refreshTime: 0,
            logs: [],

            googleFormUrl: "",
        }
    ),
    persist: {
        storage: localStorage,
        paths: ['password', 'refreshTime', 'logs'],
    },
    getters: {
        isValidation: (state) => {
           return encode(state.password) === "Y29tcA=="
        },
    },
    actions: {
        logRequest(content) {
            return new Promise((result) => {
                axios.post("/api/storage/log",
                    content,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                )
                    .then(async function (response) {
                        try {
                            const data = response.data;
                            if (data.error !== undefined) {
                                result({
                                    isSuccess: false,
                                    data: data.error.message
                                });
                                return;
                            }
                            result({
                                isSuccess: true,
                                data: data.data.id
                            });
                        } catch (e) {
                            result({
                                isSuccess: false,
                                data: e
                            });
                        }
                    })
                    .catch(function (e) {
                        result({
                            isSuccess: false,
                            data: e
                        });
                    })
            })
        },

        getLogFromLID(lid) {
            for (const index in this.logs) {
                const log = this.logs[index];
                if (log.id === lid) {
                    return log
                }
            }
            return undefined;
        },

        requestAllLogs() {
            return new Promise((result) => {
                axios.post("/api/storage/allLogs",
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                )
                    .then(async function (response) {
                        try {
                            const data = response.data;
                            if (data.error !== undefined) {
                                result([]);
                                alert(data.error.message);
                                return;
                            }

                            result(data.data);
                        } catch (e) {
                            result([]);
                            alert(e);
                        }
                    })
                    .catch(function (e) {
                        result([]);
                        alert(e)
                    })
            })
        },

        requestCleanByID(id) {
            return new Promise((result) => {
                axios.post("/api/storage/cleanLogByID",
                    {
                        id: id
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                )
                    .then(async function (response) {
                        try {
                            const data = response.data;
                            if (data.error !== undefined) {
                                result(data.error.message);
                                return;
                            }
                            const message = data.message;
                            result(message);
                        } catch (e) {
                            result(e);
                        }
                    })
                    .catch(function (e) {
                        result(e);
                    })
            })
        },

        requestCleanAll() {
            return new Promise((result) => {
                axios.post("/api/storage/cleanLogTable",
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                )
                    .then(async function (response) {
                        try {
                            const data = response.data;
                            if (data.error !== undefined) {
                                result(data.error.message);
                                return;
                            }
                            const message = data.message;
                            result(message);
                        } catch (e) {
                            result(e);
                        }
                    })
                    .catch(function (e) {
                        result(e);
                    })
            })
        },

        exportLogsToCSV(arrayOfObjects) {

            arrayOfObjects.map((object) => {
                object.content = JSON.stringify(object.content);
                return object;
            })

            // mkConfig merges your options with the defaults
            // and returns WithDefaults<ConfigOptions>
            const csvConfig = mkConfig({ useKeysAsHeaders: true });

            // Converts your Array<Object> to a CsvOutput string based on the configs
            const csv = generateCsv(csvConfig)(arrayOfObjects);

            download(csvConfig)(csv);
        },

        messagesConvert(content) {
            if (content !== '' && content !== undefined) {
                return decode(content)
            } else {
                return "無數據。"
            }
        },

        timeConverter(UNIX_timestamp) {
            {
                let a = new Date(UNIX_timestamp * 1000);
                let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                let year = a.getFullYear();
                let month = months[a.getMonth()];
                let date = a.getDate();
                let hour = a.getHours();
                let min = a.getMinutes();
                let sec = a.getSeconds();
                let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
                return time;
            }
        },
    },
})
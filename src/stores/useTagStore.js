import {defineStore} from 'pinia'
import axios from "axios";
import {useLanguageStore} from "@/stores/useLanguageStore.js";
import {useConfigStore} from "@/stores/useConfigStore.js";

export const useTagStore = defineStore('tag', {
    state: () => (
        {
            message: "",
            tags: [],
            systemMessagesCN: {
                role: "system",
                content: "你是圖片/故事描述增強機器人，請你根據描述內容來生成多個修改建議提示，這些提示能夠擴充/修改/優化/調整描述內容，讓它更豐富，每個提示堅決不能超過10個字。",
            },
            systemMessagesEN: {
                role: "system",
                content: "You are a picture/story description enhancement robot. Please generate multiple modification suggestions based on the description content. These tips can expand/modify/optimize/adjust the description content to make it richer. Each tip must not exceed 10 words.",
            },
            tools: [
                {
                    type: "function",
                    function: {
                        name: "show_results",
                        description: "顯示結果，Show results.",
                        parameters: {
                            type: "object",
                            properties: {
                                list: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
                                    description: "result",
                                }
                            },
                            required: ["list"]
                        },
                    }
                }
            ],
        }
    ),
    persist: {
        storage: localStorage,
        paths: ['systemMessages', 'message', 'tags'],
    },
    getters: {

    },
    actions: {
        requestTags(content) {
            return new Promise((result) => {
                const configStore = useConfigStore();

                const that = this;

                let tempSystemMessages = JSON.parse(JSON.stringify(configStore.language === 0 ? that.systemMessagesCN : that.systemMessagesEN));
                tempSystemMessages.content += "請把生成的內容使用'show_results'方法來顯示(Please use the 'show_results' function to display the generated content.)。";

                const data = {
                    model: configStore.mistral.model,
                    messages: [tempSystemMessages, {
                        role: "user",
                        content: `描述內容(Description content)：'''${content}'''`,
                    }],
                    temperature: configStore.misTemperature,
                    tools: that.tools,
                    tool_choice: "auto",
                }

                axios.post(
                    configStore.mistral.url,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + configStore.mistral.key,
                        }
                    }
                )
                    .then(async function (response) {
                        try {
                            const data = response.data;
                            if (data.error !== undefined) {
                                alert(data.error.message);
                                result([]);
                                return;
                            }
                            const message = data.choices[0].message;

                            // Remove the Markdown link
                            if (message.content !== null) {
                                message.content = message.content.replace(/\[([^\[]+)\](\(([^)]*))\)/gim, '<a href="$3" target="_blank">$1</a>');
                            }

                            let toolsNum = 0;
                            let tags = [];
                            /*
                            if (message['tool_calls'] !== undefined) {
                                if (message['tool_calls'].length > 0) {
                                    const languageStore = useLanguageStore();
                                    toolsNum = message['tool_calls'].length;
                                    const res = message['tool_calls'].map(async tool_call => {
                                        const id = tool_call.id
                                        if (tool_call.type === "function") {
                                            const function_details = tool_call.function
                                            if (function_details.name === "show_results") {
                                                tags.push(...JSON.parse(function_details['arguments'])['list'])
                                            }
                                        }
                                    })

                                    await Promise.all(res)
                                }
                            }
                             */

                            result(Array.from(new Set(tags)));
                        } catch (e) {
                            result([]);
                            alert(e)
                        }
                    })
                    .catch(function (error) {
                        result([]);
                        alert(error);
                    })
            })
        },
    },
})

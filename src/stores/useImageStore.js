import {defineStore} from 'pinia'
import axios from "axios";
import {useConfigStore} from "@/stores/useConfigStore.js";

export const useImageStore = defineStore('image', {
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
        async generationImage(messages) {

            const image_prompts = await this.requestImagePrompts(messages);

            if (image_prompts === null) {
                return null;
            }

            return await this.requestImage(image_prompts);
        },

        requestImagePrompts(messages) {

            const configStore = useConfigStore();

            let prompts = "";
            if (configStore.language === 0) {
                prompts = "請你先閱讀以下對話內容，該對話內容來自一個機器人和一位用戶，用戶會在機器人的引導下進行回憶，並在需要時向機器人提出要求生成/修改圖片。由於機器人並不能總是生成符合用戶要求的圖片，因此，用戶可能會在對話中進行反覆修改自己的需求；另一方面，隨著對話的推進，用戶也可能隨時提出或更改自己的要求，這些要求甚至是完全相反的，對話內容中展示了這個過程。請你先完整閱讀這個過程，整理用戶的要求，並根據對話內容完善/修改/刪除/更新用戶的最終要求，最後根據對話中的最後（最新）要求來生成一段圖片描述，該描述會被用來讓機器人生成圖片。對話內容：\n\n'''" + JSON.stringify(messages) + "'''\n\n 請你直接輸出圖片描述，不要加上任何其它內容。圖片描述："
            } else {
                prompts = "Please read the following dialogue first. The dialogue comes from a robot and a user. The user will recall under the guidance of the robot and ask the robot to generate/modify pictures when necessary. Since the robot cannot always generate pictures that meet the user's requirements, the user may repeatedly modify his or her requirements during the conversation; on the other hand, as the conversation progresses, the user may also make or change his or her requirements at any time. The requirements are even completely opposite, and the conversation demonstrates this process. Please read this process completely, organize the user's requirements, and improve/modify/delete/update the user's final requirements based on the conversation content. Finally, generate an image description based on the last (latest) request in the conversation, which will be used Let the robot generate images. Dialogue:\n\n'''" + JSON.stringify(messages) + "'''\n\nPlease output the picture description directly and do not add any other content. Image description:"
            }


            return new Promise((result) => {
                const configStore = useConfigStore();
                const data = {
                    model: configStore.mistral.model,
                    messages: [{
                        role: "user",
                        content: prompts,
                    }],
                    temperature: 0.5,
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
                                result(null);
                                return;
                            }
                            const message = data.choices[0].message;
                            result(message.content);
                        } catch (e) {
                            result(null);
                            alert(e)
                        }
                    })
                    .catch(function (error) {
                        result(null);
                        alert(error);
                    })
            })
        },

        requestImage(prompts) {

            const configStore = useConfigStore();

            const requestBody = {
                model: configStore.openai.dalle.model,
                prompt: prompts,
                size: "1024x1024",
                n: 1,
                quality: "standard",
                style: configStore.dalleStyle,
                // seed: configStore.dalleSeed,
            }

            const that = this;

            return new Promise((result) => {
                if (prompts !== "") {
                    if (configStore.useDallEGeneration === false) {
                        result({
                            prompt: "圖片描述",
                            url: "https://placehold.co/400",
                            created: 0,
                        });

                        return
                    }

                    axios.post(
                        configStore.openai.dalle.url,
                        requestBody,
                        {
                            headers: {
                                'Content-Type': 'application/json;charset=UTF-8',
                                'Authorization': 'Bearer ' + configStore.openai.dalle.key,
                            },
                        }
                    )
                        .then(async function (response) {
                            try {
                                const data = response.data;
                                if (data.error !== undefined) {
                                    result(null);
                                    alert(data.error.message);
                                    return;
                                }

                                const image = data.data[0]
                                let imageUrl = image.url;

                                // Upload image to catbox
                                // const catbox_result = await that.uploadImageToCatbox(imageUrl);
                                // if (catbox_result !== null) {
                                //     imageUrl = catbox_result
                                // }

                                result({
                                    prompt: image.revised_prompt,
                                    url: imageUrl,
                                    created: data.created,
                                });
                            } catch (e) {
                                alert(e)
                                result(null);
                            }
                        })
                        .catch(function (error) {
                            alert(error);
                            result(null);
                        })
                }
            })
        },

        uploadImageToCatbox(url) {

            const requestBody = {
                original_url: url
            }

            return new Promise((result) => {
                axios.post(
                    '/api/catbox/upload',
                    requestBody,
                    {
                        headers: { 'Content-Type': 'application/json', },
                    }
                )
                    .then(function (response) {
                        try {
                            const data = response.data;
                            if (data.code !== 200) {
                                alert(data.message);
                                result(null);
                                return;
                            }

                            result(data.data);
                        } catch (e) {
                            alert(e)
                            result(null);
                        }
                    })
                    .catch(function (error) {
                        alert(error);
                        result(null);
                    })
            })
        }
    },
})

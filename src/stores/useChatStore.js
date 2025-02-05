import {defineStore} from 'pinia'
import axios from "axios";
import {useConfigStore} from "@/stores/useConfigStore.js";
import {useImageStore} from "@/stores/useImageStore.js";
import {useLanguageStore} from "@/stores/useLanguageStore.js";
import { v4 as uuidv4 } from 'uuid';
import {nextTick} from "vue";

export const useChatStore = defineStore('chat', {
    state: () => (
        {
            tools: [
                {
                    type: "function",
                    function: {
                        name: "create_or_modify_image_by_prompt",
                        description: "Images/photos can be generated / modified based on prompts. 可以根據Prompts來生成或修改圖片/照片。",
                        parameters: {
                            type: "object",
                            properties: {
                                prompts: {
                                    type: "string",
                                    description: "The prompts for generating / modifying images.",
                                }
                            },
                            required: ["prompts"]
                        },
                    }
                }
            ],

            currentUsername: "",
            messages: [],

            isShowMoreFunctionsModal: false,
            moreFunctionsModalIndex: null,
            moreFunctionsContent: '',
        }
    ),
    persist: {
        storage: localStorage,
        paths: ['currentUsername', 'messages'],
    },
    getters: {
        systemMessagesCN() {
            return [
                {
                    role: "system",
                    content: "你是一個音乐治疗的「粤语」聊天機器人" + (this.canGenerationImage ? "，也可以在用戶提出要求生成或修改圖片的要求時幫助用戶生成圖片或修改已經生成的圖片" : "") + "。请引导用户聆听歌曲，并基于歌曲分享自己的回忆。請你嚴格遵循以下步驟來進行對話，每次只进行其中一步，待用户回复后再发出下一步，可以适当增加一些过渡句使聊天更连贯：第一步：请发出这句话「我哋今日嘅課題係認識自我：優點與成就。你覺得你對自己嘅認識有幾深呀？不如我哋一齊聽下呢一首歌，响聽歌嘅時候，睇下有冇啲歌詞觸動到你，有冇想一啲值得你自豪嘅事可以同我分享。」   第二步：请发出这个链接「https://www.youtube.com/watch?v=kKWA3aOjsXg 」 第三步：请等待十秒后发出「呢首歌曲有冇邊幾句歌詞特別牽動到你嘅情緒？有冇令你想起一啲你覺得好重要、好自豪、又或者令你付出咗好多努力嘅事情可以同我分享。」 第四步：基于用户的回答，作出情緒支援，表示了解對方，給予同理的回應。可繼續討論在用户情緒背後的內心世界，包括價值觀、性格特徵…之類。最後引領用户講出在過去他曾付出的努力和貢獻。第五步：繼續引領C在那自豪事件中了解自己的價值觀、性格特徵、強項…之類。    第六步：肯定用户所付出的努力，加以讚許，並作出同理的情緒回應，了解Ｃ的辛勞。將用户所說的事，換個說法，使他變為Ｃ的成就。過程中，了解Ｃ的內心世界，使他明白自己的價值觀、性格特徵、強項…之類。第七步：请发出下面这段话「多謝你嘅分享，我對妳好敬佩，你都要多啲多謝自己付出嘅努力，欣賞自己嘅貢獻和成就，一切都唔容易㗎！不如我哋再回顧一下自己嘅人生旅程，望下有邊幾個時刻對你最重要，係細個成長嘅時候呀？大咗拍拖嘅時？結婚生仔之後？定係工作方面呢？點解呢啲時刻係最難忘或者係人生嘅轉捩點呢？響嗰啲時候，你付出咗啲乜嘢，又成就咗啲乜嘢？」 第八步：用正面和鼓勵的方法重複Ｃ講的故事，再在那些片段中進行分析，使Ｃ更明白和認同自己的價值觀和強項，對自己的成就與貢獻感到驕傲。第九步：不如你而家點一首可以代表到你自己嘅歌曲畀自己聽，獎勵一下自己嘅付出和成就。第十步：我越聽你講就越覺得你多年來做咗好多貢獻，付出好多嘅努力，其實你有冇試過好好的多謝你自己，同自己講聲辛苦曬啦? 第十一步：中國人好得意㗎，我哋通常都比較謙虛，好少會稱讚自己，反而經批判自己，覺得自己多有不足。其實我哋應該學下多啲關心自己、多謝自己、肯定自己和讚美自己。其實都係好簡單，只要每日用少少時間，諗一諗你嗰日做咗啲乜嘢，對於做得好嘅事，對自己講一聲: 「你今日做得好好呀，多謝你!我哋聽日再努力啦。」咁就得㗎喇。久而久之，呢一個就會變成一個習慣。不如你跟我對自己講一次: 你做得好好，多謝你!第十二步：今日嘅單元即將結束喇，希望今日可以令你更了解自己的長處，好好利用，令生活更添姿采。另外，記得多啲做靜觀練習同埋多啲欣賞自己。祝你有美好嘅生活，拜拜！ 現在請你開始對話。",
                }
            ]
        },
        systemMessagesEN() {
            return [
                {
                    role: "system",
                    content: "You are a \"English\" chat robot that helps users recall" + (this.canGenerationImage ? ", and you can also help users generate pictures/photos or modify generated pictures/photos when user requests to generate or modify pictures" : "") + ". The user will start chatting with you after listening to the song, and you will help the user recall what happened in the past through conversation. Please strictly follow the following steps to conduct a conversation: Step 1: Ask the user the name of the song they just listened to; Step 2: Ask the user what they remembered; Step 3: Ask the user based on what they remembered to help fully understand what they remembered. thing; Step 4: Repeat step 3 until the whole thing becomes clear. Please start the conversation now.",
                }
            ]
        },

        display_messages() {
            return this.messages.filter((message) => {
                if (message.role === "user") {
                    return true
                } else if (message.role === "assistant") {
                    return message.content !== null;
                } else if (message.role === "tool") {
                    return true;
                }

                return false
            });
        },

        canGenerationImage() {
            const configStore = useConfigStore();

            if (configStore.controlMethod === 4) {
                return false
            }

            let hasImage = false;

            for (const message of this.messages) {
                if (message.role === "tool") {
                    hasImage = true;
                    break;
                }
            }

            if (configStore.controlMethod === 0 || configStore.controlMethod === 1) {
                if (hasImage) {
                    return false
                }
            }

            return true
        }
    },
    actions: {
        addSendMessage(content, hasTempGenerationImageFunc) {
            this.messages.push({
                role: "user",
                content: content,
                create_time: this.generateUnixTime()
            })

            this.requestMessage(hasTempGenerationImageFunc);
        },

        addReceiveMessage(content) {
            content.create_time = this.generateUnixTime()
            this.messages.push(content)
        },
        /*
        async addImageMessage(result) {
            const configStore = useConfigStore();
            const tool_call_id = uuidv4();

            const languageStore = useLanguageStore();
            const tempPrompt = configStore.language === 0 ? await languageStore.translateToChinese(result.prompt, 'zh') : result.prompt;

            const message = this.generationFunctionMessage(tool_call_id, 'tool', 'create_or_modify_image_by_prompt', `{"code":"200", "message":"${this.generationHybridContentMessage()}", "type":"tag-based-image", "prompts":"${tempPrompt}", "suggestions": [], "link":"${result.url}", "style": "${configStore.dalleStyle}"}`)

            this.addReceiveMessage({
                role: "assistant",
                content: null,
                tool_calls: [
                    {
                        id: tool_call_id,
                        type: "function",
                        function: {
                            name: "create_or_modify_image_by_prompt",
                            arguments: "",
                        }
                    }
                ],
            });
            this.addReceiveMessage(message);
        },
        */

        generationHybridContentMessage() {
            const configStore = useConfigStore();
            let content_message = ""
            if (configStore.controlMethod === 3) {
                content_message = configStore.language === 0 ? "這是我生成的圖片，如果它跟你腦中回憶到的畫面不符，請告訴我它該是什麼樣的？另外可以點擊圖片下按鈕切換圖片風格。": "This is the image I generated, if it doesn't match the image you recall in your mind, please tell me what it should look like? In addition, you can click the button under the picture to switch the picture style."
            }

            return content_message
        },

        generationFunctionMessage(tool_call_id, role, name, content) {
            return {
                tool_call_id: tool_call_id,
                role: role,
                name: name,
                content: content,
            }
        },

        regenerationMessage(index) {
            this.messages = this.messages.slice(0, index + 1);
            this.requestMessage(true);
        },

        modifiedMessageContent(index, content) {
            this.messages[index].content = content;
        },

        requestMessage(hasTempGenerationImageFunc) {
            const configStore = useConfigStore();

            if (configStore.isLoading === true) {
                return
            }

            configStore.isLoading = true

            const that = this;

            let tempMessages = JSON.parse(JSON.stringify([...(configStore.language === 0 ? that.systemMessagesCN : that.systemMessagesEN), ...that.messages]));
            tempMessages.map((message) => {
                delete message.create_time;
                return message;
            })

            let data = {}
            if (that.canGenerationImage || hasTempGenerationImageFunc) {
                data = {
                    model: configStore.mistral.model,
                    messages: tempMessages,
                    temperature: configStore.misTemperature,
                    tools: that.tools,
                    tool_choice: "auto",
                }
            } else {
                data = {
                    model: configStore.mistral.model,
                    messages: tempMessages,
                    temperature: configStore.misTemperature,
                }
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
                            configStore.isLoading = false;
                            alert(data.error.message);
                            return;
                        }
                        const message = data.choices[0].message;

                        // Remove the Markdown link
                        if (message.content !== null) {
                            message.content = message.content.replace(/\[([^\[]+)\](\(([^)]*))\)/gim, '<a href="$3" target="_blank">$1</a>');
                        }

                        let toolsNum = 0;
                        let tempToolsMessages = [];
                        /*
                        if (message['tool_calls'] !== undefined) {
                            if (message['tool_calls'].length > 0) {
                                const languageStore = useLanguageStore();
                                toolsNum = message['tool_calls'].length;
                                const res = message['tool_calls'].map(async tool_call => {
                                    const id = tool_call.id
                                    if (tool_call.type === "function") {
                                        const function_details = tool_call.function
                                        if (function_details.name === "create_or_modify_image_by_prompt") {

                                            // const prompts = JSON.parse(function_details['arguments'])['prompts']

                                            const imageStore = useImageStore();
                                            const prompts = await imageStore.requestImagePrompts(that.messages);

                                            await imageStore.requestImage(prompts)
                                                .then(async (data) => {
                                                    if (data !== null) {
                                                        const tempPrompt = configStore.language === 0 ? await languageStore.translateToChinese(data.prompt, 'zh') : data.prompt;

                                                        // const tagStore = useTagStore();
                                                        const suggestions = [] //await tagStore.requestTags(tempPrompt);
                                                        const tempMessage = that.generationFunctionMessage(id, "tool", function_details.name, `{"code":"200", "message":"${that.generationHybridContentMessage()}", "type":"tag-based-image", "prompts":"${tempPrompt}", "suggestions":${JSON.stringify(suggestions)}, "link":"${data.url}", "style": "${configStore.dalleStyle}"}`)
                                                        tempToolsMessages.push(tempMessage)
                                                    }
                                                })
                                        }
                                    }
                                })

                                await Promise.all(res)
                            }
                        }
                        */
                        configStore.isLoading = false

                        if (toolsNum > 0 && tempToolsMessages.length === toolsNum) {
                            that.addReceiveMessage(message);
                            for (const toolMessage of tempToolsMessages) {
                                that.addReceiveMessage(toolMessage);
                            }
                            // that.requestMessage(false)
                        } else {
                            that.addReceiveMessage(message);
                        }

                    } catch (e) {
                        alert(e)
                    }
                })
                .catch(function (error) {
                    configStore.isLoading = false;
                    alert(error);
                })
        },

        contentToFrom(message) {
            return JSON.parse(message.content.replaceAll("\n"," ").replaceAll("\r"," "));
        },

        generateUnixTime() {
            return Date.now() /1000 | 0;
        },

        cleanAll() {
            this.messages = [];
            this.currentUsername = "";
        },

        showMoreFunctionsModal(index) {
            this.isShowMoreFunctionsModal = true;
            this.moreFunctionsModalIndex = index;
            this.moreFunctionsContent = this.messages[index].content
        },

        hideMoreFunctionsModal() {
            this.isShowMoreFunctionsModal = false;
            this.moreFunctionsModalIndex = null;
            this.moreFunctionsContent = ''
        }

    },
})

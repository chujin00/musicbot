import { createRouter, createWebHistory } from 'vue-router'
import ChatView from "@/components/chat/ChatView.vue";
import TagTestView from "@/components/tag/TagTestView.vue";
import ManageView from "@/components/manage/ManageView.vue";
import ManageConversationDetailView from "@/components/manage/ManageConversationDetailView.vue";
import EndView from "@/components/end/EndView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ChatView
    },
    {
      path: '/end',
      name: 'end',
      component: EndView
    },
    {
      path: '/tag',
      name: 'tag',
      component: TagTestView
    },
    {
      path: '/manage',
      name: 'manage',
      component: ManageView
    },
    {
      path: '/manage/chat/:id',
      name: 'manage_conversation_details',
      component: ManageConversationDetailView
    }
  ]
})

export default router

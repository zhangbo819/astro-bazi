<template>
  <div class="chat-page">
    <div class="chat-window">
      <div
        v-for="(message, index) in chat.messages"
        :key="message.id ?? index"
        class="message-wrapper"
        :class="message.role"
      >
        <div class="message">
          <div class="role">
            {{ message.role === 'user' ? '👤 你' : '🤖 AI' }}
          </div>

          <div v-for="(part, idx) in message.parts" :key="`${message.id}-${idx}`">
            <div v-if="part.type === 'text'" class="content">
              {{ part.text }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <form class="input-area" @submit="handleSubmit">
      <input v-model="input" placeholder="输入你的问题..." autocomplete="off" />

      <button type="submit" :disabled="chat.status !== 'ready'">发送</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Chat } from '@ai-sdk/vue';
import { DefaultChatTransport } from 'ai';
import { ref } from 'vue';

const input = ref('');

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
});

async function handleSubmit(e: Event) {
  e.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  await chat.sendMessage({
    text,
  });

  input.value = '';
}
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 900px;
  margin: 0 auto;
  background: #f7f7f8;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.message-wrapper {
  display: flex;
  margin-bottom: 20px;
}

.message-wrapper.user {
  justify-content: flex-end;
}

.message-wrapper.assistant {
  justify-content: flex-start;
}

.message {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 16px;
  word-break: break-word;
}

.user .message {
  background: #2563eb;
  color: white;
}

.assistant .message {
  background: white;
  border: 1px solid #e5e7eb;
}

.role {
  font-size: 12px;
  margin-bottom: 6px;
  opacity: 0.7;
}

.content {
  line-height: 1.6;
  white-space: pre-wrap;
}

.input-area {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.input-area input {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 12px 16px;
  outline: none;
  font-size: 14px;
}

.input-area input:focus {
  border-color: #2563eb;
}

.input-area button {
  border: none;
  border-radius: 12px;
  padding: 0 20px;
  cursor: pointer;
  background: #2563eb;
  color: white;
  font-weight: 600;
}

.input-area button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

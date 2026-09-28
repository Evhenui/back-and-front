<template>
  <p v-if="checking">Завантаження...</p>

  <template v-else-if="token">
    <HelloWorld @unauthorized="logout" />
    <button @click="logout">Вийти</button>
  </template>

  <AuthForm 
    v-else
    @success="onAuthSuccess"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from './api';
import HelloWorld from './components/HelloWorld.vue'
import AuthForm from './components/AuthForm.vue';

const token = ref(localStorage.getItem('token'));
const user = ref(null);
const checking = ref(!!token.value); 

const logout = () => {
  localStorage.removeItem('token');
  token.value = null;
  user.value = null;
};

const checkAuth = async () => {
  if (!token.value) return;
  try {
    const res = await api.get('/auth/me');
    user.value = res.data;
  } catch (err) {
    if (err.response?.status === 401) logout();
  } finally {
    checking.value = false;
  }
};

const onAuthSuccess = async ({ mode, data }) => {
  if (mode === 'login') {
    localStorage.setItem('token', data.token);
    token.value = data.token;
    await checkAuth();
  }
};

onMounted(checkAuth);
</script>

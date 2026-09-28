<template>
  <div>
    <h2>{{ isLogin ? 'Вхід' : 'Реєстрація' }}</h2>

    <form @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <button type="submit" :disabled="loading">
        {{ loading ? '...' : isLogin ? 'Увійти' : 'Зареєструватись' }}
      </button>
    </form>

    <p v-if="infoMessage" style="color: green">{{ infoMessage }}</p>
    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>

    <button type="button" @click="toggleMode">
      {{ isLogin ? 'Немає акаунта? Зареєструватись' : 'Вже є акаунт? Увійти' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const emit = defineEmits(['success']);

const API_URL = 'http://localhost:3000/api/auth';

const mode = ref('login'); 
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const infoMessage = ref('');

const isLogin = computed(() => mode.value === 'login');

const toggleMode = () => {
  mode.value = isLogin.value ? 'register' : 'login';
  errorMessage.value = '';
  infoMessage.value = '';
};

const submit = async () => {
  errorMessage.value = '';
  infoMessage.value = '';
  loading.value = true;

  try {
    const res = await axios.post(`${API_URL}/${mode.value}`, {
      email: email.value,
      password: password.value,
    });

    emit('success', { mode: mode.value, data: res.data });

    if (!isLogin.value) {
      // після реєстрації токена ще немає, тож пропонуємо залогінитись
      mode.value = 'login';
      password.value = '';
      infoMessage.value = 'Реєстрація успішна, тепер увійди';
    }
  } catch (err) {
    const data = err.response?.data;
    const message = data?.details?.length
      ? data.details.map((d) => `${d.field}: ${d.message}`).join(', ')
      : data?.error || 'Щось пішло не так';

    errorMessage.value = message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">

</style>



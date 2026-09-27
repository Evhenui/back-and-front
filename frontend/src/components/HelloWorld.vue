<template>
  <div>
    <h1>Нотатки</h1>

    <form @submit.prevent="addNote">
      <input v-model="title" placeholder="Заголовок" />
      <input v-model="content" placeholder="Текст нотатки" />
      <button type="submit">Додати</button>
    </form>

    <button @click="fetchNotes">Click me</button>

    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>

    <ul>
      <li v-for="note in notes" :key="note.id">
        <strong>{{ note.title }}</strong> — {{ note.content }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/notes';

const notes = ref([]);
const title = ref('');
const content = ref('');
const errorMessage = ref('');

const fetchNotes = async () => {
  try {
    const res = await axios.get(API_URL);
    notes.value = res.data;
    console.log('asdasd');
  } catch (err) {
    errorMessage.value = 'Не вдалось завантажити нотатки';
    console.error(err);
  }
};

const addNote = async () => {
  errorMessage.value = '';

  try {
    const res = await axios.post(API_URL, {
      title: title.value,
      content: content.value,
    });

    notes.value.push(res.data);
    title.value = '';
    content.value = '';
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Помилка створення нотатки';
  }
};

onMounted(fetchNotes);
</script>

<style scoped lang="scss">

</style>



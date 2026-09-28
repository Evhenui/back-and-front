<template>
  <div>
    <h1>Нотатки</h1>

    <form @submit.prevent="addNote">
      <input v-model="title" placeholder="Заголовок" />
      <input v-model="content" placeholder="Текст нотатки" />
      <button type="submit">Додати</button>
    </form>

    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>

    <ul>
      <li v-for="note in notes" :key="note.id">
        <strong>{{ note.title }}</strong> — {{ note.content }}
        <button @click="deleteNote(note.id)">Видалити</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../api';

const emit = defineEmits(['unauthorized']);

const notes = ref([]);
const title = ref('');
const content = ref('');
const errorMessage = ref('');

const handleError = (err, fallback) => {
  if (err.response?.status === 401) {
    emit('unauthorized');
    return;
  }
  errorMessage.value = err.response?.data?.error || fallback;
};

const fetchNotes = async () => {
  try {
    const res = await api.get('/notes');
    notes.value = res.data;
  } catch (err) {
    handleError(err, 'Не вдалось завантажити нотатки');
  }
};

const addNote = async () => {
  errorMessage.value = '';
  try {
    const res = await api.post('/notes', {
      title: title.value,
      content: content.value,
    });
    notes.value.unshift(res.data);
    title.value = '';
    content.value = '';
  } catch (err) {
    handleError(err, 'Помилка створення нотатки');
  }
};

const deleteNote = async (id) => {
  errorMessage.value = '';
  try {
    await api.delete(`/notes/${id}`);
    notes.value = notes.value.filter((n) => n.id !== id);
  } catch (err) {
    handleError(err, 'Помилка видалення нотатки');
  }
};

onMounted(fetchNotes);
</script>
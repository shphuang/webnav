<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>添加新分类</h2>
      <input
        type="text"
        v-model="categoryName"
        placeholder="输入分类名称"
        @keyup.enter="save"
      >
      <button @click="save">保存</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'save'])
const categoryName = ref('')

const save = () => {
  const name = categoryName.value.trim()
  if (name) {
    emit('save', name)
    categoryName.value = ''
  } else {
    alert('分类名称不能为空')
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close {
  position: absolute;
  right: 20px;
  top: 10px;
  font-size: 24px;
  cursor: pointer;
}

h2 {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: rgba(66, 133, 244, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: rgba(66, 133, 244, 0.9);
}
</style>
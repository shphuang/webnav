<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>{{ mode === 'add' ? '添加新网址' : '编辑网站' }}</h2>
      <input
        type="text"
        v-model="siteData.name"
        placeholder="网站名称"
      >
      <input
        type="text"
        v-model="siteData.url"
        placeholder="网站URL (以http://或https://开头)"
      >
      <input
        type="text"
        v-model="siteData.description"
        placeholder="网站描述 (可选)"
      >
      <button @click="save">{{ mode === 'add' ? '保存' : '更新' }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'add'
  },
  site: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['close', 'save'])

const siteData = ref({
  name: '',
  url: '',
  description: ''
})

onMounted(() => {
  if (props.mode === 'edit' && props.site) {
    siteData.value = { ...props.site }
  }
})

const save = () => {
  const { name, url } = siteData.value
  if (!name || !url) {
    alert('网站名称和URL不能为空')
    return
  }

  // if (!url.startsWith('http://') && !url.startsWith('https://')) {
  //   alert('URL必须以http://或https://开头')
  //   return
  // }

  emit('save', siteData.value)
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

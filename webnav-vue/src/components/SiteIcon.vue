<template>
  <div class="site-icon">
    <el-skeleton style="width: 100%;height: 100%" :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="image" style="width: 100%;height: 100%"/>
      </template>
      <template #default>
        <img :src="computedIconUrl" :alt="`${name} icon`">
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {AppApi} from '@/api/index'

const DEFAULT_ICON_URL = '/favicon.svg'
const loading = ref(true)
const iconUrl = ref(DEFAULT_ICON_URL)
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

// // 缓存过期时间（毫秒）
const CACHE_EXPIRATION = 30 * 24 * 60 * 60 * 1000

// 从本地存储获取缓存的图标URL
const getCachedIconUrl = (url) => {
  const cached = localStorage.getItem(`icon_${url}`)
  if (cached) {
    const {value, timestamp} = JSON.parse(cached)
    if (Date.now() - timestamp < CACHE_EXPIRATION) {
      return value
    }
    // 清理过期缓存
    localStorage.removeItem(`icon_${url}`)
  }
  return null
}

// 将图标URL存入本地缓存
const cacheIconUrl = (url, value) => {
  if (DEFAULT_ICON_URL === value) return
  localStorage.setItem(`icon_${url}`, JSON.stringify({
    value,
    timestamp: Date.now()
  }))
}

const computedIconUrl = computed(() => iconUrl.value)

onMounted(async () => {
  try {
    // 先尝试从缓存获取
    const cached = getCachedIconUrl(props.url)
    if (cached) {
      iconUrl.value = cached
      loading.value = false
      return
    }

    // 缓存未命中，从服务器获取
    const newIconUrl = await AppApi.getIconUrl(props.url)
    if (newIconUrl) {
      iconUrl.value = newIconUrl
      // 存入缓存
      cacheIconUrl(props.url, newIconUrl)
    }
  } catch (error) {
    console.error('Error loading icon:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.site-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.site-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
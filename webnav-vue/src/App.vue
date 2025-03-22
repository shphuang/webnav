<template>
  <div class="container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <div class="mobile-sidebar-toggle" @click="toggleSidebar">
      <el-icon>
        <Fold v-if="!isSidebarCollapsed" />
        <Expand v-else />
      </el-icon>
    </div>
    <!-- 左侧分类栏 -->
    <div class="sidebar">
      <div class="logo">
        <h2>网站导航</h2>
      </div>
      <div class="category-list">
        <div v-for="category in store.categories" :key="category.id" class="category-item"
          :class="{ active: category.id === store.currentCategoryId }" @click="selectCategory(category.id)">
          <span>{{ category.name }}</span>
          <!-- <i class="fas fa-trash delete-category" @click.stop="deleteCategory(category.id)"></i> -->
          <el-icon class="icon" @click.stop="deleteCategory(category.id)">
            <Delete />
          </el-icon>
        </div>
      </div>
      <div class="add-category">
        <button @click="showAddCategoryModal"><i class="fas fa-plus"></i> 添加分类</button>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="main-content">
      <!-- 顶部搜索区域 -->
      <div class="search-area">
        <div class="search-container">
          <div class="search-engine-selector" @click="toggleDropdown">
            <span style="margin-right: 10px;">{{ store.currentEngine }}</span>
            <el-icon>
              <CaretBottom />
            </el-icon>
            <div class="dropdown-content" :class="{ show: store.isDropdownVisible }">
              <a v-for="(url, engine) in searchEngines" :key="engine" href="#" @click.prevent="selectEngine(engine)">
                {{ engineNames[engine] }}
              </a>
            </div>
          </div>
          <input type="text" v-model="searchQuery" @keyup.enter="search" placeholder="输入搜索关键词...">
          <button @click="search">
            <el-icon style="vertical-align: middle;font-size: 20px;">
              <Search />
            </el-icon>
          </button>
        </div>
      </div>

      <!-- 内容展示区域 -->
      <div class="content-area">
        <div class="category-content">
          <div v-for="site in store.currentSites" :key="site.id" class="site-card" draggable="true"
            @dragstart="dragStart($event, site)" @dragend="dragEnd" @dragover.prevent @drop="drop($event, site)"
            @dblclick="openSite(site)">
            <SiteIcon :url="site.url" :name="site.name" />
            <div class="site-info">
              <h3>{{ site.name }}</h3>
              <p>{{ site.description || '暂无描述' }}</p>
            </div>
            <div class="site-actions">
              <el-icon style="font-size: 20px" @click="showEditSiteModal(site)" title="编辑">
                <Edit />
              </el-icon>
              <el-icon style="font-size: 20px" @click="deleteSite(site.id)" title="删除">
                <Delete />
              </el-icon>
            </div>
          </div>
        </div>
        <button class="add-site-btn" @click="showAddSiteModal">
          <el-icon>
            <Plus />
          </el-icon>
        </button>
      </div>
    </div>
  </div>

  <!-- 模态框组件 -->
  <CategoryModal v-if="store.isCategoryModalVisible" @close="hideCategoryModal" @save="addCategory" />
  <SiteModal v-if="store.isSiteModalVisible" :mode="store.siteModalMode" :site="store.editingSite"
    @close="hideSiteModal" @save="saveSite" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CategoryModal from '@/components/CategoryModal.vue'
import SiteModal from '@/components/SiteModal.vue'
import { useMainStore } from '@/stores'
import SiteIcon from "@/components/SiteIcon.vue";

const isSidebarCollapsed = ref(window.innerWidth <= 768)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    isSidebarCollapsed.value = false
  } else if (window.innerWidth <= 768 && !isSidebarCollapsed.value) {
    isSidebarCollapsed.value = true
  }
})

const store = useMainStore()
const searchQuery = ref('')

onMounted(async () => {
  await store.loadData()
})

// 搜索引擎配置
const searchEngines = {
  bing: 'https://www.bing.com/search?q=',
  google: 'https://www.google.com/search?q=',
  baidu: 'https://www.baidu.com/s?wd='
}

const engineNames = {
  bing: 'Bing',
  google: 'Google',
  baidu: '百度'
}

// 方法
const selectCategory = (id) => {
  store.currentCategoryId = id
}

const toggleDropdown = () => {
  store.isDropdownVisible = !store.isDropdownVisible
}

const selectEngine = (engine) => {
  store.currentEngine = engineNames[engine]
  store.isDropdownVisible = false
}

const search = () => {
  if (searchQuery.value.trim()) {
    const engine = Object.keys(engineNames).find(
      key => engineNames[key] === store.currentEngine
    )
    const searchUrl = searchEngines[engine] + encodeURIComponent(searchQuery.value)
    window.open(searchUrl, '_blank')
  }
}

const showAddCategoryModal = () => {
  store.isCategoryModalVisible = true
}

const hideCategoryModal = () => {
  store.isCategoryModalVisible = false
}

const showAddSiteModal = () => {
  store.siteModalMode = 'add'
  store.editingSite = null
  store.isSiteModalVisible = true
}

const showEditSiteModal = (site) => {
  store.siteModalMode = 'edit'
  store.editingSite = { ...site }
  store.isSiteModalVisible = true
}

const hideSiteModal = () => {
  store.isSiteModalVisible = false
  store.editingSite = null
}

const addCategory = async (name) => {
  try {
    await store.addCategory(name)
    hideCategoryModal()
  } catch (error) {
    showError('添加分类失败，请稍后重试')
    console.error('添加分类失败:', error)
  }
}

const deleteCategory = async (id) => {
  if (confirm('确定要删除这个分类吗？相关网站也会被删除。')) {
    try {
      await store.deleteCategory(id)
    } catch (error) {
      showError('删除分类失败，请稍后重试')
      console.error('删除分类失败:', error)
    }
  }
}

const saveSite = async (siteData) => {
  try {
    await store.saveSite(siteData)
    hideSiteModal()
  } catch (error) {
    showError(store.siteModalMode === 'edit' ? '更新网站失败，请稍后重试' : '添加网站失败，请稍后重试')
    console.error('保存网站失败:', error)
  }
}

const deleteSite = async (id) => {
  if (confirm('确定要删除这个网站吗？')) {
    try {
      await store.deleteSite(id)
    } catch (error) {
      showError('删除网站失败，请稍后重试')
      console.error('删除网站失败:', error)
    }
  }
}

const updateSiteOrder = async (orderSite) => {
  try {
    await store.updateSiteOrder(orderSite)
  } catch (error) {
    showError('更新网站顺序失败，请稍后重试')
    console.error('更新网站顺序失败:', error)
  }
}

// 点击页面其他地方关闭下拉菜单
window.addEventListener('click', (e) => {
  if (!e.target.closest('.search-engine-selector')) {
    store.isDropdownVisible = false
  }
})

const openSite = (site) => {
  try {
    let url = site.url.trim()
    if (!url) {
      throw new Error('网站URL不能为空')
    }

    // 如果URL不包含协议前缀，添加https://
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }

    // 验证URL格式
    try {
      new URL(url)
    } catch {
      throw new Error('无效的URL格式')
    }

    // 在新标签页中打开网站
    window.open(url, '_blank')
  } catch (error) {
    alert(error.message || '打开网站失败，请检查URL是否正确')
    console.error('打开网站失败:', error)
  }
}

const draggedSite = ref(null)
const draggedIndex = ref(-1)

const dragStart = (event, site) => {
  draggedSite.value = site
  draggedIndex.value = store.currentSites.findIndex(s => s.id === site.id)
  event.dataTransfer.effectAllowed = 'move'
}

const dragEnd = () => {
  draggedSite.value = null
  draggedIndex.value = -1
}

const drop = async (event, targetSite) => {
  event.preventDefault()
  if (!draggedSite.value || draggedSite.value.id === targetSite.id) return

  const targetIndex = store.currentSites.findIndex(s => s.id === targetSite.id)
  const currentIndex = draggedIndex.value
  try {

    await updateSiteOrder({
      ...draggedSite.value,
      order: targetIndex
    })
    // 更新本地数据
    const currentSites = [...store.currentSites]
    const movedSite = currentSites.splice(currentIndex, 1)[0]
    currentSites.splice(targetIndex, 0, movedSite)

    // 更新所有网站的顺序
    const sitesToUpdate = currentSites.map((site, index) => ({
      ...site,
      order: index
    }))

    // 更新store中的状态
    store.sites = store.sites.map(site => {
      const updatedSite = sitesToUpdate.find(s => s.id === site.id)
      return updatedSite || site
    })
  } catch (error) {
    console.error('拖拽排序失败:', error)
  }
}
</script>

<style>
@import '@/assets/styles.css';

/* 响应式布局样式 */
.mobile-sidebar-toggle {
  display: none;
  position: fixed;
  z-index: 1000;
  background-color: rgba(33, 33, 33, 0.9);
  color: white;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .container {
    position: relative;
  }

  .mobile-sidebar-toggle {
    display: block;
    z-index: 1201;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1200;
    transform: translateX(0);
    transition: transform 0.3s ease;
  }

  .sidebar-collapsed .sidebar {
    transform: translateX(-100%);
  }

  .main-content {
    width: 100% !important;
    margin-left: 0 !important;
    padding: 10px;
  }

  .search-container {
    flex-direction: row;
    border-radius: 15px;
  }

  .search-engine-selector {
    width: auto;
    min-width: 100px;
    border-radius: 15px 0 0 15px;
    border-right: 1px solid #eee;
    border-bottom: none;
    padding: 0 15px;
  }

  .search-container input {
    width: 190px;
    flex: 1;
    padding: 12px 15px;
    border-radius: 0;
  }

  .search-container button {
    width: auto;
    padding: 12px 15px;
    border-radius: 0 15px 15px 0;
  }

  .category-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    row-gap: 15px;
    padding: 0;
  }

  .site-card {
    margin: 0;
  }

  .site-actions {
    opacity: 1;
  }

  .add-site-btn {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
  }
}
</style>

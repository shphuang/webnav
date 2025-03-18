import { defineStore } from "pinia";
import { categoryApi, siteApi } from "@/api/index.js";

export const useMainStore = defineStore("main", {
  state: () => ({
    categories: [{ id: 1, name: "常用推荐" }],
    sites: [],
    currentCategoryId: 1,
    currentEngine: "Bing",
    searchQuery: "",
    isDropdownVisible: false,
    isCategoryModalVisible: false,
    isSiteModalVisible: false,
    siteModalMode: "add",
    editingSite: null,
  }),

  getters: {
    currentSites: (state) => {
      return state.sites
        .filter((site) => site.categoryId === state.currentCategoryId)
        .sort((a, b) => a.order - b.order);
    },
  },

  actions: {
    async loadData() {
      try {
        const [categoriesData, sitesData] = await Promise.all([
          categoryApi.getCategories(),
          siteApi.getAllSites(),
        ]);
        this.categories = categoriesData;
        this.sites = sitesData || [];
      } catch (error) {
        console.error("加载数据失败:", error);
        throw error;
      }
    },

    async addCategory(name) {
      try {
        const newCategory = await categoryApi.addCategory(name);
        this.categories.push(newCategory);
      } catch (error) {
        console.error("添加分类失败:", error);
        throw error;
      }
    },

    async deleteCategory(id) {
      try {
        await categoryApi.deleteCategory(id);
        this.categories = this.categories.filter(
          (category) => category.id !== id
        );
        this.sites = this.sites.filter((site) => site.categoryId !== id);
        if (this.currentCategoryId === id) {
          this.currentCategoryId = this.categories[0]?.id || null;
        }
      } catch (error) {
        console.error("删除分类失败:", error);
        throw error;
      }
    },

    async saveSite(siteData) {
      try {
        if (this.siteModalMode === "edit") {
          const updatedSite = await siteApi.updateSite(siteData.id, siteData);
          const index = this.sites.findIndex((site) => site.id === siteData.id);
          if (index !== -1) {
            this.sites[index] = updatedSite;
          }
        } else {
          const newSite = await siteApi.createSite({
            ...siteData,
            categoryId: this.currentCategoryId,
            order: this.currentSites.length,
          });
          this.sites.push(newSite);
        }
      } catch (error) {
        console.error("保存网站失败:", error);
        throw error;
      }
    },

    async deleteSite(id) {
      try {
        await siteApi.deleteSite(id);
        this.sites = this.sites.filter((site) => site.id !== id);
      } catch (error) {
        console.error("删除网站失败:", error);
        throw error;
      }
    },

    async updateSiteOrder(orderSite) {
      try {
        await siteApi.updateSiteOrder(orderSite);
      } catch (error) {
        console.error("更新网站顺序失败:", error);
        throw error;
      }
    },
    // 缓存state
    saveStateToLocalStorage() {
      localStorage.setItem('categories', JSON.stringify(this.categories));
      localStorage.setItem('sites', JSON.stringify(this.sites));
    },

    loadStateFromLocalStorage() {
      const savedCategories = localStorage.getItem('categories');
      const savedSites = localStorage.getItem('sites');
      if (savedCategories) {
        this.categories = JSON.parse(savedCategories);
      }
      if (savedSites) {
        this.sites = JSON.parse(savedSites);
      }
    },
  },

  // 在状态变化时自动保存
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'webnav-store',
        storage: localStorage,
        paths: ['currentEngine','categories', 'sites']
      }
    ]
  }
});

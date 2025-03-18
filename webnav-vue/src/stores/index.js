import {defineStore} from "pinia";
import {categoryApi, siteApi, userApi} from "@/api/index.js";

export const useMainStore = defineStore("main", {
    state: () => ({
        categories: [{id: 1, name: "常用推荐"}],
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
                const state = localStorage.getItem("main");
                await userApi.updateUser(JSON.parse(state))
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
                // 基础数据校验
                if (!siteData.name || !siteData.name.trim()) {
                    throw new Error("网站名称不能为空");
                }
                if (!siteData.url || !siteData.url.trim()) {
                    throw new Error("网站URL不能为空");
                }
                
                // URL格式校验
                try {
                    new URL(siteData.url);
                } catch {
                    throw new Error("无效的URL格式");
                }

                // 分类ID校验
                const categoryExists = this.categories.some(category => 
                    category.id === (this.siteModalMode === "edit" ? siteData.categoryId : this.currentCategoryId)
                );
                if (!categoryExists) {
                    throw new Error("无效的分类ID");
                }

                // 编辑模式下的ID校验
                if (this.siteModalMode === "edit") {
                    if (!siteData.id) {
                        throw new Error("编辑模式下网站ID不能为空");
                    }
                    const siteExists = this.sites.some(site => site.id === siteData.id);
                    if (!siteExists) {
                        throw new Error("要编辑的网站不存在");
                    }
                }

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
    },

    // 在状态变化时自动保存
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'webnav-store',
                storage: localStorage,
                paths: ['currentEngine', 'categories', 'sites']
            }
        ]
    }
});

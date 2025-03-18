// API基础配置
const API_BASE_URL = '/api'

// 统一处理请求错误
const handleRequestError = (error) => {
    console.error('API请求失败:', error)
    throw error
}

export const userApi = {
    // 更新用户信息
    updateUser: async (user) => {
        try {
            const res = await fetch(`${API_BASE_URL}/users/shphuang`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            return await res.json()
        } catch (error) {
            handleRequestError(error)
        }
    }
}

// 分类相关API
export const categoryApi = {
    // 获取所有分类
    getCategories: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/categories`)
            return await res.json()
        } catch (error) {
            handleRequestError(error)
        }
    },

    // 添加分类
    addCategory: async (name) => {
        try {
            const res = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name})
            })
            return await res.json()
        } catch (error) {
            handleRequestError(error)
        }
    },

    // 删除分类
    deleteCategory: async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: 'DELETE'
            })
            return await res.json()
        } catch (error) {
            handleRequestError(error)
        }
    }
}

// 网站相关API
export const siteApi = {
    // 获取所有网站
    getAllSites: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/sites`)
            return await res.json()
        } catch (error) {
            handleRequestError(error)
        }
    },

    // 获取单个网站
    getSiteById: async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/sites/${id}`)
            return await res.json()
        } catch (error) {
            handleRequestError(error)
        }
    },

    // 创建网站
    createSite: async (site) => {
        try {
            const res = await fetch(`${API_BASE_URL}/sites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(site)
            })
            return await res.json()
        } catch (error) {
            handleRequestError(error)
        }
    },

    // 更新网站
    updateSite: async (id, site) => {
        try {
            const res = await fetch(`${API_BASE_URL}/sites/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(site)
            })
            return await res.json()
        } catch (error) {
            handleRequestError(error)
        }
    },

    // 删除网站
    deleteSite: async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/sites/${id}`, {
                method: 'DELETE'
            })
            return await res.json()
        } catch (error) {
            handleRequestError(error)
        }
    },

    // 按分类获取网站
    getSitesByCategory: async (categoryId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/sites/category/${categoryId}`)
            return await res.json()
        } catch (error) {
            handleRequestError(error)
        }
    },

    // 更新网站排序
    updateSiteOrder: async (orderSite) => {
        try {
            const res = await fetch(`${API_BASE_URL}/sites/${orderSite.id}/order`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderSite)
            })
            return await res.json()
        } catch (error) {
            handleRequestError(error)
        }
    }
}

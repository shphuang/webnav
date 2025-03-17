// 初始数据
let categories = [
  { id: 1, name: '常用推荐' },
  //   { id: 2, name: '设计资源' },
  //   { id: 3, name: '开发工具' },
  //   { id: 4, name: '学习平台' }
];

let sites = [
  // { id: 1, categoryId: 1, name: 'Google', url: 'https://www.google.com', description: '全球最大的搜索引擎' },
  // { id: 2, categoryId: 1, name: 'GitHub', url: 'https://github.com', description: '代码托管平台' },
  // { id: 3, categoryId: 1, name: 'YouTube', url: 'https://www.youtube.com', description: '视频分享平台' },
  // { id: 4, categoryId: 2, name: 'Dribbble', url: 'https://dribbble.com', description: '设计师作品集平台' },
  // { id: 5, categoryId: 2, name: 'Behance', url: 'https://www.behance.net', description: '创意作品展示平台' },
  // { id: 6, categoryId: 2, name: 'Unsplash', url: 'https://unsplash.com', description: '免费高质量图片' },
  // { id: 7, categoryId: 3, name: 'VS Code', url: 'https://code.visualstudio.com', description: '流行的代码编辑器' },
  // { id: 8, categoryId: 3, name: 'CodePen', url: 'https://codepen.io', description: '前端代码分享平台' },
  // { id: 9, categoryId: 4, name: 'Coursera', url: 'https://www.coursera.org', description: '在线课程平台' },
  // { id: 10, categoryId: 4, name: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Web开发文档' }
];

// 当前选中的分类ID
let currentCategoryId = 1;
// 当前搜索引擎
let currentSearchEngine = 'bing';
// 搜索引擎URL映射
const searchEngines = {
  bing: 'https://www.bing.com/search?q=',
  google: 'https://www.google.com/search?q=',
  baidu: 'https://www.baidu.com/s?wd=',
};

// DOM元素
const categoryList = document.querySelector('.category-list');
const categoryContent = document.querySelector('.category-content');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const currentEngineText = document.getElementById('currentEngine');
const engineOptions = document.querySelectorAll('.dropdown-content a');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const addCategoryModal = document.getElementById('addCategoryModal');
const saveCategoryBtn = document.getElementById('saveCategoryBtn');
const newCategoryName = document.getElementById('newCategoryName');
const addSiteModal = document.getElementById('addSiteModal');
const saveSiteBtn = document.getElementById('saveSiteBtn');
const newSiteName = document.getElementById('newSiteName');
const newSiteUrl = document.getElementById('newSiteUrl');
const newSiteDesc = document.getElementById('newSiteDesc');
const closeButtons = document.querySelectorAll('.close');
const editSiteModal = document.getElementById('editSiteModal');
const updateSiteBtn = document.getElementById('updateSiteBtn');
const editSiteName = document.getElementById('editSiteName');
const editSiteUrl = document.getElementById('editSiteUrl');
const editSiteDesc = document.getElementById('editSiteDesc');
const editSiteId = document.getElementById('editSiteId');

// 初始化
async function init() {
  // 从本地存储加载数据
  await loadData();
  // 渲染分类列表
  renderCategories();
  // 渲染当前分类的网站
  renderSites();
  // 添加事件监听器
  addEventListeners();
}

// 从本地存储加载数据
async function loadData() {
  let res = await fetch('/api/categories', {
    method: 'GET',
  });
  categories = await res.json();

  const savedSites = localStorage.getItem('sites');
  if (savedSites) {
    sites = JSON.parse(savedSites);
  }
}

// 保存数据到本地存储
async function saveData() {
  let res = await fetch('/api/categories', {
    method: 'GET',
  });
  categories = await res.json();
  categories && localStorage.setItem('categories', JSON.stringify(categories));
  sites && localStorage.setItem('sites', JSON.stringify(sites));
}

// 渲染分类列表
function renderCategories() {
  categoryList.innerHTML = '';

  categories.forEach((category) => {
    const categoryItem = document.createElement('div');
    categoryItem.className = `category-item ${
      category.id === currentCategoryId ? 'active' : ''
    }`;
    categoryItem.dataset.id = category.id;

    categoryItem.innerHTML = `
            <span>${category.name}</span>
            <i class="fas fa-trash delete-category" data-id="${category.id}"></i>
        `;

    categoryList.appendChild(categoryItem);
  });
}

// 渲染当前分类的网站
function renderSites() {
  categoryContent.innerHTML = '';

  // 添加网站按钮
  const addSiteButton = document.createElement('button');
  addSiteButton.className = 'add-site-btn';
  addSiteButton.innerHTML = '<i class="fas fa-plus"></i>';
  document.querySelector('.content-area').appendChild(addSiteButton);

  // 过滤并排序当前分类的网站
  const currentSites = sites.filter((site) =>
    site.categoryId === currentCategoryId
  )
    .sort((a, b) => a.order - b.order);

  currentSites.forEach((site) => {
    const siteCard = document.createElement('div');
    siteCard.className = 'site-card';
    siteCard.draggable = true;

    // 添加拖拽事件监听器
    siteCard.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('text/plain', site.id);
      this.classList.add('dragging');
    });

    siteCard.addEventListener('dragend', function () {
      this.classList.remove('dragging');
    });

    siteCard.addEventListener('dragover', function (e) {
      e.preventDefault();
      const draggingCard = document.querySelector('.dragging');
      const cards = [...document.querySelectorAll('.site-card:not(.dragging)')];
      const afterCard = cards.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;

      if (afterCard) {
        afterCard.parentNode.insertBefore(draggingCard, afterCard);
      } else {
        categoryContent.appendChild(draggingCard);
      }
    });

    siteCard.addEventListener('drop', function (e) {
      e.preventDefault();
      const draggedSiteId = parseInt(e.dataTransfer.getData('text/plain'));
      const draggedSiteIndex = sites.findIndex((s) => s.id === draggedSiteId);

      if (draggedSiteIndex !== -1) {
        const siteCards = [...document.querySelectorAll('.site-card')];
        siteCards.forEach((card, index) => {
          const siteId = parseInt(
            card.querySelector('.site-actions i').dataset.id,
          );
          const site = sites.find((s) => s.id === siteId);
          if (site) {
            site.order = index;
          }
        });

        // 保存更新后的排序到本地存储
        saveData();
        // 重新渲染网站列表以确保顺序正确
        renderSites();
      }
    });

    siteCard.innerHTML = `
            <div class="site-icon">
                <img src="https://www.google.com/s2/favicons?domain=${site.url}&sz=128" alt="${site.name} icon">
            </div>
            <div class="site-info">
                <h3>${site.name}</h3>
                <p>${site.description || '暂无描述'}</p>
            </div>
            <div class="site-actions">
                <i class="fas fa-edit edit-site" data-id="${site.id}" title="编辑"></i>
                <i class="fas fa-trash delete-site" data-id="${site.id}" title="删除"></i>
            </div>
        `;

    // 添加双击事件监听器
    siteCard.addEventListener('dblclick', function (e) {
      // 如果点击的是删除按钮或其祖先元素，不执行跳转
      if (!e.target.closest('.delete-site')) {
        window.open(site.url, '_blank');
      }
    });

    categoryContent.appendChild(siteCard);
  });
}

// 添加事件监听器
function addEventListeners() {
  // 分类点击事件
  categoryList.addEventListener('click', function (e) {
    const categoryItem = e.target.closest('.category-item');
    if (categoryItem && !e.target.classList.contains('delete-category')) {
      currentCategoryId = parseInt(categoryItem.dataset.id);
      renderCategories();
      renderSites();
    }

    // 删除分类
    if (e.target.classList.contains('delete-category')) {
      const categoryId = parseInt(e.target.dataset.id);
      deleteCategory(categoryId);
    }
  });

  // 搜索功能
  function search() {
    const query = searchInput.value.trim();
    if (query) {
      const searchUrl = searchEngines[currentSearchEngine] +
        encodeURIComponent(query);
      window.open(searchUrl, '_blank');
    }
  }

  // 搜索按钮点击事件
  searchBtn.addEventListener('click', function () {
    search();
  });

  // 回车键搜索
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      search();
    }
  });

  // 搜索引擎选择器点击事件
  const engineSelector = document.querySelector('.search-engine-selector');
  const dropdownContent = document.querySelector('.dropdown-content');

  engineSelector.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdownContent.classList.toggle('show');
  });

  // 点击选项时切换搜索引擎
  engineOptions.forEach((option) => {
    option.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      currentSearchEngine = this.dataset.engine;
      currentEngineText.textContent = this.textContent;
      dropdownContent.classList.remove('show');
    });
  });

  // 点击页面其他地方关闭下拉菜单
  document.addEventListener('click', function () {
    dropdownContent.classList.remove('show');
  });

  // 添加分类按钮点击事件
  addCategoryBtn.addEventListener('click', function () {
    addCategoryModal.style.display = 'block';
  });

  // 保存分类按钮点击事件
  saveCategoryBtn.addEventListener('click', function () {
    addCategory();
  });

  // 添加网站按钮点击事件
  document.querySelector('.content-area').addEventListener(
    'click',
    function (e) {
      if (e.target.closest('.add-site-btn')) {
        addSiteModal.style.display = 'block';
      } else if (e.target.classList.contains('edit-site')) {
        const siteId = parseInt(e.target.dataset.id);
        const site = sites.find((s) => s.id === siteId);
        if (site) {
          editSiteId.value = site.id;
          editSiteName.value = site.name;
          editSiteUrl.value = site.url;
          editSiteDesc.value = site.description || '';
          editSiteModal.style.display = 'block';
        }
      } else if (e.target.classList.contains('delete-site')) {
        const siteId = parseInt(e.target.dataset.id);
        deleteSite(siteId);
      }
    },
  );

  // 更新网站按钮点击事件
  updateSiteBtn.addEventListener('click', function () {
    updateSite();
  });

  // 保存网站按钮点击事件
  saveSiteBtn.addEventListener('click', function () {
    addSite();
  });

  // 关闭模态框
  closeButtons.forEach((button) => {
    button.addEventListener('click', function () {
      this.closest('.modal').style.display = 'none';
    });
  });

  // 点击模态框外部区域关闭模态框
  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    modal.addEventListener('click', function (e) {
      if (e.target === this) {
        this.style.display = 'none';
      }
    });
  });
}

// 添加分类
async function addCategory() {
  const name = newCategoryName.value.trim();
  if (name) {
    const newId = categories.length > 0
      ? Math.max(...categories.map((c) => c.id)) + 1
      : 1;
    categories.push({ id: newId, name });

    let res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    console.log(res);

    await saveData();
    renderCategories();
    newCategoryName.value = '';
    addCategoryModal.style.display = 'none';
  }
}

// 删除分类
function deleteCategory(categoryId) {
  if (confirm('确定要删除这个分类吗？相关网站也会被删除。')) {
    categories = categories.filter((category) => category.id !== categoryId);
    sites = sites.filter((site) => site.categoryId !== categoryId);

    if (currentCategoryId === categoryId) {
      currentCategoryId = categories.length > 0 ? categories[0].id : null;
    }

    saveData();
    renderCategories();
    renderSites();
  }
}

// 添加网站
function addSite() {
  const name = newSiteName.value.trim();
  const url = newSiteUrl.value.trim();
  const description = newSiteDesc.value.trim();

  if (name && url) {
    // 验证URL格式
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      alert('URL必须以http://或https://开头');
      return;
    }

    const currentSites = sites.filter((site) =>
      site.categoryId === currentCategoryId
    );
    const maxOrder = currentSites.length > 0
      ? Math.max(...currentSites.map((s) => s.order))
      : -1;
    const newId = sites.length > 0
      ? Math.max(...sites.map((s) => s.id)) + 1
      : 1;

    sites.push({
      id: newId,
      categoryId: currentCategoryId,
      name,
      url,
      description,
      order: maxOrder + 1,
    });

    saveData();
    renderSites();

    // 清空输入框
    newSiteName.value = '';
    newSiteUrl.value = '';
    newSiteDesc.value = '';
    addSiteModal.style.display = 'none';
  } else {
    alert('网站名称和URL不能为空');
  }
}

// 删除网站
function deleteSite(siteId) {
  if (confirm('确定要删除这个网站吗？')) {
    sites = sites.filter((site) => site.id !== siteId);
    saveData();
    renderSites();
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 更新网站
function updateSite() {
  const id = parseInt(editSiteId.value);
  const name = editSiteName.value.trim();
  const url = editSiteUrl.value.trim();
  const description = editSiteDesc.value.trim();

  if (name && url) {
    // 验证URL格式
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      alert('URL必须以http://或https://开头');
      return;
    }

    const siteIndex = sites.findIndex((site) => site.id === id);
    if (siteIndex !== -1) {
      sites[siteIndex] = {
        ...sites[siteIndex],
        name,
        url,
        description,
      };

      saveData();
      renderSites();

      // 清空输入框并关闭模态框
      editSiteName.value = '';
      editSiteUrl.value = '';
      editSiteDesc.value = '';
      editSiteId.value = '';
      editSiteModal.style.display = 'none';
    }
  } else {
    alert('网站名称和URL不能为空');
  }
}

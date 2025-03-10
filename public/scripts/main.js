document.addEventListener('DOMContentLoaded', () => {
    const h1 = document.querySelector('h1');
    
    // 添加简单的hover效果
    h1.addEventListener('mouseover', () => {
        h1.style.color = '#4a4a4a';
    });
    
    h1.addEventListener('mouseout', () => {
        h1.style.color = '#2b2b2b';
    });
    
    // 添加点击效果
    h1.addEventListener('click', () => {
        h1.textContent = '欢迎访问 Deno + Oak!';
    });
});
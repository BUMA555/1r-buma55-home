// BUMA 官网脚本

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
  // 平滑滚动
  smoothScroll();
  
  // 导航栏滚动效果
  navbarScroll();
  
  // 卡片悬停效果
  cardHoverEffects();
  
  // 按钮交互效果
  buttonEffects();
});

// 平滑滚动
function smoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

// 导航栏滚动效果
function navbarScroll() {
  const header = document.querySelector('.header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.backgroundColor = 'var(--background-color)';
      header.style.boxShadow = 'var(--shadow-sm)';
    }
    
    lastScrollTop = scrollTop;
  });
}

// 卡片悬停效果
function cardHoverEffects() {
  const cards = document.querySelectorAll('.feature-card, .solution-card, .story-card, .price-card, .resource-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
      this.style.boxShadow = 'var(--shadow-md)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'var(--shadow-sm)';
    });
  });
}

// 按钮交互效果
function buttonEffects() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 模拟按钮点击效果
      this.style.transform = 'translateY(0)';
      
      // 如果是外部链接，延迟后跳转
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        setTimeout(() => {
          window.location.href = href;
        }, 150);
      }
    });
  });
}

// 响应式导航菜单
function responsiveNav() {
  const nav = document.querySelector('.nav');
  const menuButton = document.querySelector('.menu-button');
  
  if (menuButton) {
    menuButton.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  }
}

// 滚动动画
function scrollAnimations() {
  const elements = document.querySelectorAll('.section-header, .feature-card, .solution-card, .story-card, .price-card, .resource-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1
  });
  
  elements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
}
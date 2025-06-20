// Демо-данные подарков
const demoGiftIds = [8282, 26355, 9991, 7777];
const gifts = demoGiftIds.map(id => ({
  id,
  name: `NFT Gift #${id}`,
  price: id % 3 === 0 ? 9.9 : 19.5,
  image: `https://t.me/i/userpic/320/${id}.jpg`
}));

let cart = [];

function renderGifts(filter = "") {
  const grid = document.getElementById('gifts-grid');
  grid.innerHTML = '';
  gifts
    .filter(gift => !filter || gift.id.toString().includes(filter))
    .forEach(gift => {
      const card = document.createElement('div');
      card.className = 'gift-card';
      card.innerHTML = `
        <img src="${gift.image}" alt="${gift.name}" class="gift-img">
        <div class="gift-name">${gift.name}</div>
        <div class="gift-id">#${gift.id}</div>
        <div>
          <span class="gift-price">💎 ${gift.price}</span>
          <button class="add-cart-btn" onclick="addToCart(${gift.id})">В корзину</button>
        </div>
      `;
      grid.appendChild(card);
    });
}

function addToCart(id) {
  const gift = gifts.find(g => g.id === id);
  if (gift) {
    cart.push(gift);
    updateCartUI();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  // Корзина в навигации
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  badge.textContent = cart.length;
  badge.style.display = cart.length > 0 ? 'flex' : 'none';

  // Логика для детальной корзины (если она будет)
}

document.addEventListener('DOMContentLoaded', function() {
  // Проверяем платформу через Telegram WebApp
  // 'tdesktop' - это ПК-версия. Все остальное (android, ios) - мобильные.
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.platform !== 'tdesktop') {
    document.body.classList.add('mobile');
  }

  // Универсальный обработчик для всех nav-btn
  Array.from(document.querySelectorAll('.nav-btn')).forEach(btn => {
    btn.addEventListener('click', function() {
      const tab = this.dataset.tab;
      switchTab(tab);
    });
  });

  // Поиск (фильтрация по ID)
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  if (searchInput && clearSearchBtn) {
    searchInput.addEventListener('input', function() {
      clearSearchBtn.style.display = this.value.length > 0 ? 'flex' : 'none';
      // Логика фильтрации
    });

    clearSearchBtn.addEventListener('click', function() {
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      searchInput.focus();
      searchInput.dispatchEvent(new Event('input'));
    });

    // Ограничение на ввод только цифр для первого поиска
    searchInput.addEventListener('beforeinput', function(e) {
      if (e.data !== null && !/^\d+$/.test(e.data)) {
        e.preventDefault();
      }
    });

    searchInput.addEventListener('paste', function(e) {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      const numbers = pastedText.replace(/\D/g, '');
      if (numbers) {
        document.execCommand('insertText', false, numbers);
      }
    });
  }

  // Логика для второго поиска (в Collections)
  const searchInputCollections = document.getElementById('search-input-collections');
  const clearSearchBtnCollections = document.getElementById('clear-search-btn-collections');

  if (searchInputCollections && clearSearchBtnCollections) {
    searchInputCollections.addEventListener('input', function() {
      clearSearchBtnCollections.style.display = this.value.length > 0 ? 'flex' : 'none';
    });

    clearSearchBtnCollections.addEventListener('click', function() {
      searchInputCollections.value = '';
      clearSearchBtnCollections.style.display = 'none';
      searchInputCollections.focus();
    });
  }

  // --- ЛОГИКА ОПЛАТЫ ---
  // В будущем, это значение будет приходить с сервера
  let totalItems = 0; 

  const paymentSlider = document.getElementById('payment-slider');
  const paymentAmount = document.getElementById('payment-amount');
  const paymentItems = document.getElementById('payment-items');
  const payButton = document.querySelector('.payment-button');

  if (paymentSlider && paymentAmount && payButton && paymentItems) {
    // Устанавливаем максимум слайдера в зависимости от кол-ва итемов
    paymentSlider.max = totalItems;
    paymentSlider.value = 0; // Начинаем с нуля

    const updateSliderStyle = () => {
      const value = parseFloat(paymentSlider.value) || 0;
      const min = parseFloat(paymentSlider.min) || 0;
      const max = parseFloat(paymentSlider.max) || 0;
      
      let progress = 0;
      if (max > min) {
        progress = ((value - min) / (max - min)) * 100;
      }
      
      paymentSlider.style.background = `linear-gradient(to right, #fff ${progress}%, #6D6D71 ${progress}%)`;

      // Обновляем состояние кнопки
      if (value === 0) {
        payButton.style.backgroundColor = '#1F5893';
        payButton.style.color = '#8E9093';
        payButton.disabled = true;
      } else {
        payButton.style.backgroundColor = '#0A84FF';
        payButton.style.color = '#fff';
        payButton.disabled = false;
      }
    };

    paymentSlider.addEventListener('input', function() {
      const currentValue = Math.round(this.value);
      paymentAmount.textContent = `${currentValue} TON`; // Пример, цена будет зависеть от итемов
      paymentItems.textContent = `${currentValue} items`;
      updateSliderStyle();
    });

    // Установим начальное состояние
    paymentAmount.textContent = `0 TON`;
    paymentItems.textContent = `0 items`;
    updateSliderStyle();
  }

  // --- ЛОГИКА МОДАЛЬНОГО ОКНА ---
  const rulesBtn = document.getElementById('rules-btn-display');
  const modalOverlay = document.getElementById('rules-modal-overlay');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const continueBtn = document.getElementById('modal-continue-btn');

  const openModal = () => {
    if (!modalOverlay) return;
    // Показываем оверлей и блокируем скролл
    modalOverlay.style.display = 'flex';
    modalOverlay.classList.add('visible'); // СРАЗУ включаем блюр
    document.body.classList.add('modal-open');
    // Анимация панели через отдельный класс
    const panel = modalOverlay.querySelector('.modal-panel');
    if (panel) {
      panel.classList.remove('slide-in'); // сброс, чтобы transition всегда срабатывал
      // Триггерим reflow для корректной анимации
      void panel.offsetWidth;
      panel.classList.add('slide-in');
    }
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    // Запускаем анимацию скрытия
    modalOverlay.classList.remove('visible');
    const panel = modalOverlay.querySelector('.modal-panel');
    if (panel) {
      panel.classList.remove('slide-in');
    }
    // Ждем окончания анимации, чтобы скрыть оверлей через display:none
    const onTransitionEnd = () => {
      modalOverlay.style.display = 'none';
      document.body.classList.remove('modal-open');
      if (panel) panel.removeEventListener('transitionend', onTransitionEnd);
    };
    if (panel) {
      panel.addEventListener('transitionend', onTransitionEnd, {once: true});
    } else {
      setTimeout(() => {
        modalOverlay.style.display = 'none';
        document.body.classList.remove('modal-open');
      }, 800);
    }
  };

  rulesBtn?.addEventListener('click', openModal);
  closeModalBtn?.addEventListener('click', closeModal);
  continueBtn?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Кнопки
  const cartPayBtn = document.getElementById('cart-pay-btn');
  if (cartPayBtn) {
    cartPayBtn.onclick = function() {
      if (cart.length === 0) return;
      alert('✅ Оплата отправлена! (Демо)');
      cart = [];
      updateCartUI();
    };
  }
  const walletBtn = document.getElementById('wallet-btn');
  if (walletBtn) {
    walletBtn.onclick = function() {
      alert('TonConnect не реализован в демо');
    };
  }
  const topupBtn = document.getElementById('topup-btn');
  if (topupBtn) {
    topupBtn.onclick = function() {
      alert('Пополнение не реализовано в демо');
    };
  }

  // Инициализация
  updateCartUI();
  switchTab('market');

  // Telegram WebApp Fullscreen
  if (window.Telegram && window.Telegram.WebApp) {
    let tg = window.Telegram.WebApp;
    tg.ready();
    // Просто расширяем приложение, не запрашивая полный экран
    if (tg.expand) {
      tg.expand();
    }
  }

  // Делегирование событий для табов магазина
  const storeTabs = document.querySelector('.store-tabs');
  const tabAllBtn = document.getElementById('tab-all');
  const tabCollectionsBtn = document.getElementById('tab-collections');
  const allContent = document.getElementById('store-all-content');
  const collectionsContent = document.getElementById('store-collections-content');

  function switchStoreTab(tab) {
    if (tab === 'all') {
      tabAllBtn.classList.add('active');
      tabCollectionsBtn.classList.remove('active');
      allContent.classList.add('active');
      collectionsContent.classList.remove('active');
    } else {
      tabAllBtn.classList.remove('active');
      tabCollectionsBtn.classList.add('active');
      allContent.classList.remove('active');
      collectionsContent.classList.add('active');
    }
  }

  if (storeTabs) {
    storeTabs.addEventListener('click', function(e) {
      const target = e.target.closest('.store-tab-btn');
      if (target) {
        if (target.id === 'tab-all') {
          switchStoreTab('all');
        } else if (target.id === 'tab-collections') {
          switchStoreTab('collections');
        }
      }
    });
    switchStoreTab('all');
  }

  // Кнопки управления в Store
  const activityBtn = document.getElementById('activity-btn');
  const viewBtn = document.getElementById('view-btn');
  const filterBtn = document.getElementById('filter-btn');

  activityBtn?.addEventListener('click', () => activityBtn.classList.toggle('active'));
  viewBtn?.addEventListener('click', () => viewBtn.classList.toggle('active'));
  filterBtn?.addEventListener('click', () => filterBtn.classList.toggle('active'));

  const profileBtn = document.getElementById('nav-profile');
  const marketBtn = document.getElementById('nav-market');
  const giftsBtn = document.getElementById('nav-gifts');
  const seasonsBtn = document.getElementById('nav-seasons');
  const bonusBalance = document.getElementById('bonus-balance-display');
  const settingsIcon = document.getElementById('settings-icon');

  function showSettingsIcon() {
    bonusBalance.style.display = 'none';
    settingsIcon.style.display = 'flex';
  }

  function showBonusBalance() {
    bonusBalance.style.display = 'flex';
    settingsIcon.style.display = 'none';
  }

  function hideBonusAndSettings() {
    bonusBalance.style.display = 'none';
    settingsIcon.style.display = 'none';
  }

  profileBtn.addEventListener('click', showSettingsIcon);
  marketBtn.addEventListener('click', showBonusBalance);
  giftsBtn.addEventListener('click', showBonusBalance);
  seasonsBtn.addEventListener('click', hideBonusAndSettings);

  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', function() {
      modalOverlay.classList.remove('visible');
    });
  }

  if (bonusBalance) {
    bonusBalance.addEventListener('click', function() {
      switchTab('seasons');
    });
  }

  const depositBtn = document.querySelector('.ton-plus');
  const depositSection = document.getElementById('deposit-section');
  const mainContainer = document.querySelector('.container');
  const depositBackBtn = document.getElementById('deposit-back-btn');
  const bottomNav = document.querySelector('.bottom-nav');

  function openDeposit() {
    if (depositSection) {
      depositSection.classList.remove('hide');
      depositSection.classList.add('show');
      depositSection.style.display = 'flex';
      if (mainContainer) mainContainer.style.display = 'none';
      if (bottomNav) bottomNav.style.display = 'none';
      if (location.hash !== '#deposit') {
        history.pushState({deposit: true}, '', '#deposit');
      }
    }
  }
  function closeDeposit() {
    if (depositSection) {
      depositSection.classList.remove('show');
      depositSection.classList.add('hide');
      setTimeout(() => {
        depositSection.style.display = 'none';
      }, 400);
    }
    if (mainContainer) mainContainer.style.display = '';
    if (bottomNav) bottomNav.style.display = '';
  }
  if (depositBtn) {
    depositBtn.addEventListener('click', openDeposit);
  }
  if (depositBackBtn) {
    depositBackBtn.addEventListener('click', function() {
      history.back();
    });
  }
  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.deposit) {
      openDeposit();
    } else {
      closeDeposit();
    }
  });
});

/**
 * Переключение вкладок и активной кнопки навигации
 */
function switchTab(tab) {
  // Переключаем активную кнопку
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  // Переключаем секции
  const sections = ['market', 'gifts', 'seasons', 'profile', 'cart'];
  sections.forEach(name => {
    const el = document.getElementById(name + '-section');
    if (el) {
      el.classList.toggle('active-section', tab === name);
    }
  });

  // Переключаем отображение бонусного баланса / кнопки Rules
  const bonusDisplay = document.getElementById('bonus-balance-display');
  const rulesDisplay = document.getElementById('rules-btn-display');

  if (bonusDisplay && rulesDisplay) {
    if (tab === 'seasons') {
      bonusDisplay.style.display = 'none';
      rulesDisplay.style.display = 'flex';
    } else {
      bonusDisplay.style.display = 'flex';
      rulesDisplay.style.display = 'none';
    }
  }
}

async function initTg() {
  if (window.Telegram?.isTMA && await window.Telegram.isTMA()) {
    window.Telegram.init();
    
    // Оставляем только expand, чтобы приложение занимало все доступное место
    if (window.Telegram.WebApp?.expand) {
      window.Telegram.WebApp.expand();
    }
  }
}

(async () => { await initTg(); })();

function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

document.querySelector('.custom-modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

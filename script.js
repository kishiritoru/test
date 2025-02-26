// header.html を動的に読み込むスクリプト
fetch('header.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch header.html');
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('header-container').innerHTML = data;

    // メニューボタン、閉じるボタン、オーバーレイを取得
    const menuButton = document.getElementById('menu-button');
    const sideMenu = document.getElementById('side-menu');
    const closeButton = document.getElementById('close-button');
    const overlay = document.getElementById('overlay');

    if (menuButton && sideMenu && closeButton && overlay) {
      // メニューボタンを押したときの動作
      menuButton.addEventListener('click', () => {
        sideMenu.classList.add('open'); // メニューを開く
        overlay.classList.add('active'); // オーバーレイを表示
      });

      // 閉じるボタンを押したときの動作
      closeButton.addEventListener('click', () => {
        sideMenu.classList.remove('open'); // メニューを閉じる
        overlay.classList.remove('active'); // オーバーレイを非表示
      });

      // オーバーレイを押したときの動作
      overlay.addEventListener('click', () => {
        sideMenu.classList.remove('open'); // メニューを閉じる
        overlay.classList.remove('active'); // オーバーレイを非表示
      });
    }
  })
  .catch(error => {
    console.error('Error loading header:', error);
  });

// Swiper.js の初期化
document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.swiper-container', {
    loop: true, // 無限ループ
    autoplay: {
      delay: 3000, // 自動再生（3秒ごと）
    },
    pagination: {
      el: '.swiper-pagination', // ページネーション
      clickable: true, // ページネーションをクリック可能に
    },
  });
});

// =============================
// フィルター選択ボタンのクリックイベント（プルダウンを表示する）
// =============================
document.querySelectorAll('.selectMultiple').forEach(select => {
  select.addEventListener('click', function (event) {
    event.stopPropagation();
    toggleDropdown(this);
  });
});

// プルダウン開閉処理
function toggleDropdown(select) {
  document.querySelectorAll('.selectMultiple').forEach(el => {
    if (el !== select) el.classList.remove('open');
  });
  select.classList.toggle('open');
}

// 選択した値をボタンに反映
document.querySelectorAll('.filter-dropdown li').forEach(item => {
  item.addEventListener('click', function (event) {
    event.stopPropagation();
    const selectBox = this.closest('.selectMultiple');
    const selectedOption = selectBox.querySelector('.selected-option');
    
    if (this.dataset.value === "reset") {
      selectedOption.textContent = selectBox.id === "location-select" ? "都道府県から選ぶ" :
                                   selectBox.id === "season-select" ? "季節から選ぶ" : 
                                   "テーマから選ぶ";
    } else {
      selectedOption.textContent = this.textContent;
    }

    selectBox.classList.remove('open');
  });
});

// 検索処理
document.getElementById('search-button').addEventListener('click', function () {
  const selectedLocation = document.getElementById('location-select').querySelector('.selected-option').textContent;
  const selectedSeason = document.getElementById('season-select').querySelector('.selected-option').textContent;
  const selectedTheme = document.getElementById('theme-select').querySelector('.selected-option').textContent;

  const filters = { location: selectedLocation, season: selectedSeason, theme: selectedTheme };
  fetchPlans(filters);
});

// =============================
// 旅行プランデータ
// =============================

const plans = [
  { name: "広島旅行", url: "page1.html", image: "assets/page1hiroshima.jpg", location: "広島", season: "夏", theme: "歴史" },
  { name: "栃木旅行", url: "page2.html", image: "assets/page2tochigi.jpg", location: "栃木", season: "秋", theme: "自然" },
  { name: "東京旅行", url: "page3.html", image: "assets/page3tokyo.jpg", location: "東京", season: "冬", theme: "グルメ" }
];

// 絞り込んだプランを表示
function fetchPlans(filters) {
  const filteredPlans = plans.filter(plan =>
    (filters.location === "都道府県から選ぶ" || plan.location === filters.location) &&
    (filters.season === "季節から選ぶ" || plan.season === filters.season) &&
    (filters.theme === "テーマから選ぶ" || plan.theme === filters.theme)
  );

  displayPlans(filteredPlans);
}


// 絞り込まれたプランを表示する（画像付き）
function displayPlans(filteredPlans) {
  const planContainer = document.getElementById("plan-list");
  planContainer.innerHTML = ""; // 既存のコンテンツをクリア

  if (filteredPlans.length > 0) {
    filteredPlans.forEach(plan => {
      const planElement = document.createElement("div");
      planElement.className = "plan";

      // 画像付きのリンクを作成
      planElement.innerHTML = `
        <a href="${plan.url}">
          <img src="${plan.image}" alt="${plan.name}" class="plan-image">
        </a>
      `;
      planContainer.appendChild(planElement);
    });
  } else {
    planContainer.innerHTML = `<p style="color: red; text-align: center;">該当するプランが見つかりませんでした。</p>`;
  }
  document.getElementById('search-results').classList.remove('hidden');
}

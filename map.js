// マップコンテナの生成
var mapContainer = document.createElement('div');
mapContainer.id = 'map';
document.body.appendChild(mapContainer);

// banner
var banner = document.createElement('div');
banner.id = 'banner';
banner.className = 'hidden';
banner.innerHTML = '<p id="banner-content"></p>';
document.body.appendChild(banner);

// leaflet
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
document.head.appendChild(link);

// map.css
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'map.css';
document.head.appendChild(link);

// leaflet
var script = document.createElement('script');
script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
script.onload = function() {
  // マップの初期状態
  var map = L.map('map', {
    minZoom: 7 //最小ズームを設定
  }).setView([35.613110, 140.113622], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 7 //最小ズームを設定
  }).addTo(map);

  // カスタムアイコンの定義
  var blueIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41]
  });

  var redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41]
  });

  let showRedPins = true; // 観光ピンを表示するかどうか
  let showBluePins = true; // 防災ピンを表示するかどうか

  // マーカーの設定
  // 現在の表示範囲内のピンのみ表示
  function updateMarkers(map, markers, layerGroup, filterType) {
    const bounds = map.getBounds();
    layerGroup.clearLayers();

    markers.forEach(marker => {
      const isRedPin = marker.icon === "redIcon";
      const isBluePin = marker.icon === "blueIcon";

      // チェックボックスの状態を考慮
      if (
        bounds.contains(marker.position) &&
        ((filterType === "redIcon" && showRedPins && isRedPin) ||
          (filterType === "blueIcon" && showBluePins && isBluePin))
      ) {
        const iconInstance = filterType === "redIcon" ? redIcon : blueIcon;
        const markerInstance = L.marker(marker.position, { icon: iconInstance }).bindPopup(`
          <div>
            <h3>${marker.content}</h3>
            <p>${marker.content_detail}</p>
            <button onclick="handleCheckIn('${marker.content}', '${encodeURIComponent(JSON.stringify(marker.suggestion))}')">チェックイン</button>
          </div>
        `);
        layerGroup.addLayer(markerInstance);
      }
    });
  }


  // マーカーの追加とポップアップ設定
  var redPins = markers.filter(marker => marker.icon === "redIcon").map(marker => {
    return L.marker(marker.position, { icon: redIcon })
      .bindPopup(`
        <div>
          <h3>${marker.content}</h3>
          <p>${marker.content_detail}</p>
          <button onclick="handleCheckIn('${marker.content}', '${encodeURIComponent(JSON.stringify(marker.suggestion))}')">チェックイン</button>
        </div>
      `);
  });

  var bluePins = markers.filter(marker => marker.icon === "blueIcon").map(marker => {
    return L.marker(marker.position, { icon: blueIcon })
      .bindPopup(`
        <div>
          <h3>${marker.content}</h3>
          <p>${marker.content_detail}</p>
          <button onclick="handleCheckIn('${marker.content}', '${encodeURIComponent(JSON.stringify(marker.suggestion))}')">チェックイン</button>
        </div>
      `);
  });

  const redLayer = L.layerGroup(redPins).addTo(map);
  const blueLayer = L.layerGroup(bluePins).addTo(map);

  // 初期表示で範囲内のピンを表示
  updateMarkers(map, markers, redLayer, "redIcon");
  updateMarkers(map, markers, blueLayer, "blueIcon");
  
  // マップ移動時に範囲内のピンを更新
  map.on('moveend', () => {
    if (showRedPins) {
      updateMarkers(map, markers.filter(marker => marker.icon === "redIcon"), redLayer, "redIcon");
    } else {
      redLayer.clearLayers();
    }

    if (showBluePins) {
      updateMarkers(map, markers.filter(marker => marker.icon === "blueIcon"), blueLayer, "blueIcon");
    } else {
      blueLayer.clearLayers();
    }
  });
    


  // カスタムコントロールの追加
  var customControl = L.Control.extend({
    options: { position: 'topright' },

    onAdd: function(map) {
      var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.style.backgroundColor = 'white';
      container.style.padding = '10px';

      var redCheckbox = document.createElement('input');
      redCheckbox.type = 'checkbox';
      redCheckbox.id = 'redPins';
      redCheckbox.checked = true;

      var redLabel = document.createElement('label');
      redLabel.htmlFor = 'redPins';
      redLabel.innerText = '観光';

      var blueCheckbox = document.createElement('input');
      blueCheckbox.type = 'checkbox';
      blueCheckbox.id = 'bluePins';
      blueCheckbox.checked = true;

      var blueLabel = document.createElement('label');
      blueLabel.htmlFor = 'bluePins';
      blueLabel.innerText = '防災';

      container.appendChild(redCheckbox);
      container.appendChild(redLabel);
      container.appendChild(document.createElement('br'));
      container.appendChild(blueCheckbox);
      container.appendChild(blueLabel);

      L.DomEvent.disableClickPropagation(container);

      // チェックボックスのイベントリスナーで状態を更新
      redCheckbox.addEventListener('change', function () {
        showRedPins = redCheckbox.checked; // 状態を更新
        if (showRedPins) {
          updateMarkers(map, markers.filter(marker => marker.icon === "redIcon"), redLayer, "redIcon");
        } else {
          redLayer.clearLayers();
        }
      });

      blueCheckbox.addEventListener('change', function () {
        showBluePins = blueCheckbox.checked; // 状態を更新
        if (showBluePins) {
          updateMarkers(map, markers.filter(marker => marker.icon === "blueIcon"), blueLayer, "blueIcon");
        } else {
          blueLayer.clearLayers();
        }
      });
        
      return container;
    }
  });

  map.addControl(new customControl());

  // 津波浸水ハザードマップのタイルレイヤー
  const tsunamiLayer = L.tileLayer(
    'https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png',
    {
      attribution: '© 国土地理院',
      opacity: 0.9, // 透明度
      minZoom: 7,
      maxZoom: 16
    }
  );

  // 洪水浸水想定区域のタイルレイヤー
  const floodLayer = L.tileLayer(
    'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png',
    {
      attribution: '© 国土地理院',
      opacity: 0.9, // 透明度
      minZoom: 7,
      maxZoom: 16
    }
  );


// 津波ハザードマップのカスタムコントロール
var tsunamiControl = L.Control.extend({
  options: { position: 'topright' },

  onAdd: function(map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    container.style.backgroundColor = 'white';
    container.style.padding = '10px';

      // 津波ハザードマップのチェックボックス
      var tsunamiCheckbox = document.createElement('input');
      tsunamiCheckbox.type = 'checkbox';
      tsunamiCheckbox.id = 'tsunamiMap';
      tsunamiCheckbox.checked = false;

      var tsunamiLabel = document.createElement('label');
      tsunamiLabel.htmlFor = 'tsunamiMap';
      tsunamiLabel.innerText = '津波';

      // 洪水ハザードマップのチェックボックス
      var floodCheckbox = document.createElement('input');
      floodCheckbox.type = 'checkbox';
      floodCheckbox.id = 'floodMap';
      floodCheckbox.checked = false;

      var floodLabel = document.createElement('label');
      floodLabel.htmlFor = 'floodMap';
      floodLabel.innerText = '洪水';

      // チェックボックスをコンテナに追加
      container.appendChild(tsunamiCheckbox);
      container.appendChild(tsunamiLabel);
      container.appendChild(document.createElement('br'));
      container.appendChild(floodCheckbox);
      container.appendChild(floodLabel);

      // イベントリスナー
      L.DomEvent.disableClickPropagation(container);
      tsunamiCheckbox.addEventListener('change', function() {
        if (tsunamiCheckbox.checked) {
          map.addLayer(tsunamiLayer);
        } else {
          map.removeLayer(tsunamiLayer);
        }
      });

      floodCheckbox.addEventListener('change', function() {
        if (floodCheckbox.checked) {
          map.addLayer(floodLayer);
        } else {
          map.removeLayer(floodLayer);
        }
      });

      return container;
    }
  });

  // マップに津波ハザードマップ用のコントロールを追加
  map.addControl(new tsunamiControl());

};
document.head.appendChild(script);

// その他の機能（バッジ関連など）
// ランダムなバッジを選ぶ
function getRandomBadge() {
  const badgeIcons = [
    'images/badges/badge1.svg',
    'images/badges/badge2.svg',
    'images/badges/badge3.svg',
    'images/badges/badge4.svg'
  ];
  const randomIndex = Math.floor(Math.random() * badgeIcons.length);
  return badgeIcons[randomIndex];
}

// バッジを保存
function saveBadge(badge) {
  const badges = JSON.parse(localStorage.getItem('badges')) || [];
  badges.push(badge);
  localStorage.setItem('badges', JSON.stringify(badges));
}

// バッジを表示
function displayBadges() {
  const badgeContainer = document.getElementById('badge-container');
  badgeContainer.innerHTML = '';

  const badges = JSON.parse(localStorage.getItem('badges')) || [];

  if (badges.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'チェックインが完了するとバッジがもらえます';
    emptyMessage.style.color = '#aaa';
    emptyMessage.style.textAlign = 'center';
    badgeContainer.appendChild(emptyMessage);
  } else {
    badges.forEach(({ placeName, badgeIcon }) => {
      const badgeElement = document.createElement('div');
      badgeElement.className = 'badge';
      badgeElement.innerHTML = `<img src="${badgeIcon}" alt="バッジ" class="badge-image">`;
      badgeContainer.appendChild(badgeElement);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  displayBadges();
});

function handleCheckIn(placeName, encodedSuggestion) {
  const suggestion = JSON.parse(decodeURIComponent(encodedSuggestion));
  console.log('Check-in:', placeName, suggestion);

  const overlay = document.createElement('div');
  overlay.className = 'circle-overlay';
  document.body.appendChild(overlay);

  const mapCenter = document.getElementById('map').getBoundingClientRect();
  const circleX = mapCenter.left + mapCenter.width / 2;
  const circleY = mapCenter.top + mapCenter.height / 2;

  overlay.style.left = `${circleX}px`;
  overlay.style.top = `${circleY}px`;

  const messageBox = document.createElement('div');
  messageBox.className = 'message-box';

  const suggestionsHTML = suggestion
    .map((item, index) => `
      <div>
        <label>
          <input type="checkbox" class="suggestion-checkbox" data-index="${index}">
          ${item}
        </label>
      </div>
    `)
    .join('');

  messageBox.innerHTML = `
    <h2>${placeName} で防災チェックイン</h2>
    ${suggestionsHTML}
    <button onclick="closeCheckIn()">閉じる</button>
    <button id="completeButton" style="display: none;" onclick="completeCheckIn('${placeName}')">完了</button>
  `;
  document.body.appendChild(messageBox);

  setTimeout(() => {
    messageBox.style.display = 'block';
  }, 1000);

  const checkboxes = document.querySelectorAll('.suggestion-checkbox');
  const completeButton = document.getElementById('completeButton');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      completeButton.style.display = allChecked ? 'inline-block' : 'none';
    });
  });
}

function closeCheckIn() {
  document.querySelector('.circle-overlay').remove();
  document.querySelector('.message-box').remove();
}

function completeCheckIn(placeName) {
  const overlay = document.querySelector('.circle-overlay');
  overlay.style.transition = 'opacity 1s ease-out';
  overlay.style.opacity = '0';

  setTimeout(() => {
    overlay.remove();
    document.querySelector('.message-box').remove();

    const randomBadge = getRandomBadge();
    saveBadge({ placeName, badgeIcon: randomBadge });
    displayBadges();

    alert(`おめでとうございます！「${placeName}」のバッジを獲得しました！`);
  }, 1000);
}

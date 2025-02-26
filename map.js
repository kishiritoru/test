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


// ==========================================================================
// DATASET PENELITIAN (MOCK DATA BERDASARKAN SKETSA DAN GAMBAR KETIGA)
// ==========================================================================
const stationsData = {
  1: {
    id: 1,
    name: "Stasiun I (Darat/Mangrove)",
    badgeClass: "s1",
    center: [-8.8086562, 116.4930839],
    // Poligon batas wilayah stasiun (Batas Stasiun)
    boundary: [
      [-8.8081562, 116.4925839],
      [-8.8081562, 116.4935839],
      [-8.8091562, 116.4935839],
      [-8.8091562, 116.4925839]
    ],
    plots: [
      { name: "Plot 1", coords: [-8.8086562, 116.4928839], size: "3x3 m" },
      { name: "Plot 2", coords: [-8.8086562, 116.4930839], size: "3x3 m" },
      { name: "Plot 3", coords: [-8.8086562, 116.4932839], size: "3x3 m" }
    ],
    parameters: {
      salinity: 24, // ppt (lebih payau)
      ph: 6.5,
      temperature: 28.8, // °C
      species: {
        "Rhizophora apiculata": 22,
        "Sonneratia alba": 8,
        "Avicennia marina": 1
      },
      substrate: "Lumpur Pekat (Clay)",
      dominantVegetation: "Rhizophora apiculata & Sonneratia",
      description: "Zona darat/mangrove lebat. Karakteristik lumpur yang sangat pekat dan subur mendukung kerapatan pohon mangrove yang sangat tinggi."
    }
  },
  2: {
    id: 2,
    name: "Stasiun II (Transisi)",
    badgeClass: "s2",
    center: [-8.8057199, 116.487292],
    boundary: [
      [-8.8052199, 116.486792],
      [-8.8052199, 116.487792],
      [-8.8062199, 116.487792],
      [-8.8062199, 116.486792]
    ],
    plots: [
      { name: "Plot 1", coords: [-8.8057199, 116.487092], size: "3x3 m" },
      { name: "Plot 2", coords: [-8.8057199, 116.487292], size: "3x3 m" },
      { name: "Plot 3", coords: [-8.8057199, 116.487492], size: "3x3 m" }
    ],
    parameters: {
      salinity: 28, // ppt
      ph: 6.8,
      temperature: 29.5,
      species: {
        "Rhizophora apiculata": 15,
        "Sonneratia alba": 4,
        "Avicennia marina": 2
      },
      substrate: "Lumpur Berpasir",
      dominantVegetation: "Rhizophora apiculata",
      description: "Zona transisi di dekat garis pantai dan dermaga. Zona ini didominasi oleh mangrove berakar tunjang pekat dengan tingkat sedimentasi sedang."
    }
  },
  3: {
    id: 3,
    name: "Stasiun III (Laut/Perairan)",
    badgeClass: "s3",
    center: [-8.8054793, 116.4862664],
    boundary: [
      [-8.8049793, 116.4857664],
      [-8.8049793, 116.4867664],
      [-8.8059793, 116.4867664],
      [-8.8059793, 116.4857664]
    ],
    plots: [
      { name: "Plot 1", coords: [-8.8054793, 116.4860664], size: "3x3 m" },
      { name: "Plot 2", coords: [-8.8054793, 116.4862664], size: "3x3 m" },
      { name: "Plot 3", coords: [-8.8054793, 116.4864664], size: "3x3 m" }
    ],
    parameters: {
      salinity: 32, // ppt (salinitas laut normal)
      ph: 7.8,
      temperature: 30.2,
      species: {
        "Rhizophora apiculata": 2,
        "Sonneratia alba": 1,
        "Avicennia marina": 0
      },
      substrate: "Pasir Berlumpur",
      dominantVegetation: "Sonneratia alba (Minimal)",
      description: "Terletak di area teluk terbuka. Paparan air laut langsung dan ombak menyebabkan formasi mangrove lebih renggang dengan substrat yang lebih berpasir."
    }
  }
};

// ==========================================================================
// GLOBALS & INSTANCES MAP / CHART
// ==========================================================================
let mainMap = null;
let printMap = null;
let insetMap = null;
let activeStationId = 1;
let currentChart = null;

// Tile Layers Definitions
const tileLayers = {
  satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }),
  osm: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }),
  topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  })
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Inisialisasi Peta Utama (Dashboard)
  initMainMap();

  // Load Data Pertama
  focusStation(1);

  // Setup input listeners to update static print titles in real-time
  setupPrintInputListeners();
});

// ==========================================================================
// LOGIKA PETA UTAMA
// ==========================================================================
function initMainMap() {
  // Center: Teluk Jor, Lombok Timur (Updated)
  mainMap = L.map('map', {
    center: [-8.8066, 116.4889],
    zoom: 15,
    layers: [tileLayers.satellite], // Default layer
    zoomControl: false // Custom placement later
  });

  // Tambahkan Zoom Control di pojok kanan bawah
  L.control.zoom({
    position: 'bottomright'
  }).addTo(mainMap);

  // Gambarkan Poligon Stasiun & Marker Plot
  drawStationsOnMap(mainMap);
}

// Fungsi menggambar batasan stasiun & marker plot di peta
function drawStationsOnMap(mapInstance) {
  Object.values(stationsData).forEach(station => {
    // 1. Gambar Batas Wilayah Stasiun (Poligon Merah sesuai sketsa/legenda)
    const boundaryPolygon = L.polygon(station.boundary, {
      color: 'red',
      weight: 2,
      fillColor: '#ef4444',
      fillOpacity: 0.1,
      dashArray: '4, 4'
    }).addTo(mapInstance);

    // Tambah popup pada area stasiun
    boundaryPolygon.bindPopup(`
      <div class="custom-station-popup">
        <h4><span class="station-badge ${station.badgeClass}">${station.id}</span> ${station.name}</h4>
        <p>Batas Kawasan Sampling Plot</p>
        <button class="btn btn-primary btn-sm" onclick="focusStation(${station.id})">Lihat Detail Data</button>
      </div>
    `);

    // 2. Buat Marker Utama Stasiun (Glow Pulse)
    const customIcon = L.divIcon({
      className: 'custom-leaflet-icon',
      html: `<div class="station-pulse-marker ${station.badgeClass}"><div class="pulse-ring"></div></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const marker = L.marker(station.center, { icon: customIcon }).addTo(mapInstance);
    marker.bindPopup(`
      <div class="custom-station-popup">
        <h4>${station.name}</h4>
        <p>Koordinat Pusat: ${station.center[0].toFixed(5)}, ${station.center[1].toFixed(5)}</p>
        <button class="btn btn-primary btn-sm" onclick="focusStation(${station.id})">Lihat Detail</button>
      </div>
    `);

    // 3. Gambar Plot-plot sampling mini di dalam stasiun
    station.plots.forEach((plot, index) => {
      // Gambar plot sebagai kotak kecil 3m x 3m (skala geografis: ~0.00003 derajat)
      const lat = plot.coords[0];
      const lng = plot.coords[1];
      const offset = 0.00015; // Ukuran representasi visual plot agar terlihat di peta
      
      const plotBounds = [
        [lat - offset, lng - offset],
        [lat + offset, lng + offset]
      ];

      L.rectangle(plotBounds, {
        color: '#000',
        weight: 1.5,
        fillColor: '#22c55e',
        fillOpacity: 0.6
      }).addTo(mapInstance)
      .bindPopup(`<b>${plot.name} (Stasiun ${station.id})</b><br>Ukuran: ${plot.size}<br>Posisi sampling vegetasi.`);
    });
  });

  // 4. Gambar Jalur Penghubung Antar Stasiun (sesuai sketsa & legenda)
  const paths = [
    {
      name: "Jalur Setapak Pantai (Stasiun II - I)",
      coords: [
        [-8.8057199, 116.487292], // S2 (Stasiun II - Tengah)
        [-8.8072, 116.4902],
        [-8.8086562, 116.4930839]  // S1 (Stasiun I - Kanan)
      ],
      options: {
        color: '#ef4444', // Merah sesuai legenda batas wilayah/jalan
        weight: 3,
        dashArray: '4, 8',
        opacity: 0.85
      },
      label: "715 m"
    },
    {
      name: "Jalur Perlintasan Air (Stasiun III - II)",
      coords: [
        [-8.8054793, 116.4862664], // S3 (Stasiun III - Kiri)
        [-8.8056, 116.4868],
        [-8.8057199, 116.487292]  // S2 (Stasiun II - Tengah)
      ],
      options: {
        color: '#3b82f6', // Biru laut/perlintasan air
        weight: 3,
        dashArray: '6, 6',
        opacity: 0.85
      },
      label: "116 m"
    }
  ];

  paths.forEach(path => {
    L.polyline(path.coords, path.options)
      .addTo(mapInstance)
      .bindPopup(`<b>${path.name}</b><br>Konektivitas stasiun: ${path.label}`)
      .bindTooltip(path.label, {
        permanent: true,
        direction: 'center',
        className: 'path-tooltip'
      });
  });
}

// Mengubah Basemap
function changeBasemap(type) {
  // Remove existing layers
  Object.values(tileLayers).forEach(layer => {
    mainMap.removeLayer(layer);
  });

  // Add selected layer
  if (tileLayers[type]) {
    mainMap.addLayer(tileLayers[type]);
    
    // Update active button state
    const buttons = document.querySelectorAll('.basemap-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
  }
}

// ==========================================================================
// LOGIKA INTERAKSI DASHBOARD (SIDEBAR KIRI)
// ==========================================================================
function focusStation(id) {
  activeStationId = id;
  const station = stationsData[id];
  if (!station) return;

  // 1. Geser Peta Utama ke stasiun terpilih
  if (mainMap) {
    mainMap.setView(station.center, 17, {
      animate: true,
      duration: 1
    });
  }

  // 2. Ganti kelas active pada tombol stasiun di sidebar
  const buttons = document.querySelectorAll('.station-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  const activeBtn = document.getElementById(`btn-stasiun-${id}`);
  if (activeBtn) activeBtn.classList.add('active');

  // 3. Update detail teks parameter stasiun di sidebar
  document.getElementById('detail-station-num').textContent = getRomanNumerals(id);
  document.getElementById('detail-substrate').textContent = station.parameters.substrate;
  document.getElementById('detail-vegetation').textContent = station.parameters.dominantVegetation;

  // 4. Render Skema Plot Sampling (Sesuai Sketsa 3 plot, jarak 5m)
  renderPlotSchema(station);

  // 5. Update Grafik Parameter Lingkungan (Chart.js)
  updateEnvironmentalChart(station);
}

// Mengubah angka biasa ke romawi
function getRomanNumerals(num) {
  const map = { 1: "I", 2: "II", 3: "III" };
  return map[num] || num;
}

// Menggambar skema plot dinamis mirip sketsa tangan
function renderPlotSchema(station) {
  const container = document.getElementById('plot-schema-view');
  container.innerHTML = ''; // Reset

  // Tambahkan garis horizontal penghubung dibelakang
  const line = document.createElement('div');
  line.className = 'plot-schema-line';
  container.appendChild(line);

  // Buat 3 node plot
  station.plots.forEach((plot, index) => {
    // Node Plot
    const plotNode = document.createElement('div');
    plotNode.className = 'plot-node';
    
    const circle = document.createElement('div');
    circle.className = 'plot-circle';
    circle.innerHTML = `P${index + 1}`;
    circle.title = `${plot.name}: ${plot.size}`;
    
    const span = document.createElement('span');
    span.textContent = '3x3m';

    plotNode.appendChild(circle);
    plotNode.appendChild(span);
    container.appendChild(plotNode);

    // Tambah visual jarak 5m di antara plot
    if (index < station.plots.length - 1) {
      const spacingNode = document.createElement('div');
      spacingNode.className = 'plot-spacing';
      spacingNode.textContent = '5 m';
      container.appendChild(spacingNode);
    }
  });
}

// Menggambar Grafik Parameter Lingkungan / Densitas Mangrove
function updateEnvironmentalChart(station) {
  const ctx = document.getElementById('environmentalChart').getContext('2d');
  
  // Data spesies mangrove di stasiun
  const speciesLabels = Object.keys(station.parameters.species);
  const speciesValues = Object.values(station.parameters.species);
  
  if (currentChart) {
    currentChart.destroy(); // Hancurkan chart lama agar tidak bertumpuk
  }

  currentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: speciesLabels,
      datasets: [
        {
          label: 'Jumlah Mangrove / Plot',
          data: speciesValues,
          backgroundColor: [
            'rgba(16, 185, 129, 0.75)',  // Emerald
            'rgba(59, 130, 246, 0.75)',  // Blue
            'rgba(249, 115, 22, 0.75)'   // Orange
          ],
          borderColor: [
            '#10b981',
            '#3b82f6',
            '#f97316'
          ],
          borderWidth: 1.5,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Sembunyikan label legend bawaan
        },
        title: {
          display: true,
          text: `Kerapatan Jenis Mangrove - Stasiun ${getRomanNumerals(station.id)}`,
          color: '#f8fafc',
          font: {
            family: 'Outfit',
            size: 13,
            weight: '600'
          }
        }
      },
      scales: {
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.06)'
          },
          ticks: {
            color: '#94a3b8',
            font: { size: 10 }
          },
          suggestedMax: 25
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#94a3b8',
            font: { size: 10 }
          }
        }
      }
    }
  });
}

// Sync form inputs to print text elements
function setupPrintInputListeners() {
  const input1 = document.getElementById('input-peneliti-1');
  const input2 = document.getElementById('input-peneliti-2');
  const inputInstansi = document.getElementById('input-instansi');

  const lbl1 = document.getElementById('print-lbl-author-1');
  const lbl2 = document.getElementById('print-lbl-author-2');
  const lblInstansi = document.getElementById('print-lbl-instansi');

  // Initial Sync
  lbl1.textContent = input1.value;
  lbl2.textContent = input2.value;
  lblInstansi.textContent = inputInstansi.value;

  // Real-time update listeners
  input1.addEventListener('input', () => { lbl1.textContent = input1.value; });
  input2.addEventListener('input', () => { lbl2.textContent = input2.value; });
  inputInstansi.addEventListener('input', () => { lblInstansi.textContent = inputInstansi.value; });
}

// ==========================================================================
// LOGIKA CETAK LAYOUT KARTOGRAFI (PRINT MODE)
// ==========================================================================
function triggerPrint() {
  // 1. Aktifkan mode cetak di Body class
  document.body.classList.add('print-mode-active');
  
  // Ambil state peta utama untuk disinkronkan ke peta cetak
  const currentCenter = mainMap.getCenter();
  const currentZoom = mainMap.getZoom();

  // 2. Inisialisasi Peta Cetak Utama (Jika belum dibuat)
  setTimeout(() => {
    if (!printMap) {
      printMap = L.map('print-map-inner', {
        center: currentCenter,
        zoom: currentZoom,
        zoomControl: false,
        attributionControl: false
      });

      // Tambahkan tile layer satelit resolusi tinggi esri untuk cetak
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(printMap);
      
      // Gambarkan layer stasiun dan plot
      drawStationsOnMap(printMap);
    } else {
      // Jika sudah ada, sinkronkan posisinya saja
      printMap.setView(currentCenter, currentZoom);
    }

    // 3. Inisialisasi Peta Inset Pulau Lombok (Jika belum dibuat)
    if (!insetMap) {
      // Koordinat tengah Pulau Lombok
      insetMap = L.map('print-inset-map', {
        center: [-8.63, 116.32],
        zoom: 8.2,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false
      });

      // Tile layer basemap sederhana untuk inset
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(insetMap);

      // Gambar Marker merah/lingkaran penanda lokasi Teluk Jor di Lombok
      L.circleMarker([-8.8066, 116.4889], {
        radius: 8,
        fillColor: "red",
        color: "black",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(insetMap);
    }

    // Panggil invalidateSize() dan reset view pada setTimeout berikutnya agar Leaflet sempat mendeteksi ukuran baru container
    setTimeout(() => {
      printMap.invalidateSize();
      printMap.setView(currentCenter, currentZoom);

      insetMap.invalidateSize();
      insetMap.setView([-8.63, 116.32], 8.2);
    }, 150);

    // Berikan jeda kecil agar map rendering tiles selesai sebelum pop up print browser
    setTimeout(() => {
      window.print();
    }, 850);

  }, 100);
}

// Menutup Mode Cetak kembali ke dashboard digital
function closePrintMode() {
  document.body.classList.remove('print-mode-active');
  // Refresh layout peta utama untuk mengantisipasi glitch resizing
  setTimeout(() => {
    mainMap.invalidateSize();
  }, 200);
}

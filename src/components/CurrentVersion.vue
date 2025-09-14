<template>
  <div class="page-container">
    <aside class="history-panel">
      <div class="panel-header">
        <h2 class="panel-title">История загрузок</h2>
      </div>
      <div class="line"></div>
      <ul class="history-list">
        <li v-for="item in history.items" :key="item.filename" class="history-item" @click="selectHistoryItem(item)">
          <div class="history-thumbnail">
            
            <img :src="`data:image/png;base64,${item.thumbnail_base64}`" class="thumbnail-img" />
          </div>
          <div class="history-details">
            <div class="history-name">{{ item.filename }}</div>
            <div style="width: fit-content; padding: 5px 10px;" :style="{ 'backgroundColor': colors[item.response.status]?.bg, 'color': colors[item.response.status]?.text }">
              {{ colors[item.response.status]?.ru }}
            </div>
          </div>
        </li>
        <!-- <button class="new-upload-btn" @click="loadMore">Загрузить ещё</button> -->
      </ul>
    </aside>

    <main class="main-panel">
      <div class="upload-section">
        <div v-if="!currentImage.filename" class="upload-box" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileSelect">
          <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="file-input" />
          <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p class="upload-text">Перетащите фото сюда или <span class="upload-link">выберите файл</span></p>
        </div>
        
        <div v-if="currentImage.filename" class="result-box">
          <div class="image-preview-container">
            <img :key="currentImage.filename" :src="currentFile" alt="Uploaded" class="preview-img" />
          </div>
          
          <div class="result-details">
            <h3 class="details-title">Результаты анализа</h3>
            <div class="result-row">
              <span class="result-label">Название:</span>
              <span class="result-value">{{ currentImage.filename }}</span>
            </div>
            <div class="result-row">
              <span class="result-label">Статус:</span>
              <span :style="{ 'backgroundColor': colors[currentImage.response.status]?.bg, 'color': colors[currentImage.response.status]?.text }">{{ colors[currentImage.response.status]?.ru }}</span>
            </div>
            <button class="new-upload-btn" @click="resetUpload">Загрузить новый</button>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div v-if="isLoading" class="loader-overlay">
    <div class="loader"></div>
  </div>
</template>

<script setup lang="ts">
import { api } from '@/service/api';
import type { IHistoryList, TStatusColors } from '@/types/general';
import { onMounted, ref } from 'vue';

const defaultColors: TStatusColors = {
  clean_car: { bg: "#e6f7e9", text: "#28a745" },
  damaged_dirty_car: { bg: "#ffe0cc", text: "#ff6600" },
  damaged_car: { bg: "#ffe8e8", text: "#dc3545" },
  dirty_car: { bg: "#f9f5d7", text: "#b58900" },
  unrecognized: { bg: "#f0f0f0", text: "#6b7280" }
}

const history = ref<{
  count: number;
  items: IHistoryList[];
}>({
  count: 1 as number,
  items: [] as IHistoryList[]
});

const isLoading = ref(false);
const colors = ref({})

//coo
const pagination = ref({
  page: 1,
  count: 20
})

onMounted(async () => {
  isLoading.value = true;
  const statusJson = await api.getStatuses()

  const statusJsonObject = statusJson.reduce((acc, item) => {
    acc[item.code] = item.name
    return acc
  }, {} as Record<string, string>)

  const empty = { bg: "#fff", text: "#000" }

  colors.value = statusJson.reduce((acc: TStatusColors, item) => {
    const obj = {ru: statusJsonObject[item.code], ...defaultColors[item.code] || empty }
    acc[item.code] = obj

    return acc
  }, {} as TStatusColors)

  history.value = await api.getHistory(pagination.value);
  isLoading.value = false;
});

const currentImage = ref({
  filename: "",
  response: { 
    status: "clean_car", 
    level: 1 
  },
});

const currentFile = ref<any>(null);
const fileInput = ref<any>(null);

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    processFile(file);
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  processFile(file)

};

const triggerFileSelect = () => {
  fileInput.value.click();
};

const processFile = async  (file) => {
  const res = await api.uploadFile(file);
  currentImage.value.response.status = res.status;
  currentImage.value.response.level = res.level;
  currentImage.value.filename = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    currentFile.value = e.target.result
  };
  reader.readAsDataURL(file);
  
  history.value = await api.getHistory({ page: 1, count: 20 });
};

const selectHistoryItem = (item) => {
  currentImage.value = item;
  currentFile.value = `data:image/png;base64,${item.thumbnail_base64}`;
  console.log(item)
};

const resetUpload = () => {
  currentImage.value = {
    filename: "",
    response: { status: "clean_car", level: 1 },
  };
  currentFile.value = null;
};

// const loadMore = async () => {
//   pagination.value.page += 1;
//   const newHistory = await api.getHistory(pagination.value);
//   history.value.items = [...history.value.items, ...newHistory.items];
// };
</script>

<style>
/* Глобальный лоадер */
.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.page-container {
  position: relative;
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #f7f9fc, #eef2f8);
  font-family: 'Inter', sans-serif;
  color: #333;
}

/* Боковая панель */
.history-panel {
  width: 450px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fff;
  border-right: 1px solid #e6ebf5;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.04);
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 0.3s ease;
}
.panel-header {
  position: sticky;
  top: 0;
  background: #fafbfc;
  border-radius: 12px;
  padding: 10px 20px;
  border: 1px solid transparent;
  z-index: 2;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);   */
}
.panel-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #4754d3;
  letter-spacing: -0.5px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  background: #fafbfc;
  border: 1px solid transparent;
  transition: all 0.25s ease-in-out;
}

.history-item:hover {
  background: #f0f4ff;
  border: 1px solid #d5dbff;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(71, 84, 211, 0.08);
}

.history-name {
  font-weight: 600;
  font-size: 15px;
  color: #444;
  margin-bottom: 10px;

  max-width: 250px;      /* ограничь ширину контейнера */
  white-space: nowrap;   /* запрет переноса строк */
  overflow: hidden;      /* скрывает лишний текст */
  text-overflow: ellipsis; /* ставит "..." */
}

/* Статусы */
.status-готов {
  background-color: #e6f7e9;
  color: #28a745;
}

.status-ошибка {
  background-color: #ffe8e8;
  color: #dc3545;
}

.status-в-обработке {
  background-color: #e8f5ff;
  color: #007bff;
}

/* Основная панель */
.main-panel {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.upload-box {
  background: #fff;
  border: 2px dashed #c5cce5;
  border-radius: 20px;
  padding: 60px 30px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.upload-box:hover {
  border-color: #4754d3;
  box-shadow: 0 8px 20px rgba(71, 84, 211, 0.1);
}

.upload-icon {
  width: 60px;
  height: 60px;
  color: #4754d3;
  opacity: 0.8;
  transition: transform 0.3s;
}

.upload-box:hover .upload-icon {
  transform: scale(1.1);
  opacity: 1;
}

.upload-text {
  margin-top: 15px;
  font-size: 17px;
  color: #555;
}

.upload-link {
  color: #4754d3;
  font-weight: 700;
  text-decoration: underline;
}

/* Результаты */
/* .result-box {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.07);
  display: flex;
  gap: 30px;
  align-items: flex-start;
  animation: fadeIn 0.4s ease-in-out;
}

.image-preview-container {
  width: 50%;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
} */

.result-details {
  flex-grow: 1;
}

.details-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #4754d3;
}

.result-row {
  display: flex;
  gap: 15px;
  margin-bottom: 12px;
  font-size: 15px;
}

.result-label {
  font-weight: 500;
  color: #666;
  min-width: 100px;
}

.result-value {
  font-weight: 600;
  color: #333;
    max-width: 250px;      /* ограничь ширину контейнера */
  white-space: nowrap;   /* запрет переноса строк */
  overflow: hidden;      /* скрывает лишний текст */
  text-overflow: ellipsis; /* ставит "..." */
}
.file-input {
  display: none;
}
.result-box {
  background-color: #fff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  /* display: flex; */
  gap: 30px;
  align-items: flex-start;
}

.image-preview-container {
  /* flex-shrink: 0; */
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.preview-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.result-details {
  flex-grow: 1;
  padding: 10px 0;
}

.details-title {
  font-size: 24px;
  font-weight: 600;
}

.result-row {
  display: flex;
  gap: 15px;
  margin-bottom: 12px;
}

.result-label {
  font-weight: 500;
  color: #666;
  width: 100px;
  flex-shrink: 0;
}

.result-value {
  flex-grow: 1;
  font-weight: 600;
}

.result-status {
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
}

.new-upload-btn {
  background-color: #4754d3;
  color: #fff;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.new-upload-btn:hover {
  background-color: #3b45b5;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thumbnail-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
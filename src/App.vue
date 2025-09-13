<template>
  <div class="wrap">
    <div class="top-card">
      <!-- Левая часть -->
      <div class="left">
        <div class="title-row">
          <div class="logo">CS</div>
          <div>
            <div class="title">Car State Checker</div>
            <div class="subtitle">Загрузите фото — модель проверит чистоту и повреждения</div>
          </div>
        </div>

        <div class="uploader">
          <label class="dropzone" for="fileInput">
            <div class="drop-ico">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v10M8 7l4-4 4 4M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                      stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <div class="drop-text">
                Перетащите фото или <strong>выберите</strong>
              </div>
              <div class="drop-sub">Поддержка: JPG, PNG</div>
            </div>
          </label>

          <div class="controls">
            <input id="fileInput" type="file" accept="image/*" hidden @change="onFileChange"/>
            <button class="btn" :disabled="!file" @click="analyze">Анализировать</button>
            <button class="btn ghost" @click="clear">Очистить</button>
          </div>
        </div>
      </div>

      <!-- Правая часть -->
      <div class="right">
        <div class="preview">
          <img v-if="previewUrl" :src="previewUrl" alt="Превью" />
          <div v-else class="placeholder">Превью фото</div>
        </div>

        <div class="result-block">
          <div class="meta">
            <div>Чистота: <small>{{ cleanLabel }}</small></div>
            <div>Целостность: <small>{{ damageLabel }}</small></div>
          </div>
          <!-- <div class="badges">
            <span v-if="result.clean"
                  class="badge"
                  :class="result.clean === 'clean' ? 'ok' : 'bad'">
              {{ result.clean === 'clean' ? 'ЧИСТО' : 'ГРЯЗНО' }}
            </span>
            <span v-if="result.damage"
                  class="badge"
                  :class="result.damage === 'ok' ? 'ok' : 'bad'">
              {{ result.damage === 'ok' ? 'ЦЕЛОЕ' : 'ПОВРЕЖДЕНИЕ' }}
            </span>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const file = ref<File | null>(null);
const previewUrl = ref<string>("");
const result = ref<{ clean: string; damage: string }>({ clean: "", damage: "" });

const onFileChange = (e: Event) => {
  const f = (e.target as HTMLInputElement).files[0];
  if (!f) return;
  file.value = f;
  previewUrl.value = URL.createObjectURL(f);
  result.value = { clean: "", damage: "" };
};

const analyze = () => {
  if (!file.value) return;
  // Симуляция — тут можно заменить на API-запрос
  setTimeout(() => {
    result.value.clean = Math.random() > 0.5 ? "clean" : "dirty";
    result.value.damage = Math.random() > 0.6 ? "ok" : "damaged";
  }, 700);
};

const clear = () => {
  file.value = null;
  previewUrl.value = "";
  result.value = { clean: "", damage: "" };
};

const cleanLabel = computed(() =>
  result.value.clean === "clean" ? "Чистый" :
  result.value.clean === "dirty" ? "Грязный" : "— не определено"
);

const damageLabel = computed(() =>
  result.value.damage === "ok" ? "Целый" :
  result.value.damage === "damaged" ? "Битый" : "— не определено"
);
</script>

<style scoped>
:root {
  --bg: #f5f6fa;
  --card: #ffffff;
  --muted: #6b7280;
  --accent: #6366f1; /* фиолетовый */
  --accent-dark: #4338ca;
  --success: #16a34a;
  --danger: #dc2626;
  --radius: 14px;
  --shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.wrap {
  max-width: 980px;
  margin: 36px auto;
  padding: 16px;
}

.top-card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: flex;
  gap: 20px;
  padding: 20px;
}

.left {
  flex: 1;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  display: grid;
  place-items: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.subtitle {
  font-size: 13px;
  color: var(--muted);
}

.uploader {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.dropzone {
  flex: 1;
  border: 2px dashed #e5e7eb;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
  transition: 0.2s;
}

.dropzone:hover {
  background: #f9fafb;
}

.drop-ico {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(99, 102, 241, 0.15);
  color: var(--accent-dark);
}

.drop-text {
  font-size: 14px;
  color: #111827;
}

.drop-sub {
  font-size: 12px;
  color: var(--muted);
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 9px 14px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn:hover:not(:disabled) {
  background: var(--accent-dark);
}

.btn:disabled {
  background: #c7d2fe;
  cursor: not-allowed;
}

.btn.ghost {
  background: transparent;
  color: var(--accent-dark);
  border: 1px solid #c7d2fe;
}

.right {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview {
  height: 180px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.placeholder {
  font-size: 14px;
  color: var(--muted);
}

.result-block {
  border-radius: 10px;
  padding: 12px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.meta {
  font-size: 13px;
  color: #111827;
}

.meta small {
  display: block;
  font-size: 12px;
  color: var(--muted);
}

.badges {
  display: flex;
  gap: 6px;
}

.badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 12px;
}

.badge.ok {
  background: rgba(22, 163, 74, 0.15);
  color: var(--success);
}

.badge.bad {
  background: rgba(220, 38, 38, 0.15);
  color: var(--danger);
}

@media (max-width: 760px) {
  .top-card {
    flex-direction: column;
  }
  .right {
    width: 100%;
  }
  .controls {
    flex-direction: row;
  }
}
</style>

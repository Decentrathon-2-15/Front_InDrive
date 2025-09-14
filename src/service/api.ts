// services/upload.js
import { request } from "./request";

export const api = {
  uploadFile(file: any) {
    const formData = new FormData();
    formData.append("file", file);
    return request({
      url: "check",
      method: "POST",
      data: formData,
    });
  },

  getHistory(params: Record<string, string | number>) {
    return request({
      url: "history",
      method: "GET",
      params,
    });
  },

  getHistoryById(id: number) {
    return request({
      url: `history/${id}`,
      method: "GET",
    });
  },

  getHistoryImageById(id: number) {
    return request({
      url: `history/${id}/image`,
      method: "GET",
    });
  },

  getStatusesDirt() {
    return request({
      url: "statuses/dirt",
      method: "GET",
    });
  },
  getStatusesDamage() {
    return request({
      url: "statuses/damage",
      method: "GET",
    });
  }
};
// ─────────────────────────────────────────────────────────────────────────────
// src/services/detect.service.ts
// ─────────────────────────────────────────────────────────────────────────────

import api from "./api";
import type {
  UploadDetectResponse,
  DetectionByIdResponse,
  DetectionHistoryParams,
  DetectionHistoryResponse,
} from "@/types";

const DetectService = {
  async upload(
    file: File,
    forceReanalyze = false,
    onProgress?: (percent: number) => void
  ): Promise<UploadDetectResponse> {
    const form = new FormData();
    form.append("file", file);
    if (forceReanalyze) form.append("forceReanalyze", "true");

    const { data } = await api.post<UploadDetectResponse>(
      "/api/detect/upload",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      }
    );
    return data;
  },

  async getById(id: string): Promise<DetectionByIdResponse> {
    const { data } = await api.get<DetectionByIdResponse>(`/api/detect/${id}`);
    return data;
  },

  async getHistory(params: DetectionHistoryParams = {}): Promise<DetectionHistoryResponse> {
    const { data } = await api.get<DetectionHistoryResponse>("/api/detect/history", {
      params,
    });
    return data;
  },
};

export default DetectService;
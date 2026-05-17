/**
 * 图片上传模块 — React Query hooks
 */

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API } from "@/lib/api-endpoints";

interface UploadImageResponse {
  url: string;
  filename: string;
}

async function uploadImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return api.upload<UploadImageResponse>(API.UPLOAD.IMAGE, formData, true);
}

export function useUploadImage() {
  return useMutation({
    mutationFn: uploadImage,
  });
}

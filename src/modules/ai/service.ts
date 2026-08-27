import {
  aiManager,
  KieProvider,
  type AIFile,
  type AIManager,
  type SaveFilesFunction,
} from '@/core/ai';
import { getAllConfigs, type ConfigMap } from '@/modules/config/service';
import { getStorage } from '@/modules/storage/service';

/**
 * KIE image-to-image wiring. The API key is DB/env-driven (the admin "AI"
 * setting overrides the KIE_API_KEY env fallback), and successful result
 * images are transferred into custom storage (R2/S3) when configured.
 */
export function isKieConfigured(configs: ConfigMap): boolean {
  return Boolean(configs.kie_api_key);
}

/**
 * Transfer remote AI result files into custom storage via download-and-upload.
 * Returns undefined when storage is not configured, so the provider falls back
 * to the original remote URLs.
 */
function buildSaveFiles(): SaveFilesFunction {
  return async (files: AIFile[]): Promise<AIFile[] | undefined> => {
    const storage = await getStorage();
    if (!storage) return undefined;

    const uploaded: AIFile[] = [];
    for (const file of files) {
      if (!file.url) continue;
      const result = await storage.downloadAndUpload({
        url: file.url,
        key: file.key,
        contentType: file.contentType,
      });
      if (result.success && result.url) {
        uploaded.push({ ...file, url: result.url });
      }
    }
    return uploaded.length ? uploaded : undefined;
  };
}

/**
 * Initialize the global AI manager with the KIE image-to-image provider:
 * register it with its API key and wire result-image transfer into custom
 * storage. Idempotent — safe to call per request.
 */
export async function getAiManager(): Promise<AIManager> {
  if (!aiManager.getProvider('kie')) {
    const configs = await getAllConfigs();
    if (isKieConfigured(configs)) {
      const saveFiles = buildSaveFiles();
      aiManager.setSaveFiles(saveFiles);
      aiManager.addProvider(
        new KieProvider({
          apiKey: configs.kie_api_key,
          customStorage: true,
          saveFiles,
        }),
        true
      );
    }
  }
  return aiManager;
}

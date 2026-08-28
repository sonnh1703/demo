import { FEATURE_MAP } from './feature-map';

export interface NavSuggestion {
  label: string;
  path: string;
}

const KNOWN_PATHS = new Set(FEATURE_MAP.map((screen) => screen.path));

// Bot được yêu cầu (xem system-prompt.ts) thêm một khối ```nav [...] ``` ở
// CUỐI câu trả lời khi muốn gợi ý điều hướng. Hàm này tách khối đó ra khỏi
// nội dung hiển thị và trả về danh sách nút điều hướng hợp lệ.
const NAV_BLOCK_PATTERN = /```nav\s*([\s\S]*?)```\s*$/;

export function extractNavSuggestions(rawText: string): { text: string; suggestions: NavSuggestion[] } {
  const match = rawText.match(NAV_BLOCK_PATTERN);
  if (!match) return { text: rawText.trim(), suggestions: [] };

  const text = rawText.slice(0, match.index).trim();
  try {
    const parsed: unknown = JSON.parse(match[1].trim());
    if (!Array.isArray(parsed)) return { text, suggestions: [] };
    const suggestions = parsed.filter((item): item is NavSuggestion => {
      const candidate = item as Partial<NavSuggestion> | null;
      return (
        typeof candidate?.label === 'string' &&
        typeof candidate?.path === 'string' &&
        KNOWN_PATHS.has(candidate.path)
      );
    });
    return { text, suggestions };
  } catch {
    return { text, suggestions: [] };
  }
}

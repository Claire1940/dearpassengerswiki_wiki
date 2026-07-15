import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
	// 支持的语言列表（最终语言集合，与 languages.json 一致）
	locales: ['en', 'tr', 'ja', 'uk'],

	// 默认语言
	defaultLocale: 'en',

	// URL 前缀策略：默认语言无前缀
	localePrefix: 'as-needed',

	// 启用自动语言检测
	localeDetection: true,
})

// 导出类型
export type Locale = (typeof routing.locales)[number]

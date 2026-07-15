import type { LucideIcon } from 'lucide-react'
import {
	BookOpen,
	Rocket,
	MonitorSmartphone,
	Tag,
	Users,
	Boxes,
	PlayCircle,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'guide' -> t('nav.guide')
	path: string // URL 路径，如 '/guide'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航栏分类配置（7 个内容分类，community 已按规则删除）
// 顺序：核心攻略 → 发售信息 → 平台 → 价格 → 联机 → 特色 → 媒体
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'release', path: '/release', icon: Rocket, isContentType: true },
	{ key: 'platforms', path: '/platforms', icon: MonitorSmartphone, isContentType: true },
	{ key: 'pricing', path: '/pricing', icon: Tag, isContentType: true },
	{ key: 'multiplayer', path: '/multiplayer', icon: Users, isContentType: true },
	{ key: 'features', path: '/features', icon: Boxes, isContentType: true },
	{ key: 'media', path: '/media', icon: PlayCircle, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['guide', 'release', 'platforms', 'pricing', 'multiplayer', 'features', 'media']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}

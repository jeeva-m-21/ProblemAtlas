# Tailwind CSS Knowledge Base

## Version: Tailwind CSS 4

## Key Breaking Changes
- Tailwind CSS 4 has significant breaking changes from v3
- Uses `@tailwindcss/postcss` plugin instead of `tailwindcss` PostCSS plugin
- Configuration is different from v3

## Patterns Used in This Project
- Dark mode only (html class="dark")
- oklch color tokens
- shadcn/ui component primitives with Tailwind classes
- Utility classes for spacing, typography, layout

## Utility Classes (common patterns)
---
Note: Always verify Tailwind CSS 4 class names. Some v3 classes may have changed.
- Layout: flex, grid, container, gap-*, p-*, m-*
- Typography: text-*, font-*, leading-*, tracking-*
- Colors: bg-*, text-*, border-* (using CSS variable tokens)
- Responsive: sm:, md:, lg:, xl:
- State: hover:, focus:, active:, disabled:
- Dark: dark: prefix (but project uses dark-only theme)
- Animations: animate-*, transition-*

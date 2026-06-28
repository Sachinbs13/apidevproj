import { cn } from '../utils/cn.js';

const CHEVRON_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E";

const CHEVRON_ICON_DARK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E";

const selectBase =
  'appearance-none bg-no-repeat bg-[length:1rem_1rem] bg-[right_0.75rem_center] pl-3 pr-10 outline-none focus:ring-2 focus:ring-sky-500/20';

export function getSelectClassName(variant = 'default', className) {
  const variants = {
    default: cn(
      selectBase,
      'rounded-lg border border-slate-300 bg-white py-2 text-sm font-medium text-slate-800',
      'focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-600',
      `bg-[url("${CHEVRON_ICON}")] dark:bg-[url("${CHEVRON_ICON_DARK}")]`,
    ),
    compact: cn(
      selectBase,
      'rounded-lg border border-slate-300 bg-white py-2 text-xs font-medium text-slate-700',
      'focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-sky-600',
      `bg-[url("${CHEVRON_ICON}")] dark:bg-[url("${CHEVRON_ICON_DARK}")]`,
    ),
    dark: cn(
      selectBase,
      'rounded-lg border border-slate-700 bg-slate-900 py-2.5 text-sm text-white focus:border-sky-600',
      `bg-[url("${CHEVRON_ICON_DARK}")]`,
    ),
  };

  return cn(variants[variant] || variants.default, className);
}

export const INPUT_CLASS =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-600';

export const INPUT_CLASS_DARK =
  'w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20';

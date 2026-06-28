import Markdown from 'react-markdown';

const components = {
  h3: ({ children }) => (
    <h3 className="mt-4 text-base font-bold text-slate-900 first:mt-0 dark:text-white">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-slate-600 italic dark:text-slate-400">{children}</em>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-3 pl-5 text-sm">{children}</ol>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-2 pl-5 text-sm">{children}</ul>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed text-slate-700 dark:text-slate-300">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-sky-400 bg-sky-50/50 py-1 pl-3 text-sm italic text-slate-600 dark:bg-sky-950/20 dark:text-slate-400">
      {children}
    </blockquote>
  ),
};

function BriefDigestContent({ content }) {
  if (!content) return null;

  return (
    <div className="brief-digest max-h-[28rem] overflow-y-auto pr-1">
      <Markdown components={components}>{content}</Markdown>
    </div>
  );
}

export default BriefDigestContent;

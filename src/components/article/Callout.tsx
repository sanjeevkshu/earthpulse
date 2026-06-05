/**
 * Callout — generic icon + title + body card for use in MDX pages.
 *
 * Used in static pages (About, Contribute, etc.) to replace inline JSX grids.
 * Similar visual weight to the existing Tip / DidYouKnow / Impact components
 * but fully generic — title and icon are props, colour is neutral.
 *
 * Usage in MDX:
 * <Callout icon="🔬" title="Science-led">
 *   Every factual claim traces to a peer-reviewed source.
 * </Callout>
 */

interface CalloutProps {
  /** Emoji or short string displayed in the leading column */
  icon?: string;
  /** Bold heading above the body text */
  title?: string;
  children: React.ReactNode;
}

export default function Callout({ icon, title, children }: CalloutProps) {
  return (
    <div className="card flex gap-4 items-start my-5 not-prose">
      {icon && (
        <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">
          {icon}
        </span>
      )}
      <div>
        {title && (
          <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
            {title}
          </h3>
        )}
        <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

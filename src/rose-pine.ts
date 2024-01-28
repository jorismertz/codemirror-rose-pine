import { variants, variantKeys, roleKeys } from "@rose-pine/palette";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { tags as t } from "@lezer/highlight";

type ColorKeys = (typeof roleKeys)[number];
type VariantKeys = (typeof variantKeys)[number];
type AccentColorKeys = (typeof accentColors)[number];

interface Options {
  variant?: VariantKeys;
  accent?: AccentColorKeys;
}

const defaultVariant: VariantKeys = "main";
const defaultAccent: AccentColorKeys = "love";

const accentColors: ColorKeys[] = [
  "foam",
  "gold",
  "iris",
  "love",
  "pine",
  "rose",
];

function getColors(options?: Options) {
  const theme = variants[options?.variant ?? defaultVariant];

  const entries = Object.entries(theme.colors);
  const mapped = entries.map(([key, value]) => [key, "#" + value.hex]);
  const colors = Object.fromEntries(mapped) as Record<ColorKeys, string>;

  const accentColor = colors[options?.accent ?? defaultAccent];

  return {
    colors,
    accentColor,
  };
}

export const rosePineTheme = (options?: Options) => {
  const { colors, accentColor } = getColors(options);

  return EditorView.theme(
    {
      "&": {
        color: colors.text,
        backgroundColor: colors.base,
      },

      ".cm-content": {
        caretColor: colors.muted,
      },

      ".cm-cursor, .cm-dropCursor": { borderLeftColor: colors.highlightMed },
      "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
        { backgroundColor: colors.muted },

      ".cm-panels": { backgroundColor: colors.base, color: colors.text },
      ".cm-panels.cm-panels-top": { borderBottom: `2px solid ${colors.base}` },
      ".cm-panels.cm-panels-bottom": { borderTop: `2px solid ${colors.base}` },

      ".cm-searchMatch": {
        backgroundColor: accentColor,
      },
      ".cm-searchMatch > span": {
        color: `${colors.text} !important`,
      },
      ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: colors.highlightMed,
      },

      ".cm-activeLine": { backgroundColor: colors.surface },
      ".cm-selectionMatch": { backgroundColor: colors.highlightHigh },

      "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
        backgroundColor: colors.highlightHigh,
      },

      ".cm-gutters": {
        backgroundColor: colors.base,
        color: colors.overlay,
        border: "none",
      },

      ".cm-activeLineGutter": {
        backgroundColor: colors.overlay,
        color: colors.text,
      },

      ".cm-foldPlaceholder": {
        backgroundColor: "transparent",
        border: "none",
        color: colors.text,
      },

      ".cm-tooltip": {
        border: "none",
        backgroundColor: colors.surface,
      },
      ".cm-tooltip .cm-tooltip-arrow:before": {
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
      },
      ".cm-tooltip .cm-tooltip-arrow:after": {
        borderTopColor: colors.surface,
        borderBottomColor: colors.surface,
      },
      ".cm-tooltip-autocomplete": {
        "& > ul > li[aria-selected]": {
          backgroundColor: colors.surface,
          color: colors.overlay,
        },
      },
    },
    { dark: true }
  );
};

export const rosePineHighlightStyle = (options: Options) => {
  const { colors } = getColors(options);

  return HighlightStyle.define([
    { tag: t.keyword, color: colors.pine },
    {
      tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
      color: colors.rose,
    },
    { tag: [t.function(t.variableName), t.labelName], color: colors.rose },
    {
      tag: [t.color, t.constant(t.name), t.standard(t.name)],
      color: colors.rose,
    },
    { tag: [t.definition(t.name), t.separator], color: colors.text },
    {
      tag: [
        t.typeName,
        t.className,
        t.number,
        t.changed,
        t.annotation,
        t.modifier,
        t.self,
        t.namespace,
      ],
      color: colors.pine,
    },
    {
      tag: [
        t.operator,
        t.operatorKeyword,
        t.url,
        t.escape,
        t.regexp,
        t.link,
        t.special(t.string),
      ],
      color: colors.pine,
    },

    { tag: [t.meta, t.comment], color: colors.muted },
    { tag: t.strong, fontWeight: "bold" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.strikethrough, textDecoration: "line-through" },
    { tag: t.link, color: colors.muted, textDecoration: "underline" },
    { tag: t.heading, fontWeight: "bold", color: colors.iris },
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: colors.rose },
    {
      tag: [t.processingInstruction, t.string, t.inserted],
      color: colors.gold,
    },
    { tag: t.invalid, color: colors.text },
  ]);
};

export function rosePine(options: Options): Extension {
  return [
    rosePineTheme(options),
    syntaxHighlighting(rosePineHighlightStyle(options)),
  ];
}

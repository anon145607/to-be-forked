import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    citation: {
      insertCitation: (text: string) => ReturnType;
    };
  }
}

export const Citation = Node.create({
  name: 'citation',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      text: {
        default: '',
        parseHTML: (el) => decodeURIComponent(el.getAttribute('data-text') || ''),
        renderHTML: (attrs) => ({ 'data-text': encodeURIComponent(attrs.text) }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'citation' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['citation', mergeAttributes(HTMLAttributes), '📎'];
  },

  addCommands() {
    return {
      insertCitation:
        (text: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { text },
          });
        },
    };
  },
});

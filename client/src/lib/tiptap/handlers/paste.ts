import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

export const PasteHandler = Extension.create({
    name: 'pasteHandler',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('pasteHandler'),
                props: {
                    handlePaste: (view, event) => {
                        if (!event.clipboardData) {
                            return false;
                        }

                        const text = event.clipboardData.getData('text/plain');

                        if (text) {
                            event.preventDefault();

                            const cleanText = text
                                .replace(/\r?\n|\r/g, ' ')
                                .replace(/\s+/g, ' ')
                                .trim();

                            if (cleanText) {
                                const { tr } = view.state;
                                tr.insertText(cleanText);
                                view.dispatch(tr);
                            }

                            return true;
                        }

                        return false;
                    },

                    transformPastedHTML(html: string) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = html;

                        const blockElements = tempDiv.querySelectorAll(
                            'div, p, br, h1, h2, h3, h4, h5, h6'
                        );
                        blockElements.forEach((el) => {
                            if (el.tagName === 'BR') {
                                el.remove();
                            } else {
                                const textNode = document.createTextNode(
                                    el.textContent || ''
                                );
                                el.parentNode?.replaceChild(textNode, el);
                            }
                        });

                        let cleanHtml = tempDiv.innerHTML;

                        cleanHtml = cleanHtml
                            .replace(/<[^>]*><\/[^>]*>/g, '')
                            .replace(/\s+/g, ' ')
                            .trim();

                        if (cleanHtml && !cleanHtml.includes('<')) {
                            cleanHtml = `<span>${cleanHtml}</span>`;
                        }

                        return cleanHtml || html;
                    },

                    transformPastedText(text: string) {
                        return text
                            .replace(/\r?\n|\r/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();
                    },
                },
            }),
        ];
    },
});

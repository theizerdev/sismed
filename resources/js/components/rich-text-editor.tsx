import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean'],
    ],
};

const formats = ['bold', 'italic', 'underline', 'list'];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value = '',
    onChange,
    placeholder = 'Escriba aquí...',
    className = '',
}) => {
    const [mounted, setMounted] = useState(false);
    const [QuillComponent, setQuillComponent] = useState<any>(null);

    useEffect(() => {
        // Carga dinámica de Quill solo en el cliente para total compatibilidad SSR
        if (typeof window !== 'undefined') {
            Promise.all([
                import('react-quill-new'),
                // @ts-ignore
                import('react-quill-new/dist/quill.snow.css'),
            ])
                .then(([quillModule]) => {
                    setQuillComponent(() => quillModule.default);
                    setMounted(true);
                })
                .catch((err) => {
                    console.error('Error cargando Quill editor:', err);
                    setMounted(true);
                });
        }
    }, []);

    // Fallback para SSR y antes de montar en cliente
    if (!mounted || !QuillComponent) {
        return (
            <div className={`rich-text-editor-container ${className}`}>
                <Textarea
                    value={value ? value.replace(/<[^>]*>?/gm, '') : ''}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    placeholder={placeholder}
                    className="min-h-[120px] resize-y rounded-xl border-border bg-background"
                />
            </div>
        );
    }

    const ReactQuill = QuillComponent;

    return (
        <div className={`rich-text-editor-container ${className}`}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={(content: string) => {
                    const cleaned = content === '<p><br></p>' ? '' : content;
                    if (onChange) {
                        onChange(cleaned);
                    }
                }}
                placeholder={placeholder}
                modules={modules}
                formats={formats}
            />
        </div>
    );
};

export default RichTextEditor;

/**
 * 轻量级富文本编辑器 — Tiptap
 * 支持：加粗/斜体/标题/列表/引用/代码块/图片/链接 + 图片上传
 */

"use client";

import { useCallback, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExtension from "@tiptap/extension-link";
import {
  Bold, Italic, Heading2, List, ListOrdered,
  ImageIcon, Link, Loader2, Quote, Code2,
} from "lucide-react";

interface RichEditorProps {
  content: string;
  onChange: (html: string, text: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export function RichEditor({ content, onChange, placeholder, onImageUpload }: RichEditorProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
        codeBlock: {
          HTMLAttributes: { class: "editor-code-block" },
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || "详细描述你的体验...",
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getText());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] rounded-xl border border-border bg-white px-4 py-3 text-[15px] leading-relaxed focus-within:outline-none focus-within:ring-2 focus-within:ring-ring " +
          // code block — 浅色风格，与详情页 prose 一致
          "[&_pre]:bg-slate-50 [&_pre]:text-slate-700 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-slate-200 " +
          "[&_pre_code]:text-[13px] [&_pre_code]:font-mono [&_pre_code]:leading-relaxed [&_pre_code]:text-slate-700",
      },
    },
    immediatelyRender: false,
  });

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor || !onImageUpload) return;
    setUploading(true);
    try {
      const url = await onImageUpload(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      // handled by caller
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [editor, onImageUpload]);

  const handleAddLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("输入链接地址");
    if (url) {
      const safe = url.trim();
      if (/^(https?|mailto):/i.test(safe)) {
        editor.chain().focus().setLink({ href: safe }).run();
      }
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="space-y-1.5">
      {/* 工具栏 */}
      <div className="flex items-center gap-0.5 rounded-xl border border-border bg-secondary/50 p-1 flex-wrap">
        <ToolBtn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="加粗"
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="斜体"
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolBtn>
        <div className="mx-0.5 h-4 w-px bg-border" />
        <ToolBtn
          active={editor.isActive("heading")}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="标题"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="无序列表"
        >
          <List className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="有序列表"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="引用"
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="代码块"
        >
          <Code2 className="h-3.5 w-3.5" />
        </ToolBtn>
        <div className="mx-0.5 h-4 w-px bg-border" />

        {/* 图片上传 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="absolute h-0 w-0 overflow-hidden opacity-0"
          onChange={handleFileChange}
        />
        <ToolBtn
          active={false}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !onImageUpload}
          title="插入图片"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
        </ToolBtn>

        <ToolBtn
          active={editor.isActive("link")}
          onClick={handleAddLink}
          title="插入链接"
        >
          <Link className="h-3.5 w-3.5" />
        </ToolBtn>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolBtn({
  active,
  onClick,
  title,
  children,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-white hover:text-foreground"
      } disabled:opacity-50`}
    >
      {children}
    </button>
  );
}

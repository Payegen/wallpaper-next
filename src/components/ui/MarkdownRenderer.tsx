'use client';

import React, { useState } from 'react';
import { Copy, Check, ZoomIn, X } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

// 图片模态框组件
function ImageModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
      >
        <X size={24} />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// 图片组件（带点击放大功能）
function MarkdownImage({ src, alt }: { src: string; alt: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <figure className="my-6 group relative">
        <div className="relative overflow-hidden rounded-lg border border-white/10">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto cursor-pointer transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onClick={() => setShowModal(true)}
          />
          {/* 悬停遮罩 */}
          <div 
            className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <ZoomIn 
              size={32} 
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
        {alt && (
          <figcaption className="text-center text-sm text-gray-500 mt-2">
            {alt}
          </figcaption>
        )}
      </figure>

      {/* 图片模态框 */}
      {showModal && (
        <ImageModal 
          src={src} 
          alt={alt} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}

// 代码高亮组件
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        {language && (
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
          title="复制代码"
        >
          {copied ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} className="text-gray-400" />
          )}
        </button>
      </div>
      <pre className="bg-gray-900/80 border border-white/10 rounded-lg p-4 pt-10 overflow-x-auto">
        <code className="text-sm font-mono text-gray-300">{code}</code>
      </pre>
    </div>
  );
}

// 内联代码
function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-gray-800/50 border border-white/10 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  );
}

// 引用块
function BlockQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-4 border-purple-500 pl-4 my-4 bg-purple-500/5 py-2 rounded-r">
      <div className="text-gray-300 italic">{children}</div>
    </blockquote>
  );
}

// 表格
function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border-collapse border border-white/10">
        {children}
      </table>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-white/5">{children}</thead>;
}

function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-white/10">{children}</tr>;
}

function TableCell({ children, isHeader }: { children: React.ReactNode; isHeader?: boolean }) {
  const Tag = isHeader ? 'th' : 'td';
  return (
    <Tag className={`px-4 py-2 text-left ${isHeader ? 'font-semibold text-white' : 'text-gray-300'}`}>
      {children}
    </Tag>
  );
}

// 主渲染器
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // 空行
      if (!line.trim()) {
        i++;
        continue;
      }

      // 代码块
      if (line.startsWith('```')) {
        const language = line.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        
        elements.push(
          <CodeBlock key={i} code={codeLines.join('\n')} language={language} />
        );
        i++;
        continue;
      }

      // 标题
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-4xl font-bold mt-8 mb-4 text-white">
            {parseInline(line.slice(2))}
          </h1>
        );
        i++;
        continue;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-2xl font-semibold mt-6 mb-3 text-white">
            {parseInline(line.slice(3))}
          </h2>
        );
        i++;
        continue;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-xl font-medium mt-4 mb-2 text-white">
            {parseInline(line.slice(4))}
          </h3>
        );
        i++;
        continue;
      }

      if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={i} className="text-lg font-medium mt-3 mb-2 text-white">
            {parseInline(line.slice(5))}
          </h4>
        );
        i++;
        continue;
      }

      // 引用块
      if (line.startsWith('> ')) {
        elements.push(
          <BlockQuote key={i}>
            {parseInline(line.slice(2))}
          </BlockQuote>
        );
        i++;
        continue;
      }

      // 分割线
      if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
        elements.push(<hr key={i} className="my-8 border-white/10" />);
        i++;
        continue;
      }

      // 无序列表
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const listItems: React.ReactNode[] = [];
        
        while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
          listItems.push(
            <li key={i} className="ml-6 text-gray-300 list-disc mb-1">
              {parseInline(lines[i].slice(2))}
            </li>
          );
          i++;
        }
        
        elements.push(<ul key={i - listItems.length}>{listItems}</ul>);
        continue;
      }

      // 有序列表
      if (/^\d+\.\s/.test(line)) {
        const listItems: React.ReactNode[] = [];
        
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          const content = lines[i].replace(/^\d+\.\s/, '');
          listItems.push(
            <li key={i} className="ml-6 text-gray-300 list-decimal mb-1">
              {parseInline(content)}
            </li>
          );
          i++;
        }
        
        elements.push(<ol key={i - listItems.length}>{listItems}</ol>);
        continue;
      }

      // 表格
      if (line.startsWith('|')) {
        const tableRows: string[][] = [];
        
        while (i < lines.length && lines[i].startsWith('|')) {
          const cells = lines[i]
            .split('|')
            .filter(cell => cell.trim())
            .map(cell => cell.trim());
          
          // 跳过分隔行
          if (!cells.every(cell => /^[-:]+$/.test(cell))) {
            tableRows.push(cells);
          }
          i++;
        }

        if (tableRows.length > 0) {
          const [headerRow, ...bodyRows] = tableRows;
          elements.push(
            <Table key={i - tableRows.length}>
              <TableHead>
                <TableRow>
                  {headerRow.map((cell, idx) => (
                    <TableCell key={idx} isHeader>{parseInline(cell)}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {bodyRows.map((row, rowIdx) => (
                  <TableRow key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <TableCell key={cellIdx}>{parseInline(cell)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          );
        }
        continue;
      }

      // 独立图片
      const imgMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch && line.trim() === imgMatch[0]) {
        elements.push(
          <MarkdownImage key={i} src={imgMatch[2]} alt={imgMatch[1]} />
        );
        i++;
        continue;
      }

      // 普通段落
      elements.push(
        <p key={i} className="text-gray-300 leading-relaxed mb-4">
          {parseInline(line)}
        </p>
      );
      i++;
    }

    return elements;
  };

  // 内联元素解析（加粗、斜体、代码、链接、图片）
  const parseInline = (text: string): React.ReactNode => {
    // 处理图片
    const imgMatch = text.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      const parts = text.split(imgMatch[0]);
      return (
        <>
          {parts[0] && parseInline(parts[0])}
          <img 
            src={imgMatch[2]} 
            alt={imgMatch[1]} 
            className="inline-block max-w-full h-auto rounded max-h-96 my-2" 
          />
          {parts[1] && parseInline(parts[1])}
        </>
      );
    }

    // 处理链接
    const linkMatch = text.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const parts = text.split(linkMatch[0]);
      return (
        <>
          {parts[0] && parseInline(parts[0])}
          <a
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {linkMatch[1]}
          </a>
          {parts[1] && parseInline(parts[1])}
        </>
      );
    }

    // 处理内联代码
    const codeMatch = text.match(/`([^`]+)`/);
    if (codeMatch) {
      const parts = text.split(codeMatch[0]);
      return (
        <>
          {parts[0] && parseInline(parts[0])}
          <InlineCode>{codeMatch[1]}</InlineCode>
          {parts[1] && parseInline(parts[1])}
        </>
      );
    }

    // 处理加粗
    const boldMatch = text.match(/\*\*([^*]+)\*\*/);
    if (boldMatch) {
      const parts = text.split(boldMatch[0]);
      return (
        <>
          {parts[0] && parseInline(parts[0])}
          <strong className="font-semibold text-white">{boldMatch[1]}</strong>
          {parts[1] && parseInline(parts[1])}
        </>
      );
    }

    // 处理斜体
    const italicMatch = text.match(/\*([^*]+)\*/);
    if (italicMatch) {
      const parts = text.split(italicMatch[0]);
      return (
        <>
          {parts[0] && parseInline(parts[0])}
          <em className="italic">{italicMatch[1]}</em>
          {parts[1] && parseInline(parts[1])}
        </>
      );
    }

    return text;
  };

  return (
    <div className="markdown-content">
      {parseMarkdown(content)}
    </div>
  );
}

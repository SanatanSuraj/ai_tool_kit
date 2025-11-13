"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon, PencilSquareIcon, ClipboardIcon, CodeBracketIcon, CheckIcon } from "@heroicons/react/24/outline";
import PopularTools from "@/components/PopularTools";
import Footer from '@/components/Footer';
import { getCategoryPath } from '@/utils/getCategoryPath';

export default function MarkdownEditorPage() {
  const pathname = usePathname();
  const categoryPath = getCategoryPath(pathname);
  const [markdown, setMarkdown] = useState("");
  const [preview, setPreview] = useState("");
  const [activeTab, setActiveTab] = useState("edit"); // 'edit' or 'preview'
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  
  // Simple markdown to HTML converter
  // This is a simplified version - in a real app, you would use a library like marked or remark
  const convertMarkdownToHtml = (markdown: string): string => {
    if (!markdown) return "";
    
    let html = markdown;
    
    // Handle headings (h1 to h6)
    html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Handle bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Handle italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Handle code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Handle inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Handle horizontal rule
    html = html.replace(/^\s*---\s*$/gm, '<hr>');
    
    // Handle blockquotes
    html = html.replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // Handle unordered lists
    html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
    html = html.replace(/^\- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/^\+ (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
    
    // Handle ordered lists
    html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n)+/g, '<ol>$&</ol>');
    
    // Handle links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Handle images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">');
    
    // Handle paragraphs
    html = html.replace(/^\s*(\n)?(.+)/gm, function(m) {
      return /^<(\/)?(h[1-6]|[uo]l|li|blockquote|pre|hr)/.test(m) ? m : '<p>'+m+'</p>';
    });
    
    // Remove empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    
    // Handle line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
  };
  
  // Update preview when markdown changes
  useEffect(() => {
    setPreview(convertMarkdownToHtml(markdown));
  }, [markdown]);
  
  // Insert markdown syntax at cursor position
  const insertMarkdown = (syntax: string, placeholder = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const beforeText = markdown.substring(0, start);
    const afterText = markdown.substring(end);
    
    let newText;
    if (selectedText) {
      // If text is selected, wrap it with the syntax
      newText = beforeText + syntax.replace(placeholder, selectedText) + afterText;
    } else {
      // If no text is selected, insert the syntax with placeholder
      newText = beforeText + syntax + afterText;
    }
    
    setMarkdown(newText);
    
    // Focus back on the textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + syntax.indexOf(placeholder) + (selectedText ? selectedText.length : 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  // Handle copy to clipboard
  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    } catch (err) {
      console.error("Failed to copy markdown:", err);
    }
  };
  
  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(preview);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } catch (err) {
      console.error("Failed to copy HTML:", err);
    }
  };
  
  // Sample markdown text for users to start with
  const handleLoadSample = () => {
    setMarkdown(`# Markdown Editor Sample

This is a **bold text** and this is an *italic text*.

## Lists

### Unordered List
* Item 1
* Item 2
* Item 3

### Ordered List
1. First item
2. Second item
3. Third item

## Links and Images

[Visit GitHub](https://github.com)

![Markdown Logo](https://markdown-here.com/img/icon256.png)

## Code

Inline \`code\` example.

\`\`\`javascript
function sayHello() {
  console.log("Hello, world!");
}
\`\`\`

## Blockquotes

> This is a blockquote.
> It can span multiple lines.

---

## Tables

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

`);
  };
  
  // Clear the editor
  const handleClear = () => {
    if (markdown && !confirm("Are you sure you want to clear the editor?")) return;
    setMarkdown("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50">
      {/* Header Section */}
      <section className="relative pt-24 pb-10 md:pt-32 md:pb-16">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-violet-50/50"></div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-indigo-50 blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-violet-50 blur-3xl opacity-20"></div>
          
          {/* Animated dots */}
          <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-indigo-400 opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-violet-400 opacity-30 animate-pulse [animation-delay:1s]"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-indigo-400 opacity-40 animate-pulse [animation-delay:2s]"></div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-indigo-300/10 to-violet-300/10 blur-xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-indigo-200/10 to-violet-200/10 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-2">
            <Link 
              href={categoryPath}
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl p-3 w-14 h-14 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <PencilSquareIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Markdown Editor</h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">Write and preview Markdown with real-time HTML conversion</p>
              </div>
            </div>
            
            <div className="inline-flex px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium shadow-sm">
              <span>Text tool</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl border border-gray-100 relative overflow-hidden mb-10">
            {/* Card accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
            
            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-100/40 to-violet-100/40 blur-2xl"></div>
            
            <div className="relative">
              {/* Editor Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      activeTab === "edit" 
                        ? "bg-indigo-100 text-indigo-700" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      activeTab === "preview" 
                        ? "bg-indigo-100 text-indigo-700" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("split")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      activeTab === "split" 
                        ? "bg-indigo-100 text-indigo-700" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Split View
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleLoadSample}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Load Sample
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              {/* Markdown Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-t-xl border border-gray-200 border-b-0">
                <button
                  onClick={() => insertMarkdown("# placeholder", "placeholder")}
                  title="Heading 1"
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                >
                  H1
                </button>
                <button
                  onClick={() => insertMarkdown("## placeholder", "placeholder")}
                  title="Heading 2"
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                >
                  H2
                </button>
                <button
                  onClick={() => insertMarkdown("**placeholder**", "placeholder")}
                  title="Bold"
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors font-bold"
                >
                  B
                </button>
                <button
                  onClick={() => insertMarkdown("*placeholder*", "placeholder")}
                  title="Italic"
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors italic"
                >
                  I
                </button>
                <button
                  onClick={() => insertMarkdown("[placeholder](url)", "placeholder")}
                  title="Link"
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors underline"
                >
                  Link
                </button>
                <button
                  onClick={() => insertMarkdown("![alt text](image-url)", "alt text")}
                  title="Image"
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                >
                  Img
                </button>
                <button
                  onClick={() => insertMarkdown("`placeholder`", "placeholder")}
                  title="Inline Code"
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors font-mono"
                >
                  Code
                </button>
                <button
                  onClick={() => insertMarkdown("```\nplaceholder\n```", "placeholder")}
                  title="Code Block"
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors font-mono"
                >
                  {'</>'}
                </button>
                <button
                  onClick={() => insertMarkdown("* placeholder", "placeholder")}
                  title="Unordered List"
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                >
                  • List
                </button>
                <button
                  onClick={() => insertMarkdown("1. placeholder", "placeholder")}
                  title="Ordered List"
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                >
                  1. List
                </button>
                <button
                  onClick={() => insertMarkdown("> placeholder", "placeholder")}
                  title="Blockquote"
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                >
                  "Quote"
                </button>
                <button
                  onClick={() => insertMarkdown("\n---\n")}
                  title="Horizontal Rule"
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                >
                  HR
                </button>
              </div>
              
              {/* Editor and Preview Containers */}
              <div className={`flex ${activeTab === "split" ? "flex-row" : "flex-col"} w-full border border-gray-200 rounded-b-xl ${activeTab === "split" ? "rounded-tr-xl" : ""}`}>
                {/* Markdown Editor */}
                {(activeTab === "edit" || activeTab === "split") && (
                  <div className={`${activeTab === "split" ? "w-1/2 border-r border-gray-200" : "w-full"}`}>
                    <textarea
                      id="markdown-editor"
                      value={markdown}
                      onChange={(e) => setMarkdown(e.target.value)}
                      placeholder="Write your markdown here..."
                      className="w-full h-80 p-4 font-mono text-gray-800 outline-none resize-none rounded-bl-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                )}
                
                {/* Preview */}
                {(activeTab === "preview" || activeTab === "split") && (
                  <div className={`${activeTab === "split" ? "w-1/2" : "w-full"} bg-white p-4 max-h-80 overflow-auto rounded-br-xl ${activeTab === "split" ? "rounded-tr-xl" : ""}`}>
                    {preview ? (
                      <div 
                        className="prose max-w-none" 
                        dangerouslySetInnerHTML={{ __html: preview }}
                      />
                    ) : (
                      <p className="text-gray-400 italic">Your markdown preview will appear here...</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Copy Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <div className="flex gap-3">
                  <button 
                    onClick={handleCopyMarkdown}
                    disabled={!markdown}
                    className={`
                      px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors text-sm font-medium
                      ${markdown ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    {copiedMarkdown ? (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        Markdown Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardIcon className="h-4 w-4" />
                        Copy Markdown
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={handleCopyHtml}
                    disabled={!preview}
                    className={`
                      px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors text-sm font-medium
                      ${preview ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    {copiedHtml ? (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        HTML Copied!
                      </>
                    ) : (
                      <>
                        <CodeBracketIcon className="h-4 w-4" />
                        Copy HTML
                      </>
                    )}
                  </button>
                </div>
                
                <div className="text-sm text-gray-500">
                  {markdown ? `${markdown.length} characters` : "No content yet"}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Markdown Syntax Guide</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-indigo-700 mb-3">Basic Syntax</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Headings</p>
                        <pre className="text-xs font-mono bg-gray-100 p-2 rounded">
                          # Heading 1
                          <br />
                          ## Heading 2
                          <br />
                          ### Heading 3
                        </pre>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Emphasis</p>
                        <pre className="text-xs font-mono bg-gray-100 p-2 rounded">
                          **Bold Text**
                          <br />
                          *Italic Text*
                          <br />
                          ~~Strikethrough~~
                        </pre>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Lists</p>
                        <pre className="text-xs font-mono bg-gray-100 p-2 rounded">
                          * Unordered item
                          <br />
                          * Unordered item
                          <br />
                          <br />
                          1. Ordered item
                          <br />
                          2. Ordered item
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-indigo-700 mb-3">Extended Syntax</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Links & Images</p>
                        <pre className="text-xs font-mono bg-gray-100 p-2 rounded">
                          [Link Text](https://example.com)
                          <br />
                          ![Alt Text](image-url.jpg)
                        </pre>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Code</p>
                        <pre className="text-xs font-mono bg-gray-100 p-2 rounded">
                          `Inline code`
                          <br />
                          <br />
                          ```
                          <br />
                          Code block
                          <br />
                          ```
                        </pre>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Other Elements</p>
                        <pre className="text-xs font-mono bg-gray-100 p-2 rounded">
                          {">"} Blockquote
                          <br />
                          <br />
                          --- (Horizontal Rule)
                          <br />
                          <br />
                          | Header | Header |
                          <br />
                          |--------|--------|
                          <br />
                          | Cell   | Cell   |
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 shadow-lg border border-indigo-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Markdown
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Markdown is a lightweight markup language created by John Gruber in 2004. It allows you to write using an easy-to-read, easy-to-write plain text format that converts to structurally valid HTML.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-indigo-100">
                    <h3 className="font-medium text-gray-900 mb-2">Why Use Markdown?</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Simple syntax that's easy to learn</li>
                      <li>• Focus on content instead of formatting</li>
                      <li>• Portable and converts to many formats</li>
                      <li>• Widely used in documentation, README files, forums, and blogging platforms</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-indigo-200/50">
                  <h3 className="font-medium text-gray-900 mb-2">Popular Uses</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">GitHub:</span> Used for README files, wikis, and issue comments
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Documentation:</span> Many technical documentation systems are based on Markdown
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2 font-bold">•</span>
                      <div>
                        <span className="font-medium text-gray-800">Blogs:</span> Platforms like Jekyll, Hugo, and Ghost use Markdown for content
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 bg-white rounded-xl p-4 border border-indigo-100">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pro Tip
                  </h3>
                  <p className="text-sm text-gray-600">
                    Use keyboard shortcuts like Ctrl+B (bold) and Ctrl+I (italic) in many Markdown editors. Our toolbar buttons help if you forget the syntax.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases Section with Icons */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Use Markdown Editor?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Documentation</h3>
                <p className="text-gray-600">Create well-formatted documentation, README files, and user guides with structured headings, code blocks, and lists.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Blog Content</h3>
                <p className="text-gray-600">Draft blog posts with proper formatting, links, images, and emphasis that can be easily imported into most blogging platforms.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Forum Posts</h3>
                <p className="text-gray-600">Format messages for Reddit, Stack Overflow, GitHub issues, and other platforms that support Markdown syntax for better readability.</p>
              </div>
            </div>
          </div>
          
          {/* Popular tools section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Text Tools</h2>
            <PopularTools
              tools={[
                {
                  id: 'word-counter',
                  name: 'Word Counter',
                  description: 'Count words, characters, and more',
                  icon: 'CalculatorIcon',
                  color: 'purple',
                  url: '/tools/word-counter',
                },
                {
                  id: 'case-converter',
                  name: 'Case Converter',
                  description: 'Convert text between different cases',
                  icon: 'ArrowsUpDownIcon',
                  color: 'pink',
                  url: '/tools/case-converter',
                },
                {
                  id: 'text-to-speech',
                  name: 'Text to Speech',
                  description: 'Convert text to natural-sounding speech',
                  icon: 'SpeakerWaveIcon',
                  color: 'blue',
                  url: '/tools/text-to-speech',
                },
              ]}
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 
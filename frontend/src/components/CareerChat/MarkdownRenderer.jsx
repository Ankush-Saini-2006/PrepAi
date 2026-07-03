const inlinePatterns = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
const codeTokenPattern = /(\/\/.*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:const|let|var|function|return|if|else|for|while|class|import|from|export|async|await|try|catch|new|true|false|null|undefined)\b|\b\d+\b)/g;

const renderInline = (text) => {
  return text.split(inlinePatterns).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-black/5 px-1.5 py-0.5 text-[0.85em] text-primary-700 dark:bg-white/10 dark:text-violet-300">
          {part.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary-700 underline underline-offset-2 dark:text-violet-300"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

const renderCode = (code) => {
  return code.split(codeTokenPattern).filter(Boolean).map((part, index) => {
    let className = "";
    if (part.startsWith("//")) className = "text-slate-400";
    else if (/^["'`]/.test(part)) className = "text-emerald-400";
    else if (/^\d+$/.test(part)) className = "text-amber-300";
    else if (/^(const|let|var|function|return|if|else|for|while|class|import|from|export|async|await|try|catch|new|true|false|null|undefined)$/.test(part)) {
      className = "text-violet-300";
    }
    return className ? <span key={index} className={className}>{part}</span> : <span key={index}>{part}</span>;
  });
};

const isTableBlock = (lines) => {
  return lines.length >= 2 && lines[0].includes("|") && /^[-|\s:]+$/.test(lines[1]);
};

const TableBlock = ({ lines }) => {
  const headers = lines[0].split("|").map((item) => item.trim()).filter(Boolean);
  const rows = lines.slice(2).map((line) => line.split("|").map((item) => item.trim()).filter(Boolean));

  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-[color:var(--page-border)]">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <thead className="bg-[var(--page-surface-soft)] text-[color:var(--page-text)]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-3 py-2 font-semibold">{renderInline(header)}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--page-border)]">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="px-3 py-2 theme-text-muted">{renderInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CodeBlock = ({ language, code }) => (
  <div className="my-4 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
    <div className="border-b border-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {language || "code"}
    </div>
    <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-100">
      <code>{renderCode(code)}</code>
    </pre>
  </div>
);

const MarkdownRenderer = ({ content = "" }) => {
  const blocks = [];
  const lines = content.split(/\r?\n/);
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.startsWith("```")) {
      const language = line.replace("```", "").trim();
      const codeLines = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      blocks.push({ type: "code", language, code: codeLines.join("\n") });
      index += 1;
      continue;
    }

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const tableLines = [];
    while (index < lines.length && lines[index].includes("|")) {
      tableLines.push(lines[index]);
      index += 1;
    }
    if (isTableBlock(tableLines)) {
      blocks.push({ type: "table", lines: tableLines });
      continue;
    }
    if (tableLines.length > 0) {
      tableLines.forEach((tableLine) => blocks.push({ type: "paragraph", text: tableLine }));
      continue;
    }

    if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^#+/)[0].length;
      blocks.push({ type: "heading", level, text: line.replace(/^#{1,6}\s/, "") });
      index += 1;
      continue;
    }

    if (/^(-|\*)\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^(-|\*)\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^(-|\*)\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "orderedList", items });
      continue;
    }

    const paragraphLines = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith("```") &&
      !/^#{1,6}\s/.test(lines[index]) &&
      !/^(-|\*)\s+/.test(lines[index]) &&
      !/^\d+\.\s+/.test(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return (
    <div className="space-y-3 text-sm leading-7 theme-text-muted">
      {blocks.map((block, blockIndex) => {
        if (block.type === "code") {
          return <CodeBlock key={blockIndex} language={block.language} code={block.code} />;
        }
        if (block.type === "table") {
          return <TableBlock key={blockIndex} lines={block.lines} />;
        }
        if (block.type === "heading") {
          const className = block.level <= 2 ? "text-base font-bold text-[color:var(--page-text)]" : "text-sm font-semibold text-[color:var(--page-text)]";
          return <p key={blockIndex} className={className}>{renderInline(block.text)}</p>;
        }
        if (block.type === "list") {
          return (
            <ul key={blockIndex} className="list-disc space-y-1 pl-5">
              {block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}
            </ul>
          );
        }
        if (block.type === "orderedList") {
          return (
            <ol key={blockIndex} className="list-decimal space-y-1 pl-5">
              {block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}
            </ol>
          );
        }
        return <p key={blockIndex}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
};

export default MarkdownRenderer;

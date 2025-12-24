import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse HTML content to plain text
 * Removes HTML tags and extracts text content
 */
export function parseHtmlToText(html: string): string {
  if (!html) return '';

  // Create a temporary div element
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Get text content and normalize whitespace
  let text = tempDiv.textContent || tempDiv.innerText || '';

  // Normalize whitespace - replace multiple spaces/newlines with single space
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Parse HTML content to array of text lines
 * Useful for bullet points or list items
 */
export function parseHtmlToLines(html: string): string[] {
  if (!html) return [];

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Get all text nodes and split by line breaks or list items
  const lines: string[] = [];

  // Check if content is in a list (ol/ul)
  const listItems = tempDiv.querySelectorAll('li, ol li, ul li');
  if (listItems.length > 0) {
    listItems.forEach((li) => {
      const text = li.textContent || (li as HTMLElement).innerText || '';
      if (text.trim()) {
        lines.push(text.trim());
      }
    });
  } else {
    // If not a list, split by paragraphs or line breaks
    const paragraphs = tempDiv.querySelectorAll('p');
    if (paragraphs.length > 0) {
      paragraphs.forEach((p) => {
        const text = p.textContent || (p as HTMLElement).innerText || '';
        if (text.trim()) {
          lines.push(text.trim());
        }
      });
    } else {
      // Fallback: split by newlines or get all text
      const text = tempDiv.textContent || (tempDiv as HTMLElement).innerText || '';
      const splitLines = text.split('\n').map(line => line.trim()).filter(line => line);
      if (splitLines.length > 0) {
        lines.push(...splitLines);
      } else if (text.trim()) {
        lines.push(text.trim());
      }
    }
  }

  return lines;
}
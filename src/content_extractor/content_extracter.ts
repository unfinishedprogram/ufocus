import { removeStopwords } from "./stopwords";
import { ExtractedContent } from "./types";

const HEADERS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

function allDocumentText(doc: Document): string[] {
	const selectors = "*:not(noscript > *):not(noscript):not(script):not(style):not(canvas):not(template)";
	return [...doc.querySelectorAll(selectors)]
		.map(e => e.childNodes[0])
		.filter(Boolean)
		.filter(node => node.nodeType == Node.TEXT_NODE)
		.map(node => node.textContent?.trim())
		.filter(Boolean) as string[];
}

function extractMainContent(doc: Document) {
	return removeStopwords(
		allDocumentText(doc)
			.flatMap(text => [...text.matchAll(/\w+/)].flatMap(m => m[0]))
			.join(" ")
	);
}

function extractHeaders(doc: Document) {
	return Object.fromEntries(
		HEADERS.map(type => ([
			type,
			[...doc.querySelectorAll(type)].map(v => v.textContent!)
		]))
	) as Record<typeof HEADERS[number], string[]>;
}

function extractMeta(doc: Document) {
	const entries = [...doc.querySelectorAll("meta")]
		.map(meta => [meta.name, meta.getAttribute("content")])

	return Object.fromEntries(entries);
}

function extractNavLinks(doc: Document) {
	let navContainer = doc.querySelector("nav") || doc.querySelector("header") || doc;
	const links = navContainer.querySelectorAll("a");
	return [...links].map(({ textContent }) => textContent!);
}

// Extracts important content from raw dom handle
export default function extractContent(window: Window): ExtractedContent {
	const headers = extractHeaders(window.document);
	const main_content = extractMainContent(window.document);
	const nav_links = extractNavLinks(window.document);
	const meta = extractMeta(window.document);

	return {
		meta,
		headers,
		main_content,
		nav_links,
		url: window.location.href,
	}
}
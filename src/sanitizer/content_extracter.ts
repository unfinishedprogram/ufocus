import { SanitizerInput } from "./types";

const HEADERS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

function extractMainContent(doc: Document) {
	return doc.querySelector("main")?.textContent ||
		doc.querySelector("body")?.textContent ||
		doc.querySelector("html")?.textContent ||
		doc.textContent!;
}

function extractHeaders(doc: Document) {
	return HEADERS.flatMap(type => (
		[...doc.querySelectorAll(type)].map(v => ({ content: v.textContent!, type }))
	));
}


function extractNavLinks(doc: Document) {
	let navContainer = doc.querySelector("nav") || doc.querySelector("header") || doc;

	const links = navContainer.querySelectorAll("a");
	return [...links].map(({ href, textContent }) => ({
		href: href,
		title: textContent!
	}));
}


// Extracts important content from raw dom handle
export default function extractContent(window: Window): SanitizerInput {
	const headers = extractHeaders(window.document);
	const main_content = extractMainContent(window.document);
	const nav_links = extractNavLinks(window.document);

	return {
		headers,
		main_content,
		nav_links,
		url: window.location.href,
	}
}
export type ExtractedContent = {
	url: string,
	headers: Record<"h1" | "h2" | "h3" | "h4" | "h5" | "h6", string[]>,
	nav_links: string[],
	main_content: string,
	meta: Record<string, string>;
}
export type SanitizerInput = {
	url: string,
	headers: {
		type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
		content: string,
	}[],
	nav_links: { href: string, title: string }[],
	main_content: string,
	nav?: string
}
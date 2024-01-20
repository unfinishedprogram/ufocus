export type SanitizerInput = {
    url: string,
    headers: {
        type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
        content: string,
    }[],
    main_content: string,
    nav?: string
}
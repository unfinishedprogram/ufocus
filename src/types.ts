export type RelevanceQueryResult = {
    relevance: number,
    // keywords: string[],
    // reason: string,
}

export type RelevanceQueryRequest = {
    type: "relevance",
    profile: Profile,
    content: string,
}

export type Profile = {
    uuid: string,
    name: string,
    persona: string,
}

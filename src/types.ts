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
    whitelisted_topics: string[],
    blacklisted_topics: string[],
    persona: string,
}

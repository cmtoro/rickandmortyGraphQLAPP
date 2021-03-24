export interface Character {
    id: number,
    name: string,
    status: string,
    species: string,
    type: string,
    gender: string,
    image: string,
    created: string,
    isFavorite?: boolean
}

export interface Episode {
    episode: string,
    name: string
}

export interface APIResponse<T> {
    results: T
}

export interface DataResponse {
    characters: APIResponse<Character[]>,
    episodes: APIResponse<Episode[]>
}
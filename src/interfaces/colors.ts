/**
 * The response for the /colors endpoint
 */
export interface ColorsResponse {
    data: Filament[];
}

export interface Filament {
    filament: string;
    hexColor: string;
    colorTag: string;
    profile:  string;
}

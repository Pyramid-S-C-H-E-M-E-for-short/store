/**
 * The response for the /colors endpoint
 */
export interface ColorsResponse {
    filaments: Filament[];
}

export interface Filament {
    filament: string;
    hexColor: string;
    colorTag: string;
    profile:  string;
}

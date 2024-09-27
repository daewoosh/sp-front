

export interface PublicationShortDto {
  name: string;
  tags: string[];
  description: string;
  coverImageUrl: string;
  coverAlt?: string;
  coverTitle?: string;
  publishDate: string;
  title: string;
}

export interface PublicationDto {
  id?: number,
  name?: string;
  htmlTitle?: string;
  htmlDescription?: string;
  shortDescription?: string;
  title?: string;
  publicationType: PublicationType;
  coverImageUrl?: string;
  coverAlt?:string;
  coverTitle?:string;
  tags?: TagDto[];
  relatedPublicationsUrls?: string[];
  publishDate?: Date;
  fullHtml?: string;
  relatedPublicationList?: PublicationShortDto[];
}

export enum PublicationState{
  Created,
  Active,
  Deleted,
}
export enum PublicationType {
  None = 0,
  Article,
  News
}

export interface TagDto {
  id: number | null,
  value: string;
  publicationType: PublicationType;
}

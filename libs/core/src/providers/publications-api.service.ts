import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  PagingResult,
  PublicationDto,
  PublicationShortDto,
  PublicationState,
  PublicationType,
  TagDto
} from "../models";
import { API_PATH } from "@sp/config";

@Injectable({
  providedIn: 'root'
})
export class PublicationsApiService {

  private readonly CONTROLLER_NAME = 'publications';

  constructor(private http: HttpClient, @Inject(API_PATH) private apiPath: string) {
  }

  getTags(publicationType: PublicationType): Observable<TagDto[]> {
    const params = new HttpParams().set('publicationType', publicationType);
    return this.http.get<TagDto[]>(`${this.apiPath}/${this.CONTROLLER_NAME}/getTags`, {params});
  }

  getPublications(publicationType: PublicationType, tagId: number | null, pageSize: number, pageNumber: number): Observable<PagingResult<PublicationShortDto>> {
    const request = {publicationType, tagId, pageSize, pageNumber}
    return this.http.post<PagingResult<PublicationShortDto>>(`${this.apiPath}/${this.CONTROLLER_NAME}/getPublications`, request);
  }

  getActivePublications(publicationType: PublicationType, tagId: number | null, pageSize: number, pageNumber: number): Observable<PagingResult<PublicationShortDto>> {
    const request = {publicationType, tagId, pageSize, pageNumber};
    return this.http.post<PagingResult<PublicationShortDto>>(`${this.apiPath}/${this.CONTROLLER_NAME}/getActivePublications`, request);
  }

  getPublicationByName(name: string, publicationType: PublicationType, loadAdditionalRelatedArticles: boolean): Observable<PublicationDto> {
    const params = new HttpParams().set('name', name)
      .set('publicationType', publicationType)
      .set('loadAdditionalRelatedArticles', loadAdditionalRelatedArticles);
    return this.http.get<PublicationDto>(`${this.apiPath}/${this.CONTROLLER_NAME}/getPublicationByName`, {params});
  }

  savePublication(image: any, id: number | undefined, name: string, shortDescription: string, title: string,
                  publicationType: PublicationType, relatedPublications: string, fullHtml: string,
                  tags: string, htmlDescription: string, htmlTitle: string, coverAlt: any, coverTitle: any, publishDate: Date | null,
                  publicationState: PublicationState): Observable<PublicationDto> {
    const formData = new FormData();
    formData.append("image", image);
    if (id) {
      formData.append("id", id.toString());
    }
    if (publishDate)
      formData.append('publishDate', publishDate.toISOString())
    formData.append('publicationState', publicationState.toString());
    formData.append("name", name);
    formData.append("shortDescription", shortDescription);
    formData.append("title", title);
    formData.append("publicationType", publicationType.toString());
    formData.append("relatedPublications", relatedPublications);
    formData.append("fullHtml", fullHtml);
    if (tags && tags.length > 0) {
      formData.append("tags", tags);
    }
    if (htmlDescription)
      formData.append("htmlDescription", htmlDescription);

    if (htmlTitle)
      formData.append("htmlTitle", htmlTitle);

    if (coverAlt)
      formData.append("coverAlt", coverAlt);

    if (coverTitle)
      formData.append("coverTitle", coverTitle);
    return this.http.post<PublicationDto>(`${this.apiPath}/${this.CONTROLLER_NAME}/savePublication`, formData);
  }

  deletePublication(id: number) {
    const request = {id}
    return this.http.post<PagingResult<PublicationShortDto>>(`${this.apiPath}/${this.CONTROLLER_NAME}/deletePublication`, request);
  }

  public uploadFile(file: any): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiPath}/${this.CONTROLLER_NAME}/uploadFile`, formData);
  }
}

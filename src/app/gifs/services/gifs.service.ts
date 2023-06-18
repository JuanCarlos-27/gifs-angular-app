import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, ISearchResponse } from '../interfaces/gifs.interfaces';
import { Observable, catchError } from 'rxjs';

const GIPHY_API_KEY = '2myOkWh7DVKDFlvpCfdyPOv7v7q5uYnu';
const BASE_URL = 'https://api.giphy.com/v1/gifs/search';

@Injectable({ providedIn: 'root' })
export class GifsService {
  private _tagsHistory: string[] = [];
  public gifList: Gif[] = [];

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  get tagsHistory() {
    return structuredClone(this._tagsHistory);
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(
        (itemTag) => itemTag !== tag
      );
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveIntoLocalStorage();
  }

  private saveIntoLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadFromLocalStorage(): void {
    if (!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(String(localStorage.getItem('history')));

    if (!this._tagsHistory.length) return;

    const lastTagHistory = this._tagsHistory[0];
    this.searchTag(lastTagHistory);
  }

  //   private async fetchGifsData(tag: string) {
  //     const BASE_URL = 'https://api.giphy.com/v1/gifs/search';
  //     try {
  //       const response = await fetch(
  //         `${BASE_URL}?api_key=${GIPHY_API_KEY}&limit=10&q=${tag}`
  //       );
  //       const dataJson = await response.json();
  //       return dataJson;
  //     } catch (error) {
  //       return null;
  //     }
  //   }

  searchTag(tag: string) {
    if (!tag.trim()) return;

    const params = new HttpParams()
      .set('api_key', GIPHY_API_KEY)
      .set('limit', 10)
      .set('q', tag);

    this.http
      .get<ISearchResponse>(`${BASE_URL}`, { params })
      .pipe(
        catchError((err): Observable<ISearchResponse> => {
          console.log(err);
          return err;
        })
      )
      .subscribe((res) => {
        this.gifList = res.data;
      });

    this.organizeHistory(tag);
  }
}

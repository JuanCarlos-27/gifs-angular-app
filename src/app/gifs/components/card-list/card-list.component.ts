import { Component, Input } from '@angular/core';
import { Gif } from '../../interfaces/gifs.interfaces';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'gifs-card-list',
  templateUrl: './card-list.component.html',
})
export class CardListComponent {
  constructor(private gifsService: GifsService) {}

  @Input()
  public gifsList: Gif[] = [];

  get isLoading(): boolean {
    return this.gifsService.isLoading;
  }
}

import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import {HttpClient, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef)
  ngOnInit() {
    const subscription = this.httpClient.get<{places: Place[]}>('http://localhost:3000/places', {
      observe: 'response'
    }).subscribe({
      next: (response) => {
        const places = response.body?.places;
        if (places && places.length > 0) {
          this.places.set(places)
        }
      }
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }
}

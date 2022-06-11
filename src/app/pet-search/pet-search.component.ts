import { Component, OnInit } from "@angular/core";

import { Observable, Subject } from "rxjs";

import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";

import { Pet } from 'src/app/pets/pet';
import { PetService } from 'src/app/pet.service';

@Component({
  selector: "app-pet-search",
  templateUrl: "./pet-search.component.html",
  styleUrls: ["./pet-search.component.css"]
})
export class PetSearchComponent implements OnInit {
  pets: Observable<Pet[]>;
  private searchTerms = new Subject<string>();

  constructor(private petService: PetService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.pets = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.petService.searchPets(term))
    );
  }
}

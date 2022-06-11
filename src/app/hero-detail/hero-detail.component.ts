import { Component, OnInit, Input } from '@angular/core';
import { Hero } from 'src/app/heroes/hero'; //mudei esta linha => .../hero
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from 'src/app/hero.service';
import { Pet } from 'src/app/pets/pet';
import { PetService } from 'src/app/pet.service';
import { Observable, Subject } from "rxjs";

import {
   debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;
  @Input() pet: Pet;
  pets: Observable<Pet[]>;
  private searchTerms = new Subject<string>();

  constructor(
  private route: ActivatedRoute,
  private heroService: HeroService,
  private petService: PetService,
  private location: Location) { }

  ngOnInit(): void {
    this.getHero();
    this.pets = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.petService.searchPets(term)),
    );
  }
  
  search(term: string): void {
    this.searchTerms.next(term);
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
        .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  savePet(pet: Pet): void {
    this.hero.pet = pet;
    this.save();
  }

  save(): void {
   this.heroService.updateHero(this.hero)
     .subscribe(() => this.goBack());
  }

}

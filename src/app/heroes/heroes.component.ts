import { Component, OnInit, Input } from '@angular/core';
import { Hero } from 'src/app/heroes/hero'; //mudei esta linha => .../hero
import { HeroService } from 'src/app/hero.service';
import { Pet } from 'src/app/pets/pet'; //mudei esta linha => .../hero
import { PetService } from 'src/app/pet.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  @Input() hero: Hero;

  constructor(private heroService: HeroService,
              private petService: PetService,
              private route: ActivatedRoute,
              private location: Location) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
        .subscribe(hero => {
          this.heroes.push(hero);
        });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
}

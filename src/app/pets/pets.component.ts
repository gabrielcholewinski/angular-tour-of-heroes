import { Component, OnInit } from '@angular/core';
import { Pet } from 'src/app/pets/pet';
import { PetService } from 'src/app/pet.service';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css']
})
export class PetsComponent implements OnInit {
  pets: Pet[];
  selectedPet: Pet;

  constructor(private petService: PetService) { }

  ngOnInit(): void {
    this.getPets();
  }

  getPets(): void {
    this.petService.getPets().subscribe(pets => this.pets = pets);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.petService.addPet({ name } as Pet)
        .subscribe(pet => {
          this.pets.push(pet);
        });
  }

  delete(pet: Pet): void {
    this.pets = this.pets.filter(h => h !== pet);
    this.petService.deletePet(pet).subscribe();
  }

}

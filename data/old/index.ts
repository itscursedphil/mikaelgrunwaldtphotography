import animals from './animals.json';
import city from './city.json';
import nature from './nature.json';
import people from './people.json';

export interface Photo {
  full: string;
  small: string;
}

export interface ProjectsData {
  animals: Photo[];
  city: Photo[];
  nature: Photo[];
  people: Photo[];
}

export default {
  animals,
  city,
  nature,
  people,
};

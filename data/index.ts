import ingeg from './ingeg.json';
import marhabad from './marhabad.json';
import tanger from './tanger.json';
import thorup from './thorup.json';

export interface Photo {
  full: string;
  small: string;
}

export interface Project {
  title: string;
  desciption?: string;
  photos: Photo[];
}

export interface ProjectsData {
  ingeg: Project;
  marhabad: Project;
  tanger: Project;
  thorup: Project;
}

export default {
  ingeg,
  marhabad,
  tanger,
  thorup,
};

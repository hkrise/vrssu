export type SpeciesClass = {
  key: string;
  name: string;
  files: string[];
};

/** Scientific names are taken from PNG filenames (without extension). */
export const speciesClasses: SpeciesClass[] = [
  {
    key: 'algae',
    name: 'Algae',
    files: [
      'Corallina pilulifera.png',
      'Encrusting coralline alga.png',
      'Hildenbrandia rubra.png',
      'Neoralfsia expansa.png',
      'Ulva lactuca.png',
    ],
  },
  {
    key: 'barnacles',
    name: 'Barnacles',
    files: [
      'Capitulum mitella.png',
      'Chthamalus malayensis.png',
      'Megabalanus volcano.png',
      'Tetraclita japonica.png',
      'Tetraclita squamosa.png',
    ],
  },
  {
    key: 'bivalves',
    name: 'Bivalves',
    files: [
      'Barbatia virescens.png',
      'Cardita leana.png',
      'Mytilisepta virgata.png',
      'Perna viridis.png',
      'Saccostrea cucullata.png',
    ],
  },
  {
    key: 'chitons',
    name: 'Chitons',
    files: ['Liolophura japonica.png'],
  },
  {
    key: 'crabs',
    name: 'Crabs',
    files: [
      'Eriphia smithii.png',
      'Grapsus albolineatus.png',
      'Petrolisthes japonicus.png',
    ],
  },
  {
    key: 'cyanobacteria',
    name: 'Cyanobacteria',
    files: ['Kyrtuthrix maculans.png'],
  },
  {
    key: 'gastropods',
    name: 'Gastropods',
    files: [
      'Cellana grata.png',
      'Cellana toreuma.png',
      'Chlorostoma argyrostomum.png',
      'Echinolittorina malaccana.png',
      'Echinolittorina radiata.png',
      'Echinolittorina vidua.png',
      'Lottia dorsuosa.png',
      'Lottia luchuana.png',
      'Lunella coronata.png',
      'Monodonta labio.png',
      'Monodonta neritoides.png',
      'Nerita albicilla.png',
      'Patelloida saccharina.png',
      'Planaxis sulcatus.png',
      'Reishia clavigera.png',
      'Siphonaria japonica.png',
      'Siphonaria laciniosa.png',
      'Tenguella musiva.png',
    ],
  },
  {
    key: 'isopods',
    name: 'Isopods',
    files: ['Ligia exotica.png'],
  },
];

export function speciesNameFromFile(filename: string): string {
  return filename.replace(/\.png$/i, '');
}

import { FsEntry } from '@aminzer/dir-diff';
import DifferenceType from './difference_type';

type DifferenceSetStore = {
  [K in DifferenceType]: FsEntry[]
};

export default class DifferenceSet {
  private store: DifferenceSetStore;

  constructor() {
    this.store = {
      [DifferenceType.SOURCE_ONLY]: [],
      [DifferenceType.TARGET_ONLY]: [],
      [DifferenceType.DIFFERENT]: [],
    };
  }

  add(fsEntry: FsEntry, fsEntryType: DifferenceType): void {
    this.store[fsEntryType].push(fsEntry);
  }

  getAll(fsEntryType: DifferenceType): FsEntry[] {
    return this.store[fsEntryType];
  }

  isEmpty(): boolean {
    return [...Object.values(this.store)].flat().length === 0;
  }
}

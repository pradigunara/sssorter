/**
 * TripleSBiasSorter - A clean, reusable class for sorting tripleS members
 * using pairwise comparison algorithm
 */
export default class TripleSBiasSorter {
  constructor(memberNames, memberData = {}) {
    if (!Array.isArray(memberNames)) {
      throw new Error("Member names must be an array");
    }
    if (typeof memberData !== "object" || memberData === null) {
      throw new Error("Member data must be an object");
    }

    this.memberNames = [...memberNames];
    this.memberData = memberData;

    // Internal state
    this.lstMember = []; // The actual sorting lists
    this.parent = []; // Parent indices for tree structure
    this.equal = []; // Equal relationships
    this.rec = []; // Temporary recording array
    this.cmp1 = 0; // Current comparison list 1 index
    this.cmp2 = 0; // Current comparison list 2 index
    this.head1 = 0; // Current position in list 1
    this.head2 = 0; // Current position in list 2
    this.nrec = 0; // Record counter
    this.numQuestion = 0; // Question counter
    this.totalSize = 0; // Total comparisons needed
    this.finishSize = 0; // Completed comparisons
    this.finishFlag = 0; // Completion flag

    this.initialize();
  }

  /**
   * Initialize the sorting structure
   */
  initialize() {
    // Handle cases with 0 or 1 members
    if (this.memberNames.length <= 1) {
      this.finishFlag = 1;
      this.lstMember = [this.memberNames.map((_, i) => i)];
      this.totalSize = 0;
      this.finishSize = 0;
      this.numQuestion = 0;
      return;
    }

    // Create initial member indices array
    const initialMembers = [...Array(this.memberNames.length).keys()];

    this.lstMember = [initialMembers];
    this.parent = [-1];
    this.totalSize = 0;

    let n = 1;

    // Build the binary tree structure
    for (let i = 0; i < this.lstMember.length; i++) {
      if (this.lstMember[i].length >= 2) {
        const mid = Math.ceil(this.lstMember[i].length / 2);

        // Left half
        this.lstMember[n] = this.lstMember[i].slice(0, mid);
        this.totalSize += this.lstMember[n].length;
        this.parent[n] = i;
        n++;

        // Right half
        this.lstMember[n] = this.lstMember[i].slice(mid);
        this.totalSize += this.lstMember[n].length;
        this.parent[n] = i;
        n++;
      }
    }

    // Initialize arrays
    this.rec = new Array(this.memberNames.length).fill(0);
    this.nrec = 0;
    this.equal = new Array(this.memberNames.length + 1).fill(-1);

    // Set up initial comparison
    this.cmp1 = this.lstMember.length - 2;
    this.cmp2 = this.lstMember.length - 1;
    this.head1 = 0;
    this.head2 = 0;
    this.numQuestion = 1;
    this.finishSize = 0;
    this.finishFlag = 0;
  }

  /**
   * Get the current comparison pair
   * @returns {Object} - Object with memberA and memberB indices
   */
  getCurrentComparison() {
    if (this.cmp1 < 0) return null;

    const memberAIndex = this.lstMember[this.cmp1][this.head1];
    const memberBIndex = this.lstMember[this.cmp2][this.head2];

    return {
      memberA: memberAIndex,
      memberB: memberBIndex,
      memberAName: this.memberNames[memberAIndex],
      memberBName: this.memberNames[memberBIndex],
    };
  }

  /**
   * Apply the result of a comparison by indicating the preferred member.
   */
  preferMemberA() {
    this._applyComparisonResult(-1);
  }

  /**
   * Apply the result of a comparison by indicating the preferred member.
   */
  preferMemberB() {
    this._applyComparisonResult(1);
  }

  /**
   * Apply the result of a comparison by declaring it a tie.
   */
  declareTie() {
    this._applyComparisonResult(0);
  }

  /**
   * Internal method to apply the result of a comparison
   * @param {number} flag - -1 if memberA is preferred, 1 if memberB is preferred, 0 if equal
   * @private
   */
  _applyComparisonResult(flag) {
    if (this.isComplete()) return;

    if (![-1, 0, 1].includes(flag)) {
      throw new Error("Invalid flag: must be -1, 0, or 1");
    }

    if (flag < 0) {
      this._recordMember(this.lstMember[this.cmp1][this.head1]);
      this.head1++;
      this.finishSize++;

      while (this.equal[this.rec[this.nrec - 1]] !== -1) {
        this._recordMember(this.lstMember[this.cmp1][this.head1]);
        this.head1++;
        this.finishSize++;
      }
    } else if (flag > 0) {
      this._recordMember(this.lstMember[this.cmp2][this.head2]);
      this.head2++;
      this.finishSize++;

      while (this.equal[this.rec[this.nrec - 1]] !== -1) {
        this._recordMember(this.lstMember[this.cmp2][this.head2]);
        this.head2++;
        this.finishSize++;
      }
    } else {
      this._recordMember(this.lstMember[this.cmp1][this.head1]);
      this.head1++;
      this.finishSize++;

      while (this.equal[this.rec[this.nrec - 1]] !== -1) {
        this._recordMember(this.lstMember[this.cmp1][this.head1]);
        this.head1++;
        this.finishSize++;
      }

      this.equal[this.rec[this.nrec - 1]] =
        this.lstMember[this.cmp2][this.head2];
      this._recordMember(this.lstMember[this.cmp2][this.head2]);
      this.head2++;
      this.finishSize++;

      while (this.equal[this.rec[this.nrec - 1]] !== -1) {
        this._recordMember(this.lstMember[this.cmp2][this.head2]);
        this.head2++;
        this.finishSize++;
      }
    }

    // Handle remaining members when one list is exhausted
    if (
      this.head1 < this.lstMember[this.cmp1].length &&
      this.head2 === this.lstMember[this.cmp2].length
    ) {
      while (this.head1 < this.lstMember[this.cmp1].length) {
        this._recordMember(this.lstMember[this.cmp1][this.head1]);
        this.head1++;
        this.finishSize++;
      }
    } else if (
      this.head1 === this.lstMember[this.cmp1].length &&
      this.head2 < this.lstMember[this.cmp2].length
    ) {
      while (this.head2 < this.lstMember[this.cmp2].length) {
        this._recordMember(this.lstMember[this.cmp2][this.head2]);
        this.head2++;
        this.finishSize++;
      }
    }

    // Check if this comparison is complete
    if (
      this.head1 === this.lstMember[this.cmp1].length &&
      this.head2 === this.lstMember[this.cmp2].length
    ) {
      this._mergeLists();
    }

    this.numQuestion++;

    if (this.cmp1 < 0) {
      this.finishFlag = 1;
    }
  }

  /**
   * Get the final sorted member list
   * @returns {Array} - Array of member names in sorted order
   */
  getSortedMembers() {
    if (!this.isComplete()) return [];

    return this.lstMember[0].map((index) => this.memberNames[index]);
  }

  /**
   * Check if sorting is complete
   * @returns {boolean}
   */
  isComplete() {
    return this.finishFlag === 1 || this.memberNames.length <= 1;
  }

  /**
   * Get progress information
   * @returns {Object} - Progress data
   */
  getProgress() {
    const progressPercent = Math.floor(
      (this.finishSize * 100) / this.totalSize,
    );
    return {
      currentQuestion: this.numQuestion - 1,
      progressPercent,
      completedComparisons: this.finishSize,
      totalComparisons: this.totalSize,
      isComplete: this.isComplete(),
    };
  }

  /**
   * Reset the sorter to initial state
   */
  reset() {
    this.initialize();
  }

  // Private helper methods
  _recordMember(memberIndex) {
    this.rec[this.nrec] = memberIndex;
    this.nrec++;
  }

  _mergeLists() {
    const parentIndex = this.parent[this.cmp1];

    // Copy the sorted results to the parent list
    for (
      let i = 0;
      i < this.lstMember[this.cmp1].length + this.lstMember[this.cmp2].length;
      i++
    ) {
      this.lstMember[parentIndex][i] = this.rec[i];
    }

    // Remove the two child lists
    this.lstMember.pop();
    this.lstMember.pop();
    this.parent.pop();
    this.parent.pop();

    // Update comparison indices
    this.cmp1 -= 2;
    this.cmp2 -= 2;
    this.head1 = 0;
    this.head2 = 0;

    // Reset recording array for the next merge
    this.nrec = 0;
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = TripleSBiasSorter;
}

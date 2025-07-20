import TripleSBiasSorter from "../assets/sorter-class.js";

describe("TripleSBiasSorter", () => {
  let sorter;

  beforeEach(() => {
    // Reset before each test
  });

  describe("Constructor and Initialization", () => {
    test("should initialize with member names correctly", () => {
      const members = ["Kim Soohyun", "Park Jihoon", "Lee Minho"];
      sorter = new TripleSBiasSorter(members);

      expect(sorter.memberNames).toEqual(members);
      expect(sorter.memberNames.length).toBe(3);
    });

    test("should handle empty member list", () => {
      sorter = new TripleSBiasSorter([]);
      expect(sorter.memberNames).toEqual([]);
      expect(sorter.isComplete()).toBe(true);
    });

    test("should handle single member list", () => {
      const members = ["Kim Soohyun"];
      sorter = new TripleSBiasSorter(members);

      expect(sorter.isComplete()).toBe(true);
      expect(sorter.getSortedMembers()).toEqual(["Kim Soohyun"]);
    });

    test("should initialize with member data", () => {
      const members = ["Member1", "Member2"];
      const memberData = { Member1: { age: 20 }, Member2: { age: 22 } };
      sorter = new TripleSBiasSorter(members, memberData);

      expect(sorter.memberData).toEqual(memberData);
    });
  });

  describe("Basic Sorting Functionality", () => {
    test("should sort 2 members correctly when A is preferred over B", () => {
      const members = ["A", "B"];
      sorter = new TripleSBiasSorter(members);

      const comparison = sorter.getCurrentComparison();
      expect(comparison).toEqual({
        memberA: 0,
        memberB: 1,
        memberAName: "A",
        memberBName: "B",
      });

      sorter.preferMemberA();

      expect(sorter.isComplete()).toBe(true);
      expect(sorter.getSortedMembers()).toEqual(["A", "B"]);
    });

    test("should sort 2 members correctly when B is preferred over A", () => {
      const members = ["A", "B"];
      sorter = new TripleSBiasSorter(members);

      const comparison = sorter.getCurrentComparison();
      expect(comparison).not.toBeNull();

      sorter.preferMemberB();

      expect(sorter.isComplete()).toBe(true);
      expect(sorter.getSortedMembers()).toEqual(["B", "A"]);
    });

    test("should handle equal preference between 2 members", () => {
      const members = ["A", "B"];
      sorter = new TripleSBiasSorter(members);

      sorter.declareTie();

      expect(sorter.isComplete()).toBe(true);
      expect(sorter.getSortedMembers()).toEqual(["A", "B"]);
    });

    test("should sort 3 members correctly with various preferences", () => {
      const members = ["A", "B", "C"];
      sorter = new TripleSBiasSorter(members);

      // Simulate a complete sorting process
      // This will require multiple comparisons
      let comparison;

      // First comparison
      comparison = sorter.getCurrentComparison();
      expect(comparison).not.toBeNull();
      sorter.preferMemberA(); // Prefer first in pair

      // Continue until complete
      while (!sorter.isComplete()) {
        comparison = sorter.getCurrentComparison();
        if (comparison) {
          sorter.preferMemberA(); // Always prefer first for predictable test
        }
      }

      expect(sorter.isComplete()).toBe(true);
      expect(sorter.getSortedMembers().length).toBe(3);
    });
  });

  describe("Progress Tracking", () => {
    test("should track progress for 2 member sort", () => {
      const members = ["A", "B"];
      sorter = new TripleSBiasSorter(members);

      let progress = sorter.getProgress();
      expect(progress.isComplete).toBe(false);
      expect(progress.currentQuestion).toBe(0);
      expect(progress.totalComparisons).toBeGreaterThan(0);

      sorter.preferMemberA();

      progress = sorter.getProgress();
      expect(progress.isComplete).toBe(true);
      expect(progress.progressPercent).toBe(100);
    });

    test("should track progress for 3 member sort", () => {
      const members = ["A", "B", "C"];
      sorter = new TripleSBiasSorter(members);

      const initialProgress = sorter.getProgress();
      expect(initialProgress.isComplete).toBe(false);
      expect(initialProgress.totalComparisons).toBeGreaterThan(0);

      // Complete the sorting
      while (!sorter.isComplete()) {
        const comparison = sorter.getCurrentComparison();
        if (comparison) {
          sorter.preferMemberA();
        }
      }

      const finalProgress = sorter.getProgress();
      expect(finalProgress.isComplete).toBe(true);
      expect(finalProgress.progressPercent).toBe(100);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    test("should handle duplicate member names", () => {
      const members = ["A", "A", "B"];
      sorter = new TripleSBiasSorter(members);

      expect(sorter.memberNames).toEqual(members);
      expect(sorter.isComplete()).toBe(false);
    });

    test("should handle special characters in member names", () => {
      const members = ["Kim Soo-hyun", "Park Ji-hoon!", "Lee Min-ho#1"];
      sorter = new TripleSBiasSorter(members);

      expect(sorter.memberNames).toEqual(members);
      const comparison = sorter.getCurrentComparison();
      expect(comparison.memberAName).toBe("Kim Soo-hyun");
    });

    test("should handle numeric member names", () => {
      const members = ["1", "2", "3"];
      sorter = new TripleSBiasSorter(members);

      expect(sorter.memberNames).toEqual(members);
      expect(sorter.memberNames.length).toBe(3);
    });

    test("should handle method calls after completion", () => {
      const members = ["A", "B"];
      sorter = new TripleSBiasSorter(members);
      sorter.declareTie(); // Complete the sort

      expect(sorter.isComplete()).toBe(true);
      expect(sorter.getCurrentComparison()).toBeNull();

      // Applying another result should not change the outcome or state
      sorter.preferMemberA();
      expect(sorter.getSortedMembers()).toEqual(["A", "B"]);
    });

    test("should throw error for non-array member list", () => {
      expect(() => new TripleSBiasSorter("not an array")).toThrow(
        "Member names must be an array",
      );
    });

    test("should throw error for invalid memberData", () => {
      const members = ["A", "B"];
      expect(() => new TripleSBiasSorter(members, "not an object")).toThrow(
        "Member data must be an object",
      );
    });
  });

  describe("Reset Functionality", () => {
    test("should reset to initial state after sorting", () => {
      const members = ["A", "B", "C"];
      sorter = new TripleSBiasSorter(members);

      // Complete sorting
      while (!sorter.isComplete()) {
        const comparison = sorter.getCurrentComparison();
        if (comparison) {
          sorter.preferMemberA();
        }
      }

      expect(sorter.isComplete()).toBe(true);

      // Reset
      sorter.reset();

      expect(sorter.isComplete()).toBe(false);
      expect(sorter.getProgress().currentQuestion).toBe(0);
      expect(sorter.getProgress().progressPercent).toBe(0);
    });

    test("should maintain member names after reset", () => {
      const members = ["A", "B", "C"];
      sorter = new TripleSBiasSorter(members);

      sorter.reset();

      expect(sorter.memberNames).toEqual(members);
      expect(sorter.memberNames.length).toBe(3);
    });
  });

  describe("Medium List Sorting", () => {
    test("should sort 5 members correctly", () => {
      const members = ["A", "B", "C", "D", "E"];
      sorter = new TripleSBiasSorter(members);

      let iterations = 0;
      while (!sorter.isComplete() && iterations < 100) {
        const comparison = sorter.getCurrentComparison();
        if (comparison) {
          sorter.preferMemberA(); // Consistent preference
        }
        iterations++;
      }

      expect(sorter.isComplete()).toBe(true);
      expect(sorter.getSortedMembers().length).toBe(5);
    });

    test("should handle reverse order preference", () => {
      const members = ["A", "B", "C", "D"];
      sorter = new TripleSBiasSorter(members);

      let iterations = 0;
      while (!sorter.isComplete() && iterations < 100) {
        const comparison = sorter.getCurrentComparison();
        if (comparison) {
          sorter.preferMemberB(); // Prefer second in pair (reverse order)
        }
        iterations++;
      }

      expect(sorter.isComplete()).toBe(true);
      expect(sorter.getSortedMembers().length).toBe(4);
    });
  });

  describe("Large List Performance", () => {
    test("should handle 10 members efficiently", () => {
      const members = [
        "Member1",
        "Member2",
        "Member3",
        "Member4",
        "Member5",
        "Member6",
        "Member7",
        "Member8",
        "Member9",
        "Member10",
      ];
      sorter = new TripleSBiasSorter(members);

      let iterations = 0;
      const maxIterations = 1000;

      while (!sorter.isComplete() && iterations < maxIterations) {
        const comparison = sorter.getCurrentComparison();
        if (comparison) {
          sorter.preferMemberA();
        }
        iterations++;
      }

      expect(sorter.isComplete()).toBe(true);
      expect(sorter.getSortedMembers().length).toBe(10);
      expect(iterations).toBeLessThan(maxIterations);
    });
  });

  describe("Integration Tests", () => {
    test("should complete full sorting workflow", () => {
      const members = ["Alice", "Bob", "Charlie", "David"];
      sorter = new TripleSBiasSorter(members);

      // Test the complete workflow
      expect(sorter.isComplete()).toBe(false);
      expect(sorter.getSortedMembers()).toEqual([]);

      // Process all comparisons
      while (!sorter.isComplete()) {
        const comparison = sorter.getCurrentComparison();
        if (comparison) {
          // Make consistent choices for predictable results
          if (comparison.memberAName < comparison.memberBName) {
            sorter.preferMemberA(); // Prefer alphabetical first
          } else {
            sorter.preferMemberB();
          }
        }
      }

      expect(sorter.isComplete()).toBe(true);
      expect(sorter.getSortedMembers()).toEqual([
        "Alice",
        "Bob",
        "Charlie",
        "David",
      ]);
    });

    test("should handle multiple reset cycles", () => {
      const members = ["X", "Y", "Z"];
      sorter = new TripleSBiasSorter(members);

      // First cycle
      while (!sorter.isComplete()) {
        const comparison = sorter.getCurrentComparison();
        if (comparison) {
          sorter.preferMemberA();
        }
      }
      const firstResult = sorter.getSortedMembers();

      // Reset and second cycle
      sorter.reset();
      while (!sorter.isComplete()) {
        const comparison = sorter.getCurrentComparison();
        if (comparison) {
          sorter.preferMemberB();
        }
      }
      const secondResult = sorter.getSortedMembers();

      expect(firstResult).toEqual(["X", "Y", "Z"]);
      expect(secondResult).toEqual(["Z", "Y", "X"]);
    });
  });

  describe("State and Logic Validation", () => {
    test("should not mutate the original memberData object", () => {
      const members = ["A", "B"];
      const memberData = { A: { value: 1 }, B: { value: 2 } };
      const originalMemberData = JSON.parse(JSON.stringify(memberData));

      sorter = new TripleSBiasSorter(members, memberData);

      while (!sorter.isComplete()) {
        sorter.preferMemberA();
      }

      expect(memberData).toEqual(originalMemberData);
    });

    test("getSortedMembers should return a new array instance", () => {
      const members = ["A", "B"];
      sorter = new TripleSBiasSorter(members);

      while (!sorter.isComplete()) {
        sorter.preferMemberA();
      }

      const sorted1 = sorter.getSortedMembers();
      const sorted2 = sorter.getSortedMembers();

      expect(sorted1).not.toBe(sorted2);
    });
  });

  describe("Randomized and Property-Based Testing", () => {
    test("should correctly sort a randomly generated list", () => {
      const memberCount = 15;
      const randomMembers = Array.from(
        { length: memberCount },
        (_, i) => `Member${i}`,
      );

      sorter = new TripleSBiasSorter(randomMembers);

      while (!sorter.isComplete()) {
        // Make a random choice
        const choice = Math.random() > 0.5 ? "A" : "B";
        if (choice === "A") {
          sorter.preferMemberA();
        } else {
          sorter.preferMemberB();
        }
      }

      const sortedMembers = sorter.getSortedMembers();

      // Property 1: The sorted list has the same length
      expect(sortedMembers.length).toBe(memberCount);

      // Property 2: The sorted list contains the exact same members
      expect(sortedMembers.sort()).toEqual(randomMembers.sort());
    });
  });
});

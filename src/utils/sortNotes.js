export const sortNotes = (notes, sortNum, direction=1) => {
  const sortedNotes = notes.sort((a, b) => {

    switch (sortNum) {
      case "1":
        return a.name.localeCompare(b.name)*direction
      case "2":
        const priorityDiff = b.priority - a.priority;
        if (priorityDiff !== 0) return priorityDiff*direction
        return (b.timestampChange - a.timestampChange)*direction
      case "3":
        return (b.timestampCreate - a.timestampCreate)*direction
      case "4":
        return (b.timestampChange - a.timestampChange)*direction
      default:
        return 0;
    }
  });
  return sortedNotes;
};

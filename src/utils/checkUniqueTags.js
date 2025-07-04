export const checkUniqueTags = (notes) => {
  const initialTagsArr = notes
    .filter((note) => note.tag !== "no-tag")
    .map((note) =>note.tag);

  const uniqueTags = new Map();

  initialTagsArr.forEach((tag) => {
    if (tag !== "no-tag" && !uniqueTags.has(tag)) {
      uniqueTags.set(tag, {
        id: tag,
        name: tag
      });
    }
  });

  return Array.from(uniqueTags.values());
};

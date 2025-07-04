export const sortTags =(tagsArr)=>{
	const sortedTags = tagsArr.sort((a, b) => {
      if (a.name === "Все теги") return -1;
      if (b.name === "Все теги") return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
	 return sortedTags;
}
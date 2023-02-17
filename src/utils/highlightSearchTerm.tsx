const highlightSearchTerm = (text: string, searchQuery: string) => {
  const parts = [];
  let start = 0;

  for (let i = 0; i < text.length; i++) {
    if (
      text.substring(i, i + searchQuery.length).toLowerCase() === searchQuery
    ) {
      parts.push(text.substring(start, i));
      parts.push(text.substring(i, i + searchQuery.length));
      start = i + searchQuery.length;
    }
  }

  parts.push(text.substring(start));

  return parts.map((part, i) => {
    if (part.toLowerCase() === searchQuery) {
      return (
        <span className="font-bold" key={i}>
          {part}
        </span>
      );
    } else {
      return part;
    }
  });
};

export default highlightSearchTerm;

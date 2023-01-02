function setCapitalized(str: string) {
  if (str && str.length > 1) {
    const firstLetter = str[0]?.toUpperCase();
    const rest = str.slice(1);

    const capitalized = firstLetter?.concat(rest);
    return capitalized;
  }
}

export default setCapitalized;

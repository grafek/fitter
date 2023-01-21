const sleep = (delayMs = 200) => {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
};

export default sleep;

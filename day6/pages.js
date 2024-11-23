export default (container) => {
  const home = () => {
    container.textContent = "This is Home Page";
  };

  const list = () => {
    container.textContent = "This is List Page";
  };

  const notFound = () => {
    container.textContent = "Page Not Found";
  };

  return {
    home,
    list,
    notFound,
  };
};

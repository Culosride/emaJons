import { useSelector } from "react-redux";

const useScreenSize = (promptedSize) => {
  const screenSize = useSelector((state) => state.ui.screenSize);

  return promptedSize.includes(screenSize);
};

export default useScreenSize;

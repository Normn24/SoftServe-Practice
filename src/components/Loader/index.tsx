import { PacmanLoader } from "react-spinners";
import ModalWindow from "../ModalWindow";

const Loader = () => {
  return (
    <ModalWindow open={true} onClose={() => false}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pr-14 w-[400px]">
        <div className="flex justify-center items-center">
          <PacmanLoader color="#facc15" margin={4} size={35} />
        </div>
      </div>
    </ModalWindow>
  );
};

export default Loader;

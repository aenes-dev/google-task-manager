import { ClipLoader } from "react-spinners";

const LoadingScreen = () => {

    return (
<div
  className="
    fixed inset-0
    flex justify-center items-center
    bg-white dark:bg-slate-900
    z-999
  "
>
  <ClipLoader
    size={60}
    color="rgb(79 70 229)"   
  />
</div>
    );
};

export default LoadingScreen;
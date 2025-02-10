import { Bounce, toast } from "react-toastify";

export const toastError = (message) => {
  toast.error(message || 'Oops something went wrong', {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    transition: Bounce,
  });
}

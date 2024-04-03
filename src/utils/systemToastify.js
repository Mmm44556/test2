
import { toast } from 'react-toastify';
function createToast(context, opts) {
  return toast(context, opts);
}

function updateToast(toastId, opts) {
  return toast.update(toastId, opts);
}

function dismissToast(toastId = null) {
  toast.dismiss(toastId);
}
export { createToast, updateToast, dismissToast };
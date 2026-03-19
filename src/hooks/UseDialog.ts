export const useDialog = (id: string) => {
  const open = () => {
    const el = document.getElementById(id) as HTMLDialogElement | null;
    el?.showModal();
  };

  const close = () => {
    const el = document.getElementById(id) as HTMLDialogElement | null;
    el?.close();
  };

  return { open, close };
};
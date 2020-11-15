const Toast = {
  show: (
    msg: string,
    type: "success" | "info" | "warning" | "error" = "info"
  ) => {
    // @ts-ignore
    toastr[type](msg);
  },
  error: (error: Error & { code?: string }) => {
    // @ts-ignore
    toastr.error(`${error.code ?? error.name ?? ""}: ${error.message}`);
  },
};

export default Toast;

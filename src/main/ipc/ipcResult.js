
const R = {
  ok: (data, url, pid) => {
    const result = { status: true, data, url, pid };
    return result;
  },
  err: (message, url, pid) => {
    const result = { status: false, message, url, pid };
    return result;
  },
};

export default R;

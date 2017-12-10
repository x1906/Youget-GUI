
const R = {
  ok: (data) => {
    const result = { status: true, data };
    return result;
  },
  err: (message) => {
    const result = { status: false, message };
    return result;
  },
};

export default R;


const R = {
  /**
   * 正常返回
   */
  ok: (data, uid) => {
    const result = { status: true, data, uid };
    return result;
  },
  /**
  * 错误返回
  */
  err: (message, uid) => {
    const result = { status: false, message, uid };
    return result;
  },
};

export default R;

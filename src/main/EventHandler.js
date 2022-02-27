import { setBodyResponse } from "utils.js"

class EventHandler {
  async handleEvent(req, res, log, exec) {
    try {
      console.log(log);
      await exec(req, res);
    } catch (err) {
      this.handleEventError(res, err);
    }
  }

  handleEventError(res, err) {
    let status = err.status || process.env.HTTP_500_INTERNAL_SERVER_ERROR;

    if (status === process.env.HTTP_500_INTERNAL_SERVER_ERROR)
      console.log(err.stack);

    //console.log(err.stack);
    //console.log(err.message);
    setBodyResponse(res, status, { error: err.message });
  }
}

export { EventHandler };

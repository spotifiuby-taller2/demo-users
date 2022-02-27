function setBodyResponse(res, status, res_body) {
  console.log(`Response status: ${status}\n`);
  // console.log(`Response status: ${status}\n` +
  //  `\tResponse body: ${JSON.stringify(res_body)}`);
  res.status(status).json(res_body);
}

export {
  setBodyResponse
}

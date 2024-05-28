export default function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({ message: "서버 에러가 발생했습니다." });
  }
  
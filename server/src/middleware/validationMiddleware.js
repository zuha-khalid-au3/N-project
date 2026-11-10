export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      // Express 5 exposes req.query as a getter-only property.
      if (source === 'query') {
        req.validatedQuery = parsed;
      } else {
        req[source] = parsed;
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
